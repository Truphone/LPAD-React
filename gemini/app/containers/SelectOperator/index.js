import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableNativeFeedback,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextButton } from 'react-native-material-buttons';
import { router } from '../../router';

let Radio = (props) => {
  let radioColor = 'white'
  let bgColor = 'white';

  return (
    <TouchableNativeFeedback onPress={props.onPress} background={TouchableNativeFeedback.SelectableBackground()}>
      <View style={{ flexDirection: 'row', width: 330, borderWidth: 0, borderColor: '#cccccc', backgroundColor: 'white', height: 70, marginTop: 15, elevation: 2 }}>
        <View style={{ flex: 7, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, justifyContent: 'center', paddingLeft: 8 }}><Image source={require('../../assets/img/logo-icon.png')} /></View>

            <View style={{ flex: 2, justifyContent: 'center', paddingLeft: 8 }}><Text style={{ color: '#545454', fontSize: 21, fontWeight: 'bold' }}>{props.label}</Text></View>
            <View style={{ flex: 2, justifyContent: 'center' }}><Text style={{ fontSize: 14, fontWeight: 'normal' }}>for 30 days</Text></View>
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 10 }}><Text style={{ color: '#545454', fontSize: 21, fontWeight: 'bold' }}>{props.price}</Text></View>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>);
}

class SelectOperator extends Component {
  state = {
    'error': '',
    'data': {},
  };

  products = [
    { data: '500 MB', price: '£5', key: 1 },
    { data: '1 GB', price: '£10', key: 2 },
    { data: '3 GB', price: '£15', key: 3 },
  ];

  render() {
    let productRadios = this.products.map((p) => {
      return (<Radio key={p.key} label={p.data} price={p.price} selected={this.state.selected == p.key} onPress={() => { this.props.actions.checkout(p.key) }} />);
    });

    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ backgroundColor: '#273338', flex: 1, justifyContent: 'center', height: 55 }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableWithoutFeedback onPress={() => { this.props.navpop('root') }}>
                <View style={{ justifyContent: 'center', paddingLeft: 20, paddingRight: 30, alignItems: 'flex-start' }}>
                  <Icon style={{ fontSize: 18 }} name="arrow-left" color="white" />
                </View>
              </TouchableWithoutFeedback>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ color: 'white', fontSize: 18, marginLeft: 10 }}>Select a Provider</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, paddingLeft: 30, height: 60, justifyContent: 'center' }}>
            <Text style={{ color: '#a0a0A0', fontSize: 16 }}>Select an operator</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableNativeFeedback onPress={() => this.props.navpush('root', router.getRoute('selectproduct'))} background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={{ flex: 1, borderWidth: 0, padding: 10, borderColor: '#cccccc', backgroundColor: 'white', height: 130, marginLeft: 15, marginRight: 10, elevation: 2 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 20, alignItems: 'center', paddingLeft: 8 }}>
                  <Image source={require('../../assets/img/logo-icon.png')} />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: 'black' }}>Truphone</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => { }} background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={{ flex: 1, borderWidth: 0, padding: 10, borderColor: '#cccccc', backgroundColor: 'white', height: 130, marginLeft: 10, marginRight: 15, elevation: 2 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 20, alignItems: 'center' }}>
                  <Image source={require('../../assets/img/Telenor-512.jpg')} style={{ width: 60, height: 35 }} resizeMode="contain" />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: 'black' }}>ACMECell</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <TouchableNativeFeedback onPress={() => { }} background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={{ flex: 1, borderWidth: 0, padding: 10, borderColor: '#cccccc', backgroundColor: 'white', height: 130, marginLeft: 15, marginRight: 10, elevation: 2 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 10, marginBottom: 10, height: 60, alignItems: 'center', paddingLeft: 8 }}>
                  <Image source={require('../../assets/img/Tellco-512.jpg')} style={{ width: 50, height: 60, resizeMode: 'cover' }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: 'black' }}>Tellco</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => { this.props.navpush('root', router.getRoute('scancode')) }} background={TouchableNativeFeedback.SelectableBackground()}>
              <View style={{ flex: 1, borderWidth: 0, padding: 10, borderColor: '#cccccc', backgroundColor: 'white', height: 130, marginLeft: 10, marginRight: 15, elevation: 2 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 10, marginBottom: 10, height: 60, alignItems: 'center', paddingLeft: 8 }}>
                  <Image source={require('../../assets/img/qr.png')} style={{ width: 50, height: 60, resizeMode: 'cover' }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>Scan eSIM Voucher</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
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
    navpop: bindActionCreators(NavigationActions.pop, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectOperator);
