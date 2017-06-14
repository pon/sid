import applyReducer from './apply';
import forgotPasswordReducer from './forgotPassword';
import loginReducer from './login';
import profileReducer from './profile';
import registerReducer from './register';
import resetPasswordReducer from './resetPassword';

export const reducers = {
  apply: applyReducer,
  forgotPassword: forgotPasswordReducer,
  login: loginReducer,
  profile: profileReducer,
  register: registerReducer,
  resetPassword: resetPasswordReducer
}