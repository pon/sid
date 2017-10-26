import acceptInviteReducer from './acceptInvite';
import dashboardReducer from './dashboard';
import inviteReducer from './invite';
import loginReducer from './login';
import uploadsReducer from './uploads';
import verificationReducer from './verification';

export const reducers = {
  acceptInvite: acceptInviteReducer,
  dashboard: dashboardReducer,
  invite: inviteReducer,
  login: loginReducer,
  uploads: uploadsReducer,
  verification: verificationReducer
}