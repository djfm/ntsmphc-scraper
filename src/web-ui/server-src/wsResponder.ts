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
  addNotificationAction,
  notifyPageScrapedAction,
} from '../client-src/redux/actions';

import {
  CreateProjectParams,
  createProject,
  listProjects,
  deleteProject,
  storeResults,
} from '../../db';

import {
  SendPayloadFunc,
} from './webSocketsServerSide';

import {
  PAYLOAD_TYPE_REDUX_ACTION,
} from '../../constants';

import {
  ScrapingTaskParams,
  startScraping,
  ProjectScrapeResult,
} from '../../scraper/scraper';

import {
  ScrapeResult,
} from '../../scraper/scrapeURL';

interface WithURL {
  url: string;
}

interface WithProjectId {
  projectId: number;
}

const hasURLParam = (params: object): params is WithURL =>
  Object.prototype.hasOwnProperty.call(params, 'url');

const hasProjectId = (params: object): params is WithProjectId =>
  hasAllOwnProperties(['projectId'])(params);

const isCreateProjectParams = (params: object): params is CreateProjectParams =>
  hasAllOwnProperties(['startURL', 'projectName'])(params);

// TODO I feel like I'm duplicating a lot of code here
// Isn't there a smarter way to do what I'm doing ?
// Google is pretty vague when it comes to advanced
// type issues. Need to RTFM. Need more time.
// Will leave it like that for now.
const isScrapingTaskParams = (params: object): params is ScrapingTaskParams =>
  hasAllOwnProperties(['projectId', 'startURL', 'nParallel'])(params);

export const respond = (sendPayload: SendPayloadFunc) =>
  async (action: string, params: object): Promise<any> => {
    const sendUINotification = (data: object) =>
      sendPayload({
        type: PAYLOAD_TYPE_REDUX_ACTION,
        action: addNotificationAction(data),
      });

    if (action === 'isRespondingHTTP') {
      if (!hasURLParam(params)) {
        throw new Error('Missing "url" param in "params" provided to action "isRespondingHTTP"');
      }
      return isRespondingHTTP(params.url);
    }

    if (action === 'createProject') {
      if (!isCreateProjectParams(params)) {
        throw new Error('Missing properties to qualify as a "params" for "createProject"');
      }
      return createProject(params);
    }

    if (action === 'listProjects') {
      const projects = await listProjects();
      return [...projects];
    }

    if (action === 'deleteProject') {
      if (!hasProjectId(params)) {
        throw new Error('Error: params provided to "deleteProject" miss property "projectId"');
      }

      return deleteProject(params.projectId);
    }

    if (action === 'startScraping') {
      if (!isScrapingTaskParams(params)) {
        throw new Error('Error: invalid params provided to `startScraping`.');
      }

      sendUINotification({
        message: `Starting scraping from "${params.startURL}"...`,
      });

      const notifyPageScraped = (result: ScrapeResult) => {
        sendPayload({
          type: PAYLOAD_TYPE_REDUX_ACTION,
          action: notifyPageScrapedAction(params.projectId, result),
        });
      };

      const startedAt = Date.now();

      const scraping = startScraping({ notifyPageScraped })(params);

      scraping.then((result: ProjectScrapeResult) => {
        const timeTakenSeconds = Math.round((Date.now() - startedAt) / 1000);
        const timeTaken = humanDuration(timeTakenSeconds);

        // eslint-disable-next-line no-console
        console.log(`\n[DONE] Scraped ${result.nPagesScraped} URLs total in ${timeTaken}!`);

        storeResults(params.projectId, result).then(() => {
          sendUINotification({
            message: `Successfully scraped project #${params.projectId} in ${timeTaken}.`,
            severity: 'success',
          });
        }, (err) => {
          // eslint-disable-next-line no-console
          console.error(err);
          storeResults(params.projectId, result).then(() => {
            sendUINotification({
              message: 'Something bad happened while storing the results, sorry.',
              severity: 'error',
            });
          });
        });

        return true;
      }, (err) => {
        // eslint-disable-next-line no-console
        console.error('Could not scrape: ', err);
        sendUINotification({
          message: 'Something bad happened while scraping, sorry.',
          severity: 'error',
        });
      });

      return true;
    }

    throw new Error(`WebSocket: unknown server action "${action}"`);
  };

export default respond;
