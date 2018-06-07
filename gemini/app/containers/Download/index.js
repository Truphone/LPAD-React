import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  DeviceEventEmitter,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation'
import ProgressBar from 'react-native-progress/Bar'
import * as  selectProductActions from '../SelectProduct/actions';
import { customLog } from '../../modules/console';

class Download extends Component {

  componentWillMount() {

    customLog('Download - componentWillMount');

    const { updateProgress } = this.props.selectProduct;

    updateProgress({ header: 'Please Wait...', percentage: 0.0 });

    DeviceEventEmitter.addListener('DOWNLOAD_PROGRESS', (event) => {

      customLog('DOWNLOAD PROGRESS EVENT - key: ' + event.key +
        '; message: ' + event.message + '; percentage: ' + event.percentage);

      updateProgress({ header: camelize(event.key), percentage: event.percentage });
    });

    BackHandler.addEventListener('hardwareBackPress', () => {});
  }

  componentWillUnmount() {

    customLog('Download - componentWillUnmount');

    const { updateProgress } = this.props.selectProduct;

    updateProgress({ header: 'Please Wait...', progress: 0.0 });

    DeviceEventEmitter.removeListener('DOWNLOAD_PROGRESS');
    BackHandler.removeEventListener('hardwareBackPress');
  }

  componentDidMount() {

    customLog('componentDidMount - downloadProfile');

    const { matchingId2, smdpAddress2 } = this.props.checkout;

    this.props.selectProduct.downloadProfile(matchingId2, smdpAddress2);
  }

  render() {
    const { error, header, progress } = this.props.checkout;
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 4 }}>
          <Image style={styles.logo} source={require('../../assets/img/download.png')} />
          <Image style={styles.logo} source={require('../../assets/img/truphone_logo_white.png')} />
          <Text style={styles.header}>{header}</Text>
          <View style={{ marginTop: 15 }}>
            <ProgressBar
              progress={progress}
              borderColor="white"
              color="white"
              width={250}
              height={6}
              borderRadius={2}
              animated={true}
            />
          </View>
          <View style={{ padding: 15 }}>
            <Text style={styles.error}>{error}</Text>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>We are now updating your device.</Text>
          <Text style={{ color: 'white' }}>You will have data connection in less than 30 seconds.</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#273338',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    resizeMode: 'contain',
    width: 120,
    height: 34,
  },
  header: {
    fontSize: 22,
    color: 'white'
  },
  error: {
    fontSize: 14,
    color: 'red'
  },

  description: {
    marginTop: 10,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state) => {
  return {
    checkout: state.checkout
  }
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    selectProduct: bindActionCreators(selectProductActions, dispatch),
    dispatch
  };
}
const camelize = function camelize(str) {

  str = str.toLowerCase();

  return str.split(' ').map((word, index) => (
    word.charAt(0).toUpperCase() + word.slice(1)
  )).join(' ');
}

export default connect(mapStateToProps, mapDispatchToProps)(Download);