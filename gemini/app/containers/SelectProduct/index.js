import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import * as actions from './actions';
import Icon from 'react-native-vector-icons/FontAwesome';

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

class SelectProduct extends Component {
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
                <Text style={{ color: 'white', fontSize: 18, marginLeft: 10 }}>Select a Plan</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, paddingLeft: 30, height: 60, justifyContent: 'center' }}>
            <Text style={{ color: '#a0a0A0', fontSize: 16 }}>4G Pre Paid Data</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {productRadios}
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
    actions: bindActionCreators(actions, dispatch),
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    navpop: bindActionCreators(NavigationActions.pop, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectProduct);
