import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootReducer from '../reducers';
// import { env,variables } from 'utils/env';
import rootSaga from '../sagas';
import createSagaMiddleware from 'redux-saga';

// Build the middleware for intercepting and dispatching navigation actions
const sagaMiddleware = createSagaMiddleware();


// const getMiddleware = () => {
//   if (env(variables.environment) !== 'local') {
//     return applyMiddleware(sagaMiddleware);
//   } else {
//     return applyMiddleware(createLogger(), sagaMiddleware)
//   }

// };

const getMiddleware = () => {
  return applyMiddleware(createLogger(), sagaMiddleware);
};

const configureStore = () => {
  const store = createStore(rootReducer, composeWithDevTools(getMiddleware()));
  sagaMiddleware.run(rootSaga);
  return store;
}

const store = configureStore();
export default store;

export type RootState = ReturnType<typeof rootReducer>;
