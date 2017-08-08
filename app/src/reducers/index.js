import additionalUploadReducer from './additionalUpload';
import applyReducer from './apply';
import checkoutReducer from './checkout';
import dashboardReducer from './dashboard';
import forgotPasswordReducer from './forgotPassword';
import loginReducer from './login';
import profileReducer from './profile';
import registerReducer from './register';
import resetPasswordReducer from './resetPassword';

export const reducers = {
  additionalUpload: additionalUploadReducer,
  apply: applyReducer,
  checkout: checkoutReducer,
  dashboard: dashboardReducer,
  forgotPassword: forgotPasswordReducer,
  login: loginReducer,
  profile: profileReducer,
  register: registerReducer,
  resetPassword: resetPasswordReducer
}