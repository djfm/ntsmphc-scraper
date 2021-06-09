import React, {
  useState,
  useEffect,
} from 'react';

import {
  useDispatch,
} from 'react-redux';

import {
  useParams as useRouterParams,
  useRouteMatch,
  Link,
  Switch,
  Route,
} from 'react-router-dom';

import {
  askServer,
} from '../webSocketsIO';

import {
  addNotificationAction,
} from '../redux/actions';

import OneProjectReport from './OneProjectReport';

const ProjectReports = () => {
  const dispatch = useDispatch();
  const routerParams = useRouterParams() as any;
  const projectId: number = parseFloat(routerParams.id);
  const [reports, setReports] = useState(undefined);
  const { path, url } = useRouteMatch();

  useEffect(() => {
    if (reports === undefined) {
      askServer('loadReports', {
        projectId,
      }).then((loadedReports) => {
        setReports(loadedReports);
      }).catch((err) => {
        dispatch(addNotificationAction({
          message: err.message,
          severity: 'error',
        }));
      });
    }
  });

  const ui = () => (
    <section>
      <h1>Project Reports</h1>

      {(!reports || reports.length === 0) && <p>No Reports to show yet, sorry!</p>}

      {(reports && reports.length > 0) && (
        <div>
          <Switch>
            <Route path={`${path}/:reportId`}>
              <OneProjectReport />
            </Route>
            <Route exact path={path}>
              <ul>
                {reports.map((report: any) => {
                  const key = `${projectId}-${report.time}-${report.reportType}`;

                  return (
                    <li key={key}>
                      <Link to={`${url}/${key}`}>
                        <strong>{report.reportType}</strong>: {report.date}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Route>
          </Switch>
        </div>
      )}
    </section>
  );

  return ui();
};

export default ProjectReports;
