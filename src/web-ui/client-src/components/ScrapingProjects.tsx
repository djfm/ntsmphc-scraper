import React, {
  useEffect,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Link,
} from 'react-router-dom';

import {
  addNotificationAction,
  setProjectsAction,
} from '../redux/actions';

import {
  getAllProjects,
} from '../redux/selectors';

import {
  askServer,
} from '../webSocketsIO';

const ScrapingProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector(getAllProjects);

  useEffect(() => {
    if (projects.length === 0) {
      askServer('listProjects', {}).then(
        (projectsFromDisk: object[]) => {
          dispatch(setProjectsAction(projectsFromDisk));
        },
        (err: Error) => {
          dispatch(addNotificationAction({
            message: err.message,
            severity: 'error',
          }));
        },
      );
    }
  });

  return (
    <main>
      <h1>Scraping Projects</h1>
      <p>
        You should find below the list of all <br />
        scraping projects that are known to this server.
      </p>
      <ul>
        {projects.map((project: any) => (
          <li key={project.id}>
            <article>
              <h2>
                <Link to={`/projects/${project.id}`}>
                  {project.projectName}
                </Link>
              </h2>
              <dl>
                <dt><strong>Start URL</strong>:</dt>
                <dd>{project.startURL}</dd>
              </dl>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ScrapingProjects;
