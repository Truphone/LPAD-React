import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableWithoutFeedback,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import * as actions from '../SelectProduct/actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import smartsdk from 'react-native-smart-sdk';
import Checkbox from '../../components/Checkbox';
import { router } from '../../router';
import { TextButton } from 'react-native-material-buttons';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import TextField from 'react-native-md-textinput';
import Orientation from 'react-native-orientation-locker';
import cardio from 'react-native-card-io';
import { Circle } from 'react-native-svg';
import { customLog } from '../../modules/console';

class Payment extends Component {
  state = {
    cardScanned: false,
    scannedDetails: {},
    'error': '',
    'data': {},
    accepted: false,
    form: {
      cardholder: '',
      cardnumber: '',
      cvv: '',
      month: '',
      year: '',
      accepted: false,
    },
    invalid: {
      cardholder: false,
      cardnumber: false,
      cvv: false,
      month: false,
      year: false,
      accepted: false,
    }
  };

  scanCard() {
    let result = cardio.scanCard().then((result) => {
      this.setState({ 'cardScanned': true });

      let form = {
        cardholder: result.cardholderName,
        cardnumber: result.redactedCardNumber,
        month: '' + result.expiryYear,
        year: '' + result.expiryMonth,
        cvv: result.cvv
      };

      this.setState({ form: form });
      this.onSubmit(form);

      customLog(result);
    }).catch((error) => customLog(error));
  }

  onSubmit(form) {
    let invalid = {};

    if (!form.cardholder) {
      invalid.cardholder = true
    }
    if (!form.cardnumber) {
      invalid.cardnumber = true
    }
    if (!form.cvv) {
      invalid.cvv = true
    }
    if (!form.accepted) {
      invalid.accepted = true
    }

    let res = Object.keys(invalid).filter((k) => {
      return invalid[k]
    });

    this.props.actions.modal();
  }

  render() {
    let errBorder = "red";
    let border = "#aaaaaa";

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ width: 280 }}>
            <TextField label={'Cardholder Name'} borderColor={this.state.invalid.cardholder ? errBorder : border} highlightColor={'#00BCD4'} disabled={true} height={40} value={this.state.form.cardholder} onChangeText={(text) => this.setState({ form: { ...this.state.form, cardholder: text } })} />
            <TextField label={'Card Number'} borderColor={this.state.invalid.cardnumber ? errBorder : border} highlightColor={'#00BCD4'} disabled={true} height={40} value={this.state.form.cardnumber} onChangeText={(text) => this.setState({ form: { ...this.state.form, cardnumber: text } })} />
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <TextField label={'Expiry month'} borderColor={this.state.invalid.month ? errBorder : border} keyboardType={'numeric'} highlightColor={'#00BCD4'} disabled={true} height={40} value={this.state.form.month} onChangeText={(text) => this.setState({ form: { ...this.state.form, month: text } })} />
              </View>
              <View style={{ flex: 1 }}>
                <TextField label={'Year'} borderColor={this.state.invalid.year ? errBorder : border} keyboardType={'numeric'} highlightColor={'#00BCD4'} disabled={true} height={40} value={this.state.form.year} onChangeText={(text) => this.setState({ form: { ...this.state.form, year: text } })} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <TextField label={'Security code'} borderColor={this.state.invalid.cvv ? errBorder : border} keyboardType={'numeric'} highlightColor={'#00BCD4'} height={40} value={this.state.form.cvv} onChangeText={(text) => this.setState({ form: { ...this.state.form, cvv: text } })} />
              </View>
              <View style={{ flex: 1 }}>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox value="accepted" label={"I accept the Terms of Service"} labelColor={this.state.invalid.accepted ? errBorder : border} checked={this.state.form.accepted} onCheck={(arg) => { this.setState({ form: { ...this.state.form, accepted: arg } }) }} />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ marginBottom: 40, width: 320, flexDirection: 'row' }}>
            <View style={{ margin: 10, flex: 1, justifyContent: 'center' }}>
              <Button title="Scan Card" color="#273338" onPress={() => { this.scanCard(); }} />
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Button title="Secure Checkout" color="#273338" onPress={() => { this.onSubmit(this.state.form); }} />
            </View>
          </View>
        </View>
      </View>);
  }
}

const mapStP2 = (state) => {
  return {
    checkout: state.checkout,
  }
}

const mapDtP2 = (dispatch, state) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    dispatch
  };
}

let PaymentConnected = connect(mapStP2, mapDtP2)(Payment);

class MyInfo extends Component {
  state = {
    scanned: false,
    myinfo: {}
  };

  componentDidMount() {
   
    smartsdk.initSdk("licence");
  }

  onSuccess(args) {

    this.setState({ scanned: true });
    this.setState({ myinfo: args });
    this.props.actions.kyc_success(args);
  }

  scanDocument() {
    smartsdk.startSdk()
      .then((result) => { this.onSuccess(result) })
      .catch((error) => { this.onFailure(error) });
  }

  onFailure(error) {
    
    alert(error);
  }

  onConfirm() {
  
    this.props.actions.confirm();
  }

  render() {
    try {
      let props = this.state.myinfo;

      if (!this.state.scanned) {
        return (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Already with Truphone?</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
                <TextButton style={{ width: 150, borderRadius: 0 }} title='LOGIN' color="#00a0c2" titleColor="white" onPress={() => { }} />
              </View>
            </View>
            <View style={{ flex: 5, paddingTop: 30, borderColor: "#cecece", borderTopWidth: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Image source={require('../../assets/img/profile-icon.png')} />
              </View>
              <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Register an Account</Text>
              </View>
              <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 14 }}>Scan your passport to register an account</Text>
              </View>
              <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 40 }}>
                <TextButton style={{ width: 150, borderRadius: 0 }} title='SCAN NOW' color="#273338" titleColor="white" onPress={() => { this.scanDocument() }} />
              </View>
            </View>
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ width: 280 }}>
                <TextField label={'Nationality'} highlightColor={'#00BCD4'} disabled={true} value={props.issuingCountry} height={40} />
                <TextField label={'Passport Number'} highlightColor={'#00BCD4'} disabled={true} value={props.idNumber} height={40} />
                <TextField label={'Name'} highlightColor={'#00BCD4'} disabled={true} value={props.firstName + " " + props.lastName} height={40} />

                <TextField label={'Date of birth'} highlightColor={'#00BCD4'} value={props.dob} height={40} />
              </View>
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
              <View style={{ marginBottom: 40, width: 250, flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'center', marginRight: 20 }}>
                  <Button title="Rescan" color="#aaa" onPress={() => { smartsdk.startSdk((args) => { this.onSuccess(args) }, (args) => { this.onFailure(args) }); }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Button title="Confirm" color="#273338" onPress={() => { this.onConfirm() }} />
                </View>
              </View>
            </View>
          </View>
        );
      }
    } catch (e) {
      alert(e);
    }
  }
}

const mapStP = (state) => {
  return {
    checkout: state.checkout,
  }
}

const mapDtP = (dispatch, state) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    dispatch
  };
}

let MyInfoConnected = connect(mapStP, mapDtP)(MyInfo);

async function isActivated() {

  return await smartsdk.isActivated();
}


class Checkout extends Component {

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  state = {
    'error': '',
    'data': {},
    selected: 0,
    country: 'GBR',
    document_type: 'passport',
    index: 0,
    routes: [
      { key: '1', title: 'My details' },
      { key: '2', title: 'Payment' }
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => {
    return (
      <TabBar
        {...props}
        scrollEnabled={false}
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
      />
    );
  };

  _renderScene = SceneMap({
    '1': MyInfoConnected,
    '2': PaymentConnected,
  });

  onDownload() {

    this.props.actions.closemodal();

    customLog('Navigate to download')

    this.props.navpush('root', router.getRoute('download'));
  }

  render() {
    let idx = this.state.index;

    if (this.props.checkout.infoconfirm) {
      idx = 1
    }

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
                <Text style={{ color: 'white', fontSize: 18, marginLeft: 10 }}>Checkout</Text>
              </View>
            </View>
          </View>
        </View>

        <TabViewAnimated
          style={styles.container}
          navigationState={{ ...this.state, infocollected: this.props.checkout.infocollected, index: idx }}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          onRequestChangeTab={() => { }}
        />

        <View>
          <Modal
            animated={this.state.animated}
            transparent={true}
            visible={this.props.checkout.modal}
            onRequestClose={() => {
              this.props.actions.closemodal();
            }}>
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingLeft: 20, paddingRight: 20, paddingBottom: 30, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ borderRadius: 0, alignItems: 'center', backgroundColor: 'white', padding: 10, height: 240 }}>
                <View style={{ paddingTop: 20, alignItems: 'center', justifyContent: 'center' }} >
                  <Image source={require('../../assets/img/completed.png')} />
                  <Text style={{ fontSize: 26, marginTop: 10, color: '#273338' }}>Purchase Successful!</Text>
                  <Text style={{ fontSize: 16 }}>Your Order No: #123459</Text>
                </View>
                <View style={{ flex: 1, paddingBottom: 10, justifyContent: 'flex-end' }}>
                  <Button title="DOWNLOAD eSIM"
                    color="#273338"
                    onPress={() => { this.onDownload() }}
                    style={{ width: 60 }} />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1'
  },
  indicator: {
    backgroundColor: '#f1f1f1',
  },
  tabbar: {
    backgroundColor: '#273338'
  },
  tab: {
    width: 180,
  },

  label: {
    color: '#fff',
    fontWeight: '400',
  },
});

const mapStateToProps = (state) => {
  return {
    checkout: state.checkout,
  }
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    navpop: bindActionCreators(NavigationActions.pop, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);