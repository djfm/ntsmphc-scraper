import React from 'react';

import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
} from 'react-router-dom';

import Home from './Home';
import NewScrapingProject from './NewScrapingProject';
import PageNotFound from './PageNotFound';

const App = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/new-scraping-project">Create New Scraping Project</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route exact path="/new-scraping-project">
          <NewScrapingProject />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </div>
  </Router>
);

export default App;
