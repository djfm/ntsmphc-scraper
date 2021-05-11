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

  return (
    <div>
      {notifications.map((notification: Notification) => (
        <aside key={notification.id} role="alert">
          <p>{notification.message}</p>
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
