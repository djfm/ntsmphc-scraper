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

const keyNames = {
  isValid: 'URL is valid',
  status: 'HTTP status of page',
  problematicURL: "URL that's causing problems",
  foundOnPage: 'Page the issue was found on',
  referer: 'HTTP referer',
  message: 'Why this is reported',
  url: 'URL of scraped page',
};

const extractColumns = (data: any[]) => {
  const keysSeen = new Set();

  for (const line of data) {
    for (const key of Object.keys(line)) {
      keysSeen.add(key);
    }
  }

  return [...keysSeen.values()].map((key: string) => ({
    key,
    name: keyNames[key] || key,
  }));
};

const makeReadable = (key: string, value: any) => {
  if (value === undefined) {
    return 'undefined';
  }

  if (value === false) {
    return 'no';
  }

  if (value === true) {
    return 'yes';
  }

  if (value === null) {
    return 'undefined';
  }

  return value;
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
                  <dd>{makeReadable(key, line[key])}</dd>
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
