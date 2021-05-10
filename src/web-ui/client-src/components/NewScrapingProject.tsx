import React from 'react';

import {
  isValidURL,
} from '../../../util/url';

const NewScrapingProject = () => (
  <main>
    <h1>Create New Scraping Project</h1>

    <section>
      <form>
        <label>
          Start URL
          <p>
            <input type="text" />
          </p>
        </label>
      </form>
    </section>
  </main>
);

export default NewScrapingProject;
