import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';

import store from './redux/store';

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
  module.hot.accept('./components/App.tsx', () => {
    // TODO check if it works,
    // it seems to, but I have a feeling it's only working thanks to react-refresh
    // eslint-disable-next-line no-console
    console.log('[HMR] Attempting to hot-reload React app...');
    render();
  });

  module.hot.accept('./handlePayloadFromServer', () => {
    clearOnInfoCallbacks();
    addOnInfoCallback(handlePayloadFromServer(store));
  });
}

render();
