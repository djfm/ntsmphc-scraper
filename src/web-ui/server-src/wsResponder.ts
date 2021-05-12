import {
  isRespondingHTTP,
} from '../../util/url';

import {
  hasAllOwnProperties,
} from '../../util/functional';

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

interface WithURL {
  url: string;
}

interface WithProjectId {
  projectId: number;
}

type Project = {
  id: number;
  startURL: string;
  projetName: string;
  createdAt: number,
}

const hasURLParam = (params: object): params is WithURL =>
  Object.prototype.hasOwnProperty.call(params, 'url');

const hasProjectId = (params: object): params is WithProjectId =>
  hasAllOwnProperties(['projectId'])(params);

const isCreateProjectParams = (params: object): params is CreateProjectParams =>
  hasAllOwnProperties(['startURL', 'projectName'])(params);

const isProject = (params: object): params is Project =>
  hasAllOwnProperties['projectName, id, startURL'];

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
      if (!isProject(params)) {
        throw new Error('Error: invalid params provided to `startScraping`, should be a full Project meta-data.');
      }

      const project: Project = params;

      sendPayload({
        type: 'test',
        data: params,
      });

      return true;
    }

    throw new Error(`WebSocket: unknown server action "${action}"`);
  };

export default respond;
