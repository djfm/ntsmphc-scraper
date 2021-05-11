import {
  isRespondingHTTP,
} from '../../util/url';

import {
  CreateProjectParams,
  MaybeError,
  ErrorMessage,
  createProject,
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

    if (creationResult === true) {
      return true;
    }

    throw new Error(creationResult);
  }

  throw new Error(`unknown action "${action}"`);
};

export default respond;
