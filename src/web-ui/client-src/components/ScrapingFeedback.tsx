import React from 'react';

import {
  ProjectScrapingState,
} from '../redux/reducers/scraping';

type Props = {
  state: ProjectScrapingState,
};

const ScrapingFeedback = ({ state }: Props) => (
  <section>
    <h1>Scraping is currently in progress:</h1>
    <p>
      <dt>URLs scraped so far:</dt>
      <dd>{state.statistics.nSeenURLs}</dd>
      <dt>URLs discovered so far:</dt>
      <dd>{state.statistics.nDiscoveredURLs}</dd>
      <dt>Approximate percentage complete:</dt>
      <dd>{state.statistics.approximatePctComplete}%</dd>
    </p>
    <section>
      <h1>
        Last URLs Scraped
      </h1>
      <ul>
        {state.lastURLsScraped.map((url: string) => (
          <li key={url}>
            { url }
          </li>
        ))}
      </ul>
    </section>

  </section>
);

export default ScrapingFeedback;
