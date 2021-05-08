import { URL } from 'url';

// Generates the functions we need to interact with URLs.
// parsedStartURL is the result of URL.parse called
// on the URL given to the program.
const makeURLHelpers = (parsedStartURL) => {
  // Normalizes URLs to avoid scraping the same URL twice
  // because of subtle variations in the URL string.
  // Will remove leading and trailing whitespace,
  // convert to lowercase and remove all trailing forward slashes.
  // Also adds the protocol for links starting in "//",
  // which the chrome driver considers invalid.
  // Uses recursion and does a tiny bit too much of work
  // but this is negligible and I don't like mutating variables.
  const normalizeURL = (url) => {
    if (typeof url !== 'string') {
      return '';
    }

    const sanitizedURL = url.toLowerCase().trim();

    if (sanitizedURL.startsWith('//')) {
      return normalizeURL(`${parsedStartURL.protocol}${sanitizedURL}`);
    }

    if (sanitizedURL.endsWith('/')) {
      // Removes the last character if it's a forward slash.
      return normalizeURL(sanitizedURL.slice(0, -1));
    }

    return sanitizedURL;
  };

  // Determines if a URL should be scraped.
  // It should be scraped if it's not a javascript:void() or something link,
  // and of course if it is on the same domain as the domain
  // we started scraping from.
  // attrs is a Map of all attributes found on the link.
  const shouldScrapeURL = (url, attrs) => {
    if (attrs && attrs.get('rel') === 'nofollow') {
      return false;
    }

    try {
      const parsedURL = new URL(url);

      // eslint-disable-next-line no-script-url
      if (parsedURL.protocol === 'javascript:') {
        return false;
      }

      // It's important to use 'hostname' and not 'host'
      // because hostname doesn't include the port if there is one.
      if (parsedURL.hostname !== parsedStartURL.hostname) {
        return false;
      }
    } catch (err) {
      if (err.code === 'ERR_INVALID_URL') {
        // TODO This error should be logged.
        //
        // So probably just let the caller catch the error.
        //
        // Right now I just want to make things work.
        return false;
      }

      throw err;
    }

    return true;
  };

  return { normalizeURL, shouldScrapeURL };
};

export default makeURLHelpers;
