import 'regenerator-runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';

import store from './redux/store';

import './style/index.sass';

import {
  addOnInfoCallback,
  clearOnInfoCallbacks,
} from './webSocketsUISide';

import handlePayloadFromServer from './handlePayloadFromServer';

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const rootElement = document.getElementById('appRoot');

const render = () => {
  ReactDOM.render(<ReduxApp />, rootElement);
};

addOnInfoCallback(handlePayloadFromServer(store));

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./handlePayloadFromServer', () => {
    // eslint-disable-next-line no-console
    console.log('[HMR] Attempting to hot-reload on-info callbacks...');
    clearOnInfoCallbacks();

    const next = require('./webSocketsUISide');
    next.addOnInfoCallback(next.handlePayloadFromServer(store));
  });
}

render();
