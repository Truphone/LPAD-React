import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import { router } from '../../router';
import * as actions from '../SelectProduct/actions';
import Camera from 'react-native-camera';
import { TextButton } from 'react-native-material-buttons';
import { customLog } from '../../modules/console';

class ScanCode extends Component {
  state = {
    smdpAddress: '',
    matchingId: ''
  };

  _onPressCancel() {
    this.props.navpop('root');
  }

  _onBarCodeRead(result) {
    if (this.barCodeFlag) {

      customLog('' + result);

      this.barCodeFlag = false;

      var this2 = this;

      setTimeout(function () {
        let res = result.data.split("$");
        let smdpAddress = res[2];
        let matchingId = res[1];

        customLog('' + res);
        customLog('' + smdpAddress);
        customLog('' + matchingId);

        this2.setState({ smdpAddress: smdpAddress, matchingId: matchingId });
      }, 1000);
    }
  }

  _onDownload() {

    customLog('ScanCode - _onDownload. ');

  //  this.props.actions.downloadProfile(convertToHex(this.state.matchingId),
    //  convertToHex(this.state.smdpAddress).toUpperCase());

    this.props.actions.scanValues(this.state.matchingId, 'https://' + this.state.smdpAddress);
    this.props.navpush('root', router.getRoute('download'));
  }

  render() {
    this.barCodeFlag = true;

    return (
      <View>
        <Camera onBarCodeRead={(result) => { this._onBarCodeRead(result) }} style={styles.camera}>
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle} />
          </View>
        </Camera>
        <View style={{ padding: 20 }}>
          <View style={{}}>
            <Text style={{ fontSize: 16, color: 'black' }}>
              SM-DP+ Address:
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
              {this.state.smdpAddress}
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 16, color: 'black' }}>
              Activation Code:
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
              {this.state.matchingId}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ margin: 10, flex: 1, justifyContent: 'center' }}>
            <TextButton title="Cancel" titleColor='white' color="#273338" onPress={() => this._onPressCancel()} />
          </View>

          <View style={{ margin: 10, flex: 1, justifyContent: 'center' }}>
            <TextButton title="Download" titleColor='white' color="#273338" onPress={() => { this._onDownload() }} />
          </View>
        </View>
      </View>
    );
  }
}

const convertToHex = (str) => {
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += '' + str.charCodeAt(i).toString(16);
  }
  return hex;
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    navpop: bindActionCreators(NavigationActions.pop, dispatch),
    dispatch
  };
}

export default connect(null, mapDispatchToProps)(ScanCode);

var styles = StyleSheet.create({

  camera: {
    height: 408,
    alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#1f9ec4',
    backgroundColor: 'transparent',
  },

  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 15,
    width: 100,
    bottom: 10,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#0097CE',
  },
});

