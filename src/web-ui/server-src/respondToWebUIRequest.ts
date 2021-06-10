import {
  isRespondingHTTP,
} from '../../util/url';

import {
  humanDuration,
} from '../../util/humanDuration';

import {
  hasAllOwnProperties,
} from '../../util/functional';

import {
  notifyPageScrapedAction,
  notifyScrapingStatisticsAction,
} from '../client-src/redux/actions';

import {
  CreateProjectParams,
  createProject,
  listProjects,
  deleteProject,
  storeResults,
  loadReports,
  loadReport,
} from '../../db';

import {
  ScrapingTaskParams,
  ScrapingProgress,
  ScraperNotifiers,
  ScrapingStatistics,
  URLScrapingResult,
} from '../../scraper/types';

import {
  startScraping,
} from '../../scraper/scraper';

import {
  setIsScraping,
  setStatistics,
} from './scraperState';

import {
  prepareReduxNotificationPayload,
  prepareReduxActionDispatchPayload,
} from '../server';

interface WithURL {
  url: string;
}

interface WithProjectId {
  projectId: number;
}

interface WithReportId {
  reportId: string;
}

export type ServerToWebUIResponseMethods = {
  respond: (serializableData: any) => any;
  broadcast: (serializableData: any) => any;
};

const hasURLParam = (params: object): params is WithURL =>
  hasAllOwnProperties(['url'])(params);

const hasProjectId = (params: object): params is WithProjectId =>
  hasAllOwnProperties(['projectId'])(params);

const hasReportId = (params: object): params is WithReportId =>
  hasAllOwnProperties(['reportId'])(params);

const isCreateProjectParams = (params: object): params is CreateProjectParams =>
  hasAllOwnProperties(['startURL', 'projectName'])(params);

// TODO I feel like I'm duplicating a lot of code here
// Isn't there a smarter way to do what I'm doing ?
// Google is pretty vague when it comes to advanced
// type issues. Need to RTFM. Need more time.
// Will leave it like that for now.
const isScrapingTaskParams = (params: object): params is ScrapingTaskParams =>
  hasAllOwnProperties(['projectId', 'startURL', 'nParallel'])(params);

export const respondToWebUIRequest = (responders: ServerToWebUIResponseMethods) =>
  async (action: string, params: object): Promise<any> => {
    const sendUINotification = (data: object) =>
      responders.broadcast(prepareReduxNotificationPayload(data));

    if (action === 'isRespondingHTTP') {
      if (!hasURLParam(params)) {
        throw new Error('Missing "url" param in "params" provided to action "isRespondingHTTP"');
      }
      return isRespondingHTTP(params.url).then(responders.respond);
    }

    if (action === 'createProject') {
      if (!isCreateProjectParams(params)) {
        throw new Error('Missing properties to qualify as a "params" for "createProject"');
      }
      return createProject(params).then(responders.respond);
    }

    if (action === 'listProjects') {
      const projects = await listProjects();
      return responders.respond([...projects]);
    }

    if (action === 'deleteProject') {
      if (!hasProjectId(params)) {
        throw new Error('Error: params provided to "deleteProject" miss property "projectId"');
      }

      return deleteProject(params.projectId).then(responders.respond);
    }

    if (action === 'startScraping') {
      if (!isScrapingTaskParams(params)) {
        throw new Error('Error: invalid params provided to `startScraping`.');
      }

      setIsScraping(params.projectId, true);

      sendUINotification({
        message: `Starting scraping from "${params.startURL}"...`,
      });

      const notifyPageScraped = (result: URLScrapingResult) =>
        responders.broadcast(
          prepareReduxActionDispatchPayload(
            notifyPageScrapedAction(params.projectId, result),
          ),
        );

      const notifyStatistics = (statistics: ScrapingStatistics) => {
        setStatistics(params.projectId, statistics);
        responders.broadcast(
          prepareReduxActionDispatchPayload(
            notifyScrapingStatisticsAction(params.projectId, statistics),
          ),
        );
      };

      const notifiers: ScraperNotifiers = {
        notifyPageScraped,
        notifyStatistics,
      };

      const startedAt = Date.now();

      const scraping = startScraping(notifiers)(params);

      return scraping.then((progress: ScrapingProgress) => {
        const timeTakenSeconds = Math.round((Date.now() - startedAt) / 1000);
        const timeTaken = humanDuration(timeTakenSeconds);

        setIsScraping(params.projectId, 'done');

        // eslint-disable-next-line no-console
        console.log(`\n[DONE] Scraped ${progress.nURLsScraped} URLs total in ${timeTaken}!`);

        storeResults(params.projectId, progress).then(() => {
          sendUINotification({
            message: `Successfully scraped project #${params.projectId} in ${timeTaken}.`,
            severity: 'success',
          });
        }, (err) => {
          sendUINotification({
            message: err.message || 'Something bad happened while storing the scraping results.',
            severity: 'error',
          });
        });
      }, (err) => {
        // eslint-disable-next-line no-console
        console.error('Could not scrape: ', err);
        sendUINotification({
          message: 'Something bad happened while scraping, sorry.',
          severity: 'error',
        });
      });
    }

    if (action === 'loadReports') {
      if (!hasProjectId(params)) {
        throw new Error('Error: params provided to "loadReports" miss property "projectId"');
      }
      return loadReports(params.projectId).then(responders.respond);
    }

    if (action === 'loadReport') {
      if (!hasReportId(params)) {
        throw new Error('Error: params provided to "loadReport" miss property "reportId"');
      }
      return loadReport(params.reportId).then(responders.respond);
    }

    throw new Error(`WebSocket: unknown server action "${action}"`);
  };

export default respondToWebUIRequest;
