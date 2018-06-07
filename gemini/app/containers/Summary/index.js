import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableWithoutFeedback,
  NetInfo,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import { router } from '../../router';
import { TextButton } from 'react-native-material-buttons';
import Icon from 'react-native-vector-icons/FontAwesome';

class Summary extends Component {
  state = {
    'error': '',
    'data': {},
  };

  products = [
    {},
    { data: '500 MB', price: '£5' },
    { data: '1 GB', price: '£10' },
    { data: '3 GB', price: '£15' },
  ];

  onButtonPress() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.props.navpush('root', router.getRoute('checkout'));
      } else {
        Alert.alert(
          'Error message',
          'No Network Connection Available',
          [
            { text: 'Cancel' },
            { text: 'OK' },
          ],
          { cancelable: false });
      }
    });
  }

  render() {
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
                <Text style={{ color: 'white', fontSize: 18, marginLeft: 10 }}>Truphone eSIM</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 340, borderWidth: 0, borderColor: '#cccccc', backgroundColor: 'white', height: 210, marginTop: 15, elevation: 3 }}>
            <View style={{ borderWidth: 0, borderColor: '#cccccc', height: 70, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={require('../../assets/img/u0.png')} />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ borderColor: '#e0e0e0', flex: 1, paddingLeft: 18, borderTopWidth: 1, justifyContent: 'center', height: 70 }}>
                <Text style={{ fontSize: 20 }}>Prepaid data</Text>
                <Text style={{ fontSize: 13 }}>(+Europe, US, Australia & Hong Kong FREE)</Text>
              </View>
            </View>


            <View style={{ flexDirection: 'row', borderWidth: 0, borderColor: '#e0e0e0', height: 70, borderTopWidth: 1 }}>
              <View style={{ flex: 7, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 2, justifyContent: 'center', paddingLeft: 18 }}><Text style={{ color: '#545454', fontSize: 21, fontWeight: 'bold' }}>{this.products[this.props.checkout.selected_product].data}</Text></View>
                  <View style={{ flex: 2, justifyContent: 'center' }}><Text style={{ fontSize: 14, fontWeight: 'normal' }}>for 30 days</Text></View>
                  <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 20 }}><Text style={{ color: '#545454', fontSize: 21, fontWeight: 'bold' }}>{this.products[this.props.checkout.selected_product].price}</Text></View>
                </View>
              </View>
            </View>

          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, paddingLeft: 20, alignItems: 'flex-start', height: 60, justifyContent: 'flex-end' }}>
              <Text style={{ color: '#a0a0A0', fontSize: 16 }}>As a bonus you'll receive:</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 10, width: 340, borderWidth: 0, borderColor: '#cccccc', backgroundColor: '#0f6781', height: 70, elevation: 3 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>100 MB</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontSize: 14 }}>for 30 days</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a9ec2' }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>FREE!</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.button}>
            <TextButton style={{ width: 150, borderRadius: 0 }} title='CHECKOUT' color="#273338" titleColor="white" onPress={() => { this.onButtonPress() }} />
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
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  button: {
    flexDirection: 'row',
  },
});

const mapStateToProps = (state) => {
  return {
    checkout: state.checkout,
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

export default connect(mapStateToProps, mapDispatchToProps)(Summary);