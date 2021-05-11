import React, {
  useState,
  useEffect,
  BaseSyntheticEvent,
} from 'react';

import { URL } from 'whatwg-url';

import {
  askServer,
} from '../webSocketsUISide';

const isValidURL = (url: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

/*
const isReachableURL = async (url: string) => {

};
*/

const NewScrapingProject = () => {
  const [startURL, setStartURL] = useState('');
  const [isStartURLValid, setStartURLValid] = useState(undefined);
  const [isStartURLResponding, setStartURLResponding] = useState(undefined);

  const handleStartURLChange = ((event: BaseSyntheticEvent) => {
    const url = event.target.value;
    setStartURL(url);
    setStartURLValid(isValidURL(url));
  });

  useEffect(() => {
    setStartURLResponding(undefined);
    askServer('isRespondingHTTP', { url: startURL }).then(setStartURLResponding);
  }, [startURL]);

  const startURLFeedback = [];

  const wrapFeedback = (messages: string[]): any => {
    if (messages.length === 0) {
      return null;
    }

    return (
      <ul>
        { messages.map((message) => (<li key={message}>{message}</li>)) }
      </ul>
    );
  };

  if (isStartURLValid) {
    startURLFeedback.push('✔ Looks good!');

    if (isStartURLResponding) {
      startURLFeedback.push("✔ It's responding to HTTP requests, good!");
    } else if (isStartURLResponding === false) {
      startURLFeedback.push("It doesn't seem to be reachable over HTTP.");
    } else {
      startURLFeedback.push("I'm trying to see if this URL is reachable over HTTP...");
    }
  } else if (isStartURLValid === false) {
    startURLFeedback.push('This URL seems invalid.');
  }

  const urlFeedback = wrapFeedback(startURLFeedback);

  const ui = (
    <main>
      <h1>Create New Scraping Project</h1>

      <section>
        <form>
          <label>
            Start URL
            <p>
              <input type="text" value={startURL} onChange={handleStartURLChange} />
            </p>
            {urlFeedback}
          </label>
        </form>
      </section>
    </main>
  );

  return ui;
};

export default NewScrapingProject;
