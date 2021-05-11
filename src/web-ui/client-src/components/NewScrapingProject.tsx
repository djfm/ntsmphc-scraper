import React, { useState, BaseSyntheticEvent } from 'react';

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
  const [isStartURLResponding, setStartURLResponding] = useState(false);

  const handleStartURLChange = ((event: BaseSyntheticEvent) => {
    const url = event.target.value;
    setStartURLValid(isValidURL(url));
    setStartURL(url);
  });

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
    askServer('isRespondingHTTP', { url: startURL }).then(setStartURLResponding);
    startURLFeedback.push('✔ Looks good!');

    if (isStartURLResponding) {
      startURLFeedback.push("✔ It's responding to HTTP requests, good!");
    } else {
      startURLFeedback.push("It doesn't seem to be reachable over HTTP.");
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
