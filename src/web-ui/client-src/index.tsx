import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';

import store from './redux/store';

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const rootElement = document.getElementById('appRoot');

const render = () => {
  ReactDOM.render(<ReduxApp />, rootElement);
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./components/App.tsx', () => {
    // eslint-disable-next-line no-console
    console.log('[HMR] Attempting to hot-reload React app...');
    render();
  });
}

render();
