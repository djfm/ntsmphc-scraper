import { URL } from 'url';

import fetch from 'node-fetch';

export type canonicalUrlString = string;

export type URLPredicate = (url: string) => boolean;

export const isValidURL = (url: string) => {
  try {
    // Sorry eslint, but I'm ONLY interested
    // in the side-effects here.
    //
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (err) {
    if (err.code !== 'ERR_INVALID_URL') {
      throw err;
    }
    return false;
  }
};

export const isParsable = (url: string): (false | URL) => {
  try {
    return new URL(url);
  } catch (err) {
    return false;
  }
};

export const isJavascriptURL = (url: string) => {
  const parsed = isParsable(url);
  if (parsed !== false) {
    // eslint-disable-next-line no-script-url
    return parsed.protocol === 'javascript:';
  }
  return false;
};

// Generates the functions we need to interact with URLs.
// parsedStartURL is the result of URL.parse called
// on the URL given to the program.
export const makeURLHelpers = (startURL: string) => {
  const parsedStartURL = new URL(startURL);
  // It's important to use 'hostname' and not 'host'
  // because hostname doesn't include the port if there is one.
  const isInternalURL: URLPredicate = (url: string) =>
    new URL(url).hostname === parsedStartURL.hostname;

  // Normalizes URLs to avoid scraping the same URL twice
  // because of subtle variations in the URL string.
  // Will remove leading and trailing whitespace,
  // convert to lowercase and remove all trailing forward slashes.
  // Also adds the protocol for links starting in "//",
  // which the chrome driver considers invalid.
  // Uses recursion and does a tiny bit too much of work
  // but this is negligible and I don't like mutating variables.
  const normalizeURL = (url: string) => {
    if (typeof url !== 'string') {
      return '';
    }

    const sanitizedURL = url.trim();

    if (sanitizedURL.startsWith('//')) {
      return normalizeURL(`${parsedStartURL.protocol}${sanitizedURL}`);
    }

    if (sanitizedURL.startsWith('/')) {
      return normalizeURL(`${parsedStartURL.protocol}//${parsedStartURL.host}${sanitizedURL}`);
    }

    if (sanitizedURL.endsWith('/')) {
      // Removes the last character if it's a forward slash.
      return normalizeURL(sanitizedURL.slice(0, -1));
    }

    return sanitizedURL;
  };

  return {
    isInternalURL,
    normalizeURL,
  };
};

export const isRespondingHTTP = async (url: string): Promise<boolean> => {
  try {
    await fetch(url, {
      timeout: 5000,
    });
    return true;
  } catch (err) {
    return false;
  }
};

export default makeURLHelpers;
