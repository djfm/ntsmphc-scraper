import React from 'react';

import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route,
} from 'react-router-dom';

import {
  useSelector,
  useDispatch,
} from 'react-redux';

import Home from './Home';
import NewScrapingProject from './NewScrapingProject';
import PageNotFound from './PageNotFound';
import ScrapingProjects from './ScrapingProjects';
import OneScrapingProject from './OneScrapingProject';

import {
  removeNotificationAction,
} from '../redux/actions';

import {
  getAllNotifications,
} from '../redux/selectors';

import {
  Notification,
} from '../redux/reducers/notifications';

const Notifications = () => {
  const notifications = useSelector(getAllNotifications);
  const dispatch = useDispatch();

  const removeNotification = (notification: Notification) => () => {
    dispatch(removeNotificationAction(notification));
  };

  if (notifications.length === 0) {
    return null;
  }

  const maybeRenderDismissButton = (notification: Notification) => {
    if (!notification.userDismissible) {
      return null;
    }

    return (
      <button
        type="button"
        onClick={removeNotification(notification)}
      >
        Remove Notification
      </button>
    );
  };

  const date = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <div>
      {notifications.map((notification: Notification) => (
        <aside key={notification.id} role="alert">
          <p>[{date(notification.createdAt)}] <strong>{notification.message}</strong></p>
          {maybeRenderDismissButton(notification)}
        </aside>
      ))}
    </div>
  );
};

const App = () => (
  <Router>
    <Notifications />

    <div>
      <nav id="main-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/new-scraping-project">Create New Scraping Project</Link>
          </li>
          <li>
            <Link to="/projects">View all Scraping Projects</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/new-scraping-project">
          <NewScrapingProject />
        </Route>
        <Route path="/projects/:id">
          <OneScrapingProject />
        </Route>
        <Route path="/projects">
          <ScrapingProjects />
        </Route>
        <Route path="/">
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
