import {
  isRespondingHTTP,
} from '../../util/url';

interface WithURL {
  url: string;
}

const hasURLParam = (params: object): params is WithURL =>
  Object.prototype.hasOwnProperty.call(params, 'url');

export const respond = async (action: string, params: object): Promise<any> => {
  if (action === 'isRespondingHTTP') {
    if (!hasURLParam(params)) {
      throw new Error('Missing "url" param in "params" provided to action "isRespondingHTTP"');
    }
    return isRespondingHTTP(params.url);
  }

  throw new Error(`unknown action "${action}"`);
};

export default respond;
