import { combineReducers } from 'redux';

import notifications from './notifications';
import projects from './projects';
import scraping from './scraping';

export default combineReducers({
  notifications,
  projects,
  scraping,
});
