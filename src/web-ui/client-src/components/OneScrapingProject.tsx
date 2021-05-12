import React, {
  BaseSyntheticEvent,
  useState,
} from 'react';

// TODO lots of factorization in this file

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  useHistory,
  useParams as useRouterParams,
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

import {
  wrapFeedback,
} from '../util';

type SetterFunction<T> = React.Dispatch<T>;

const passValueTo = (setter: SetterFunction<any>) =>
  (event: BaseSyntheticEvent) =>
    setter(event.target.value);

const OneScrapingProject = () => {
  const routerParams = useRouterParams() as any;
  const id: number = parseFloat(routerParams.id);
  const project = useSelector(getProjectById(id));
  const history = useHistory();
  const [nParallel, setNParallel] = useState(3);

  const dispatch = useDispatch();

  const nParallelFeedback = [];

  if (nParallel <= 0) {
    nParallelFeedback.push('This value must be strictly greater than 0. ✘');
  }

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

  const createdDate = new Date(project.createdAt);

  // TODO Add confirmation on Delete
  return (
    <main>
      <h1>Scraping Project: &quot;{project.projectName}&quot; (#{id})</h1>
      <p>
        <strong>Here is some basic info about this project</strong>:
      </p>
      <dl>
        <dt><strong>Start URL</strong>:</dt>
        <dd>{project.startURL}</dd>
        <dt><strong>Creation date</strong>:</dt>
        <dd>{createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}</dd>
      </dl>
      <ul>
        <li>
          <label>
            <strong>Number of parallel Chrome instances</strong>
            <p>
              <i>
                To make things faster, I&apos;m gonna start many<br />
                Chrome instances in parallel to do the scraping.<br />
                Tuning it to an appropriate value depends on both<br />
                the performance of the server doing the scraping,<br />
                and of that of the server receiving the requests.
              </i>
            </p>
            <p>
              <input
                type="number"
                value={nParallel}
                onChange={passValueTo(setNParallel)}
              />
              {wrapFeedback(nParallelFeedback)}
            </p>
          </label>
          <p>
            <button type="button" onClick={handleStartScraping}>
              Start Scraping
            </button>
          </p>
        </li>
        <li>
          <p>
            <button type="button" onClick={handleProjectDeletion(id)}>
              Delete Project
            </button>
          </p>
        </li>
      </ul>
    </main>
  );
};

export default OneScrapingProject;
