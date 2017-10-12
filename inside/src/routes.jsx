import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import initStore from './store';

import {App} from './containers';

const store = initStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

export default function routes () {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
        </Route>
      </Router>
    </Provider>
  )
}
