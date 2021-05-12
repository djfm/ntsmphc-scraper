import React, {
  useEffect,
  useState,
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
} from '../webSocketsUISide';

const ScrapingProjects = () => {
  const dispatch = useDispatch();
  const [projectsFetchedFromDisk, setProjectsFetchFromDisk] = useState(false);
  const projects = useSelector(getAllProjects);

  useEffect(() => {
    if (!projectsFetchedFromDisk) {
      setProjectsFetchFromDisk(true);
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
  // I know what I'm doing: my dependencies are hidden behind
  // the `if`, and the rule is not smart enough to detect it.
  // So the only real dependency here is `projectsFetchedFromDisk`.
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsFetchedFromDisk]);

  return (
    <main>
      <h1>Scraping Projects</h1>
      <p>
        You should find below the list of all <br />
        scraping projects that are known to this server.
      </p>
      <div>
        {projects.map((project: any) => (
          <article key={project.id}>
            <h2>
              <Link to={`/projects/${project.id}`}>
                {project.projectName}
              </Link>
            </h2>
            <dl>
              <dt>Start URL:</dt>
              <dd>{project.startURL}</dd>
            </dl>
          </article>
        ))}
      </div>
    </main>
  );
};

export default ScrapingProjects;
