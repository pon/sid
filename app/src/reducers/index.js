import forgotPasswordReducer from './forgotPassword';
import loginReducer from './login';
import profileReducer from './profile';
import registerReducer from './register';
import resetPasswordReducer from './resetPassword';

export const reducers = {
  forgotPassword: forgotPasswordReducer,
  login: loginReducer,
  profile: profileReducer,
  register: registerReducer,
  resetPassword: resetPasswordReducer
}