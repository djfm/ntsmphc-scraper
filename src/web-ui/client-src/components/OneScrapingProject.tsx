import React, { BaseSyntheticEvent } from 'react';

// TODO lots of factorization in this file

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  useParams as useRouterParams,
  useHistory,
} from 'react-router-dom';

import {
  getProjectById,
} from '../redux/selectors';

import {
  askServer,
} from '../webSocketsUISide';

import {
  addNotificationAction,
} from '../redux/actions';

const OneScrapingProject = () => {
  const routerParams = useRouterParams() as any;
  const id: number = parseFloat(routerParams.id);
  const project = useSelector(getProjectById(id));
  const history = useHistory();

  const dispatch = useDispatch();

  const createdDate = new Date(project.createdAt);

  const handleProjectDeletion = (projectId: number) => (event: BaseSyntheticEvent) => {
    event.preventDefault();
    askServer('deleteProject', ({ projectId })).then(
      () => {
        dispatch(addNotificationAction({
          message: `Successfully deleted project "${project.projectName}".`,
          severity: 'success',
        }));
        history.push('/projects');
      },
      (err: Error) => dispatch(addNotificationAction({
        message: err.message,
        severity: 'error',
      })),
    );
  };

  const handleStartScraping = (event: BaseSyntheticEvent) => {
    event.preventDefault();

    askServer('startSraping', { project }).then(
      (res: any) => {

      },
      (err: Error) => dispatch(addNotificationAction({
        message: err.message,
        severity: 'error',
      })),
    );
  };

  if (project === undefined) {
    return (
      <main>
        <h1>Scraping project #{id}</h1>
        <p>This project doesn&apos;t seem to exist!</p>
      </main>
    );
  }

  // TODO Add confirmation on Delete
  return (
    <main>
      <h1>Scraping Project: &quot;{project.projectName}&quot; (#{id})</h1>
      <p>
        <strong>Here is some basic info about this project</strong>:
      </p>
      <dl>
        <dt>Start URL:</dt>
        <dd>{project.startURL}</dd>
        <dt>Creation date:</dt>
        <dd>{createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}</dd>
      </dl>
      <p>
        <button type="button" onClick={handleStartScraping}>Start Scraping</button>
      </p>
      <p>
        <button type="button" onClick={handleProjectDeletion(id)}>
          Delete Project
        </button>
      </p>
    </main>
  );
};

export default OneScrapingProject;
