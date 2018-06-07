import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import {
  SPLASH
} from './actionTypes';

class Splash extends Component {

  componentDidMount() {
    this.props.dispatch({type: SPLASH});
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../../assets/img/truphone_logo_white.png')}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#062631',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    resizeMode: 'contain',
    width: 120,
    height: 34,
  }

});

const mapStateToProps = (state) => {
  return {
    settings: state.settings,
  }
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
