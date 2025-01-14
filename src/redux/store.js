import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk'
import logger from 'redux-logger';
import rootReducer from './rootReducer';
import { persistStore } from "redux-persist";
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(logger, thunk))
);
export const persistor = persistStore(store);
