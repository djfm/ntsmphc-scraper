import React, { useState, BaseSyntheticEvent } from 'react';

import { URL } from 'whatwg-url';

const isValidURL = (url: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

const NewScrapingProject = () => {
  const [startURL, setStartURL] = useState('');
  const [isStartURLValid, setStartURLValid] = useState(undefined);

  const handleStartURLChange = ((event: BaseSyntheticEvent) => {
    const url = event.target.value;
    setStartURLValid(isValidURL(url));
    setStartURL(url);
  });

  // eslint-disable-next-line react/jsx-curly-brace-presence
  const urlErr = (<p>This URL {"doesn't"} look good.</p>);
  const urlOK = (<p>✔ Looks good!</p>);
  // eslint-disable-next-line no-nested-ternary
  const urlFeedback = (isStartURLValid === undefined) ? '' : (
    isStartURLValid ? urlOK : urlErr
  );

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
            <p>
              {urlFeedback}
            </p>
          </label>
        </form>
      </section>
    </main>
  );

  return ui;
};

export default NewScrapingProject;
