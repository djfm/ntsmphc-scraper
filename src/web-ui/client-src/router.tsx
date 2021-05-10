import React from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
} from 'react-router-dom';

import Home from './components/Home';
import NewScrapingProject from './components/NewScrapingProject';
import PageNotFound from './components/PageNotFound';

const App = () => {
  const tree = (
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

  return tree;
};

const rootElement = document.getElementById('appRoot');
ReactDOM.render(<App />, rootElement);
