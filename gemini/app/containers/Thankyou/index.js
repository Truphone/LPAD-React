import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Picker,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import * as actions from '../SelectProduct/actions';
import Checkbox from '../../components/Checkbox';
import { router } from '../../router';

class Thankyou extends Component {
  state = {
    'error': '',
    'data': {},
    accepted: false,
  };

  products = [
    {},
    { data: '500 MB', price: '£5' },
    { data: '1 GB', price: '£10' },
    { data: '3 GB', price: '£15' },
  ];

  render() {
    var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    let monthOptions = months.map((key) => {
      return (<Picker.Item label={key} key={key} value={key} />);
    });
    var years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    let yearOptions = years.map((key) => {
      return (<Picker.Item label={key} key={key} value={key} />);
    });

    return (
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ backgroundColor: '#1f9ec4', flex: 1, alignItems: 'center', justifyContent: 'center', height: 55 }}>
            <Text style={{ color: 'white', fontSize: 18 }}>My Basket</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'flex-start', flex: 1, backgroundColor: 'transparent' }}>
            <Image
              source={require('../../assets/img/bg-left.png')}
              style={{ resizeMode: 'stretch', top: -10 }} />

            <View style={{ flexDirection: 'row', top: -40 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ borderColor: '#cccccc', paddingLeft: 25, borderWidth: 1, backgroundColor: 'white', justifyContent: 'center', width: 320, height: 80 }}>
                  <Text style={{ fontSize: 20 }}>Prepaid data</Text>
                  <Text style={{ fontSize: 13 }}>(+Europe, US, Australia & Hong Kong FREE)</Text>
                </View>
                <View style={{ borderColor: '#cccccc', paddingLeft: 25, borderWidth: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: 320, height: 80 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 15 }}>{this.products[this.props.checkout.selected_product].data}</Text></View>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 13 }}>30 days</Text></View>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 15 }}>{this.products[this.props.checkout.selected_product].price}</Text></View>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 15 }}>100 MB</Text></View>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 13 }}>30 days</Text></View>
                    <View style={{ flex: 1 }}><Text style={{ fontSize: 15 }}>FREE</Text></View>
                  </View>
                </View>

              </View>
            </View>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', width: 320, alignItems: 'center' }}>
            <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ borderBottomWidth: 2, borderBottomColor: '#1f9ec4' }}>My details</Text></View>
            <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ borderBottomWidth: 2, borderBottomColor: '#1f9ec4' }}>Payment</Text></View>
            <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 15, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#1f9ec4' }}>Thank you</Text></View>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 320, alignItems: 'center' }}>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 32 }}>Thank You!</Text>
            </View>

            <Text>Your Order No: #1237469</Text>
            <View style={{ marginTop: 20, padding: 10, backgroundColor: 'white', borderWidth: 1, borderColor: '#cccccc' }}>
              <Text>We are provisioning your device.</Text>
              <Text>You will have a data connection in 30 seconds.</Text>
            </View>
          </View></View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginTop: 30, width: 120 }}>
            <Button title="Home" color="#631f6d" onPress={() => { this.props.navpush('root', router.getRoute('selectproduct')) }} />
          </View>
        </View>
      </ScrollView>
    )
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
    checkout: state.checkout,
  }
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Thankyou);
