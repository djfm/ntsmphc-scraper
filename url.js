import URL from 'url';

const makeURLHelpers = (parsedStartURL) => {
  // Normalizes URLs to avoid scraping the same URL twice
  // because of subtle variations in the URL string.
  // Also adds the protocol for links starting in "//",
  // which the chrome driver considers invalid.
  const normalizeURL = (url) => {
    if (typeof url !== 'string') {
      return '';
    }

    const sanitizedURL = url.toLowerCase().trim();

    if (sanitizedURL.startsWith('//')) {
      return normalizeURL(`${parsedStartURL.protocol}${sanitizedURL}`);
    }

    if (sanitizedURL.endsWith('/')) {
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

    const parsedURL = URL.parse(url);
    // eslint-disable-next-line no-script-url
    if (parsedURL.protocol === 'javascript:') {
      return false;
    }

    if (parsedURL.hostname !== parsedStartURL.hostname) {
      return false;
    }

    return true;
  };

  return { normalizeURL, shouldScrapeURL };
};

export default makeURLHelpers;
