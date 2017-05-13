import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import initStore from './store';

import {App} from './containers';
import {ForgotPassword, Login, Profile, Register, ResetPassword} from './components';

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
          <Route path="register" component={Register} />
          <Router path="profile" component={Profile} onEnter={RequireAuth}/>
          <Router path="login" component={Login} />
          <Router path="forgot-password" component={ForgotPassword} />
          <Router path="password-reset/:token" component={ResetPassword} />
        </Route>
      </Router>
    </Provider>
  )
}
