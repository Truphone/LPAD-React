import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigation } from '@expo/ex-navigation';

export default class App extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <StackNavigation id="root" navigatorUID="root" initialRoute="splash" />
    );
  }
}
const styles = StyleSheet.create({
  drawerStyles: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
