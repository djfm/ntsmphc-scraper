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
          <Route path="/new-scraping-project">
            <NewScrapingProject />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );

  return tree;
};

const rootElement = document.getElementById('appRoot');
ReactDOM.render(<App />, rootElement);