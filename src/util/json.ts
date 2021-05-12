export const tryToParseJSON = (str: string): any => {
  try {
    return JSON.parse(str);
  } catch (err) {
    throw new JSONParseError(err.message ?? 'Could not parse string as JSON.');
  }
};

export default tryToParseJSON;
