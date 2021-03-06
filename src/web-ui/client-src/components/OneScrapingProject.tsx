import React, {
  BaseSyntheticEvent,
  useState,
  useEffect,
} from 'react';

// TODO lots of factorization in this file

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import {
  NavLink,
  Switch,
  Route,
  useHistory,
  useRouteMatch,
  useParams as useRouterParams,
} from 'react-router-dom';

import {
  getProjectById,
  getProjectScrapingState,
  getProjectIsScraping,
} from '../redux/selectors';

import {
  askServer,
} from '../webSocketsIO';

import {
  addNotificationAction,
  setProjectsAction,
  deleteProjectAction,
} from '../redux/actions';

import {
  wrapFeedback,
} from './common/util';

import Confirmator from './common/Confirmator';
import ScrapingFeedback from './ScrapingFeedback';
import ProjectReports from './ProjectReports';

type SetterFunction<T> = React.Dispatch<T>;

const passValueTo = (setter: SetterFunction<any>) =>
  (event: BaseSyntheticEvent) =>
    setter(event.target.value);

const OneScrapingProject = () => {
  const routerParams = useRouterParams() as any;
  const id: number = parseFloat(routerParams.id);
  const project = useSelector(getProjectById(id));
  const isScraping = useSelector(getProjectIsScraping(id));
  const history = useHistory();
  const [nParallel, setNParallel] = useState(3);
  const scrapingState = useSelector(getProjectScrapingState(id));
  const { path, url } = useRouteMatch();

  const dispatch = useDispatch();

  const nParallelFeedback = [];

  if (nParallel <= 0) {
    nParallelFeedback.push('This value must be strictly greater than 0. ✘');
  }

  useEffect(() => {
    if (!project) {
      // If the project we want isn't here, it probably means
      // the projects haven't been loaded from disk yet.
      // The way the DB is made, it's as cheap to load
      // all the projects so that's what we do here.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const handleProjectDeletion = (projectId: number) => (event: BaseSyntheticEvent) => {
    event.preventDefault();
    askServer('deleteProject', ({ projectId })).then(
      () => {
        dispatch(deleteProjectAction({ projectId }));
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

    const scrapingParams = {
      projectId: project.id,
      nParallel,
      startURL: project.startURL,
    };

    askServer('startScraping', scrapingParams).catch(
      (err: Error) => dispatch(addNotificationAction({
        message: err.message,
        severity: 'error',
      })),
    );
  };

  const handleStopScraping = () => {
    askServer('abortScraping', { projectId: project.id }).then(
      () => dispatch(addNotificationAction({
        message: `Aborting scraping operation of project ${project.id}...`,
      })),
    ).catch((err) => dispatch(addNotificationAction({
      message: err.message,
      severity: 'error',
    })));
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

  return (
    <main>
      <h1>Scraping Project: &quot;{project.projectName}&quot; (#{id})</h1>
      <div>
        <nav>
          <ul>
            <li>
              <NavLink activeClassName="active" exact to={url}>Launch a Scrape</NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" exact to={`${url}/reports`}>View Reports</NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <Switch>
        <Route path={`${path}/reports`}>
          <ProjectReports />
        </Route>
        <Route exact path={path}>
          <section>
            <h1>Main project characteristics and actions:</h1>
            <dl>
              <dt>Start URL:</dt>
              <dd>{project.startURL}</dd>
              <dt>Creation date:</dt>
              <dd>{createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString()}</dd>
            </dl>
            <ul>
              <li>
                <label>
                  <span>Number of parallel Chrome instances</span>
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
                  {(isScraping !== true) && (
                    <button type="button" onClick={handleStartScraping}>
                      Start Scraping
                    </button>
                  )}
                  {(isScraping === true) && (
                    <button type="button" onClick={handleStopScraping}>
                      Cancel Scraping
                    </button>
                  )}
                </p>
              </li>
              <li>
                <Confirmator action={handleProjectDeletion(id)}>
                  <p>
                    <button type="button">
                      Delete Project
                    </button>
                  </p>
                </Confirmator>
              </li>
            </ul>
          </section>
          {scrapingState && <ScrapingFeedback state={scrapingState} />}
        </Route>
      </Switch>
    </main>

  );
};

export default OneScrapingProject;
