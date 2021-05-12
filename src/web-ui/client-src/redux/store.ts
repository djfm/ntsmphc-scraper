import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import rootReducer from './reducers/index';

const store = createStore(rootReducer, {}, devToolsEnhancer({
  name: 'ntsmphc-scraper',
}));

if (process.env.NODE_ENV !== 'production' && module.hot) {
  // TODO check if it works
  module.hot.accept('./reducers/index', () => {
    // eslint-disable-next-line no-console
    console.log("[HMR] Attempting hot-reload of redux store's reducer...");
    store.replaceReducer(rootReducer);
  });
}

export default store;
