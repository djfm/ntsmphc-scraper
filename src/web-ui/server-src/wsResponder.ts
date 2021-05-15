import {
  isRespondingHTTP,
} from '../../util/url';

import {
  hasAllOwnProperties,
} from '../../util/functional';

import {
  addNotificationAction,
} from '../client-src/redux/actions';

import {
  CreateProjectParams,
  isError,
  createProject,
  listProjects,
  deleteProject,
} from '../../db';

import {
  SendPayloadFunc,
} from './webSocketsServerSide';

import {
  PAYLOAD_TYPE_REDUX_ACTION,
} from '../../constants';

import {
  ScrapingTaskParams,
} from '../../scraper/scraper';

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
      const creationResult = await createProject(params);

      if (isError(creationResult)) {
        throw new Error(creationResult);
      }

      return creationResult;
    }

    if (action === 'listProjects') {
      const projects = await listProjects();

      if (isError(projects)) {
        throw new Error(projects);
      }

      // quick & dirty way to convert iterator
      // to plain old Array
      return [...projects];
    }

    if (action === 'deleteProject') {
      if (!hasProjectId(params)) {
        throw new Error('Error: params provided to "deleteProject" miss property "projectId"');
      }

      const deleted = await deleteProject(params.projectId);
      if (isError(deleted)) {
        throw new Error(deleted);
      }

      return deleted;
    }

    if (action === 'startScraping') {
      if (!isScrapingTaskParams(params)) {
        throw new Error('Error: invalid params provided to `startScraping`.');
      }

      sendPayload({
        type: PAYLOAD_TYPE_REDUX_ACTION,
        action: addNotificationAction({
          message: `Starting scraping from "${params.startURL}"...`,
        }),
      });

      return true;
    }

    throw new Error(`WebSocket: unknown server action "${action}"`);
  };

export default respond;
