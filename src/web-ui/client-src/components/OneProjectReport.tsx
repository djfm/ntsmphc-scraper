import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  useDispatch,
} from 'react-redux';

import {
  useParams as useRouterParams,
} from 'react-router-dom';

import hash from 'object-hash';

import {
  askServer,
} from '../webSocketsUISide';

import {
  addNotificationAction,
} from '../redux/actions';

const extractColumns = (data: any[]) => {
  const keysSeen = new Set();

  for (const line of data) {
    for (const key of Object.keys(line)) {
      keysSeen.add(key);
    }
  }

  return [...keysSeen.values()].map((key: string) => ({
    key,
    name: key,
  }));
};

const OneProjectReport = () => {
  const routerParams = useRouterParams() as any;
  const { reportId } = routerParams;
  const [reportData, setReportData] = useState(undefined);
  const [columns, setColumns] = useState([]);
  const unstableDispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dispatch = useCallback(unstableDispatch, []);

  useEffect(() => {
    if (reportData === undefined) {
      askServer('loadReport', {
        reportId,
      }).then((data: any[]) => {
        setColumns(extractColumns(data));
        setReportData(data);
      }).catch(
        (err) => dispatch(addNotificationAction({
          message: err.message,
          severity: 'error',
        })),
      );
    }
  }, [reportId, reportData, dispatch]);

  const ui = () => (
    <section>
      <h1>Report {reportId}</h1>
      {reportData === undefined && <p>Loading report, please wait...</p>}
      {reportData && reportData.length === 0 && <p>Looks like an empty report, sorry...</p>}
      {reportData && reportData.length > 0 && (
        <div className="report-container">
          {reportData.map((line: any) => (
            <article className="report-entry" key={hash(line)}>
              {columns.map(({
                key,
                name,
              }) => (
                <div key={key}>
                  <dt><strong>{name}</strong></dt>
                  <dd>{line[key]}</dd>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </section>
  );

  return ui();
};

export default OneProjectReport;
