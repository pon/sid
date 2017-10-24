import acceptInviteReducer from './acceptInvite';
import dashboardReducer from './dashboard';
import inviteReducer from './invite';
import loginReducer from './login';
import verificationReducer from './verification';

export const reducers = {
  acceptInvite: acceptInviteReducer,
  dashboard: dashboardReducer,
  invite: inviteReducer,
  login: loginReducer,
  verification: verificationReducer
}