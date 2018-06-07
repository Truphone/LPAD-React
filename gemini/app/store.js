import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga'
import { persistStore, autoRehydrate } from 'redux-persist'
import promiseMiddleware from 'redux-promise-middleware';
import { AsyncStorage } from 'react-native';
import devToolsEnhancer from 'remote-redux-devtools';
import { createNavigationEnabledStore } from '@expo/ex-navigation';
import rootSaga from './containers/App/sagas';
import rootReducer from './containers/App/reducer';

const sagaMiddleware = createSagaMiddleware()

function configureStore(initialState = {}) {

  const middleware = [
    sagaMiddleware,
    thunk,
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']
    })
  ];

  const createStoreWithNavigation = createNavigationEnabledStore({
    createStore: createStore,
    navigationStateKey: 'navigation'
  });

  const createStoreWithMiddleware = applyMiddleware(...middleware)(createStoreWithNavigation);

  const store = createStoreWithMiddleware(rootReducer,
    initialState,
    compose(autoRehydrate(), devToolsEnhancer()));

  sagaMiddleware.run(rootSaga);

  persistStore(store, { storage: AsyncStorage, whitelist: ['auth'] })

  return store

}

module.exports = configureStore;
