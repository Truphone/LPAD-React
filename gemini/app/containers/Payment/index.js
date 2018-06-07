import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Picker,
  ScrollView,
  TextInput
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import * as actions from '../SelectProduct/actions';
import Checkbox from '../../components/Checkbox';
import { router } from '../../router';

class Payment extends Component {
  state = {
    'error': '',
    'data': {},
    accepted: false,
    form: {
      email: '',
      cardholder: '',
      cardnumber: '',
      cvv: '',
      month: '01',
      year: '2017',
      accepted: false,
    },
    invalid: {
      email: false,
      cardholder: false,
      cardnumber: false,
      cvv: false,
      month: false,
      year: false,
      accepted: false,
    }
  };

  products = [
    {},
    { data: '500 MB', price: '£5' },
    { data: '1 GB', price: '£10' },
    { data: '3 GB', price: '£15' },
  ];

  onSubmit(form) {
    let invalid = {};

    if (!form.email) {
      invalid.email = true
    }
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

    if (res.length == 0) {
      this.props.navpush('root', router.getRoute('thankyou'))
    } else {
      this.setState({ invalid: invalid });
    }
  }

  render() {
    try {
      var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      let monthOptions = months.map((key) => {
        return (<Picker.Item label={key} key={key} value={key} />);
      });

      var years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
      let yearOptions = years.map((key) => {
        return (<Picker.Item label={key} key={key} value={key} />);
      });

      let errBorder = 'red';
      let border = '#cccccc';

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
              <View style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontWeight: 'bold', fontSize: 15, borderBottomWidth: 2, borderBottomColor: '#1f9ec4' }}>Payment</Text></View>
              <View style={{ flex: 1, alignItems: 'center' }}><Text>Thank you</Text></View>
            </View>
          </View>
          <View style={{ width: 320, paddingLeft: 20, marginTop: 20, marginBottom: 50 }}>
            <View style={{ marginTop: 10 }}>
              <View style={{ marginBottom: 5 }}><Text style={{ fontSize: 13 }}>Email for order confirmantion</Text></View>
              <View>
                <TextInput value={this.state.form.email} onChangeText={(text) => this.setState({ form: { ...this.state.form, email: text } })} keyboardType="email-address" style={{ backgroundColor: 'white', borderWidth: 1, borderColor: this.state.invalid.email ? errBorder : border }} />
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text>Already a customer? <Text style={{ color: '#1f9ec4' }}>Login</Text></Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={{ marginBottom: 5 }}><Text style={{ fontSize: 13 }}>Cardholder name</Text></View>
              <View>
                <TextInput value={this.state.form.cardholder} onChangeText={(text) => this.setState({ form: { ...this.state.form, cardholder: text } })} style={{ backgroundColor: 'white', borderWidth: 1, borderColor: this.state.invalid.cardholder ? errBorder : border }} />
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={{ marginBottom: 5 }}><Text style={{ fontSize: 13 }}>Card number</Text></View>
              <View>
                <TextInput maxLength={16} value={this.state.form.cardnumber} onChangeText={(text) => this.setState({ form: { ...this.state.form, cardnumber: text } })} keyboardType="numeric" style={{ backgroundColor: 'white', borderWidth: 1, borderColor: this.state.invalid.cardnumber ? errBorder : border }} />
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={{ marginBottom: 5 }}><Text style={{ fontSize: 13 }}>Card Expiry</Text></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: 'white', marginRight: 10, borderColor: '#cccccc', borderWidth: 1 }}>
                  <Picker
                    selectedValue={this.state.form.month}
                    onValueChange={(month) => this.setState({ form: { ...this.state.form, month: month } })}>
                    {monthOptions}
                  </Picker>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', borderColor: '#cccccc', borderWidth: 1 }}>
                  <Picker
                    selectedValue={this.state.form.year}
                    onValueChange={(year) => this.setState({ form: { ...this.state.form, year: year } })}>
                    {yearOptions}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={{ marginBottom: 5 }}><Text style={{ fontSize: 13 }}>Security Code</Text></View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, backgroundColor: 'white', marginRight: 10, borderColor: '#cccccc', borderWidth: 1 }}>
                  <TextInput maxLength={3} keyboardType="numeric" value={this.state.form.cvv} onChangeText={(text) => this.setState({ form: { ...this.state.form, cvv: text } })} style={{ backgroundColor: 'white', borderWidth: 1, borderColor: this.state.invalid.cvv ? errBorder : border }} />
                </View>
                <View style={{ flex: 2, justifyContent: 'center' }}>
                  <Text style={{ color: '#bababa' }}>3-digit No on the</Text>
                  <Text style={{ color: '#bababa' }}>back of your card</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Checkbox value="accepted" labelColor={this.state.invalid.accepted ? errBorder : border} label="I accept the Terms of Service" checked={this.state.form.accepted} onCheck={(arg) => { this.setState({ form: { ...this.state.form, accepted: arg } }) }} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
              </View>
              <View style={{ flex: 1 }}>
                <Image resizeMode="contain" style={{ width: 180 }}
                  source={require('../../assets/img/visa_mc.png')}
                />

              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ marginTop: 30, width: 120 }}>
                <Button title="Pay Securely" color="#631f6d" onPress={() => { this.onSubmit(this.state.form) }} />
              </View>
            </View>
          </View>
        </ScrollView>
      )
    } catch (e) {
      alert(e);
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
