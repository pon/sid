import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import initStore from './store';

import {App} from './containers';
import {AcceptInvite, Dashboard, Login} from './components';

const store = initStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

const RequireAuth = (nextState, replace) => {
  if (!sessionStorage.getItem('jwtToken')) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }
}

export default function routes () {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <Router path="accept-invite/:token" component={AcceptInvite} />
          <Router path="dashboard" component={Dashboard} onEnter={RequireAuth}/>
          <Router path="login" component={Login} />
        </Route>
      </Router>
    </Provider>
  )
}
