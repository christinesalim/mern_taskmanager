import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import 'semantic-ui-css/semantic.min.css';
import './styles/index.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import App from './components/App';
import reducers from './reducers';

//Configure for Redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, 
  /* preloadedState, */ composeEnhancers(applyMiddleware(thunk)));
//Add thunk middleware to the redux store

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

