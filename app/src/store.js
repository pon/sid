import {createStore, compose, applyMiddleware} from 'redux';
import {routerReducer, routerMiddleware} from  'react-router-redux';
import {install as reduxLoop, combineReducers} from 'redux-loop';
import {reducer as reduxFormReducer} from 'redux-form';
import {reducers as appReducers} from './reducers';

const devTools = window.devToolsExtension ? [window.devToolsExtension()] : [];
const reducers = combineReducers({
  routing: routerReducer,
  form: reduxFormReducer,
  ...appReducers
});

export default function (history) {
  const enhancers = [
    reduxLoop(),
    applyMiddleware(routerMiddleware(history)),
    ...devTools
  ];

  return createStore(
    reducers,
    compose(...enhancers)
  );
}
