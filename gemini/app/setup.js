import App from './containers/App';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
  NavigationContext,
  NavigationProvider
} from '@expo/ex-navigation';
import configureStore from './store';
import { router } from './router';

const store = configureStore();

const navigationContext = new NavigationContext({
  router: router,
  store: store
})

export default function setup() {
  class Root extends Component {
    render() {
      return (
        <Provider store={store}>
          <NavigationProvider context={navigationContext}>
            <App />
          </NavigationProvider>
        </Provider>
      );
    }
  }

  return Root;
}
