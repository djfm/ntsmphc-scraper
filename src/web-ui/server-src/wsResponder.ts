import {
  isRespondingHTTP,
} from '../../util/url';

import {
  CreateProjectParams,
  isError,
  createProject,
  listProjects,
} from '../../db';

interface WithURL {
  url: string;
}

// TODO what should we return when we get an empty array of propNames?
// current behavior is to bug, which is OK for my use case but not
// very clean.
const hasAllOwnProperties = ([propName, ...otherPropNames]: string[]) =>
  (obj: object): boolean => {
    const hasPropName = Object.prototype.hasOwnProperty.call(obj, propName);
    if (!hasPropName) {
      return false;
    }

    if (otherPropNames.length === 0) {
      return true;
    }

    return hasAllOwnProperties(otherPropNames)(obj);
  };

const hasURLParam = (params: object): params is WithURL =>
  Object.prototype.hasOwnProperty.call(params, 'url');

const isCreateProjectParams = (params: object): params is CreateProjectParams =>
  hasAllOwnProperties(['startURL', 'projectName'])(params);

export const respond = async (action: string, params: object): Promise<any> => {
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

  throw new Error(`WebSocket: unknown server action "${action}"`);
};

export default respond;
