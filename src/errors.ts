export const JSON_PARSE_ERROR = 'JSON_PARSE_ERROR';

export class JSONParseError extends Error {
  // eslint-disable-next-line class-methods-use-this
  get code() {
    return JSON_PARSE_ERROR;
  }
}
