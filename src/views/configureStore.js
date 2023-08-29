import { applyMiddleware, compose, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable';
import epics from '../epics/epic';
import Reducers from '../reducers'
import { persistStore, persistCombineReducers, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';

import { createLogger } from 'redux-logger';

const Config = {
  key:'root',
  storage: AsyncStorage,
  debug:false,
  blacklist: []
}

const middleware = [];

const epicMiddleware = createEpicMiddleware();

if(__DEV__){ middleware.push(createLogger()); }
middleware.push(epicMiddleware);
const rootReducer = persistCombineReducers(Config, Reducers);
const enhancers = enhancer = compose(applyMiddleware(...middleware));
const persistConfig = { enhancers };
const store = createStore(rootReducer, enhancers);

const persistor = persistStore(store, persistConfig, () => {});

function configureStore(){
  return { persistor, store }
}

epicMiddleware.run(epics);

export default configureStore;