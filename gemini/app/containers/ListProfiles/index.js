import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Switch,
  DeviceEventEmitter,
  ActivityIndicator,
  Image,
  TouchableNativeFeedback,
  ScrollView,
  RefreshControl,
  Alert,
  BackHandler,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextButton } from 'react-native-material-buttons';
import * as actions from './actions';
import { NavigationActions, AndroidBackButtonBehavior } from '@expo/ex-navigation';
import { router } from '../../router';
import { customLog } from '../../modules/console';

class ListProfiles extends Component {
  state = {
    refreshing: false,
  };

  componentWillMount() {

    customLog('ListProfiles - componentWillMount');

    DeviceEventEmitter.addListener('SIM_READY', (event) => {

      if (this.props.profile.isLoading) {
        customLog('ListProfiles - componentWillMount - is loading. Calling sim_refreshed.');

        this.props.actions.sim_refreshed();
      }
    });

    BackHandler.addEventListener('hardwareBackPress', () => { });
  }

  componentWillUnmount() {

    DeviceEventEmitter.removeListener('SIM_READY');
    BackHandler.removeEventListener('hardwareBackPress');
  }

  onValueChange(iccid, value) {
    const { actions, profile } = this.props

    actions.toggleProfile(iccid, value)
  }

  onDelete(iccid) {
    const { actions } = this.props

    actions.deleteProfile(iccid);
  }

  _onRefresh() {
    const { actions } = this.props

    actions.reloadListProfiles();
  }

  renderItems(items) {
    const {
      activeprofile
    } = this.props.profile;

    if (items.length > 0) {
      let chooseProfile = <View></View>;

      if (items.length == 1 && activeprofile !== null && activeprofile) {
      }
      else {
        chooseProfile = <View style={{ margin: 10, marginTop: 25, flexDirection: 'row' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#aaa' }}> Choose a profile. </Text>
        </View>
      }

      return <View>
        {chooseProfile}
        {items}
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'flex-end', justifyContent: 'center', marginTop: 40, paddingBottom: 50 }}>
          <Button title="Add profile..." onPress={() => { this.props.navpush('root', router.getRoute('selectoperator')) }} />
        </View>
      </View>
    }
  }

  renderProgressIndicator() {

    return <View style={{
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#273338'
    }}>
      <ActivityIndicator
        animating={true}
        color='#1f9ec4'
        size="large"
        style={styles.activityIndicator}
      />
      <Text style={{ fontSize: 15, color: "white" }}>We are now updating your device</Text>
    </View>;
  }

  render() {
    try {
      let active = <View></View>;
      const {
        error,
        profiles,
        errorHeader,
        isLoading,
        activeprofile
      } = this.props.profile;

      if (error && error.length > 0) {
        const alertHeader = (errorHeader && errorHeader.length > 0) ? errorHeader : 'Unexpected Problem';
        Alert.alert(
          alertHeader,
          error,
          [
            { text: 'OK', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false });
      }
      if (isLoading) {
        return this.renderProgressIndicator();
      }

      if (activeprofile !== null && activeprofile) {
        let ai;

        if (profiles[activeprofile.iccid].loading) {
          ai = this.renderProgressIndicator();
        } else {
          ai = (
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingRight: 20 }}><Switch value={true} onPress={(event) => event.stopPropagation()} onValueChange={(value) => { this.onValueChange(activeprofile.iccid, value) }} />
            </View>
          )
        }

        active = (
          <View>
            <View style={{ flexDirection: 'row' }}>
              <View key={"ttt"} style={{ flex: 1, flexDirection: 'row', height: 70, elevation: 4, backgroundColor: 'white', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ justifyContent: 'center', paddingLeft: 8, marginRight: 10 }}>
                  <Image source={require('../../assets/img/logo-icon.png')} />
                </View>

                <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold' }}>1,100 MB</Text></View>
                <View style={{ flex: 1 }}><Text> </Text></View>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ borderTopWidth: 1, borderColor: "#eee", height: 100, elevation: 4, backgroundColor: 'white', flex: 1, justifyContent: 'center', paddingLeft: 30 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#aaa" }}>Prepaid data</Text>
                <Text style={{ fontSize: 15, color: "#aaa" }}>(+Europe, US, Australia & Hong Kong FREE)</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ borderTopWidth: 1, flexDirection: 'row', borderColor: "#eee", height: 70, elevation: 4, backgroundColor: 'white', flex: 1, alignItems: 'center', paddingLeft: 30 }}>
                <View style={{}}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#aaa" }}># {activeprofile.iccid}</Text>
                </View>
                {ai}
              </View>
            </View>
          </View>);
      }

      customLog('' + this.state);

      let items = Object.keys(profiles).map((k) => {
        let status = false;

        if (profiles[k].status === 1) {
          status = true;
        } else {
          let additional;

          if (profiles[k].extra) {
            additional = (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ borderTopWidth: 1, borderColor: "#eee", height: 100, backgroundColor: 'white', flex: 1, justifyContent: 'center', paddingLeft: 30 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: "#aaa" }}>Prepaid data</Text>
                    <Text style={{ fontSize: 15, color: "#aaa" }}>(+Europe, US, Australia & Hong Kong FREE)</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ borderTopWidth: 1, borderColor: "#eee", height: 50, backgroundColor: 'white', flex: 1, justifyContent: 'center', paddingLeft: 30 }}>
                    <Text style={{ fontSize: 15, color: "black" }}>Remaining Data                                   <Text style={{}}>1,100MB</Text></Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: "#eee", height: 70, backgroundColor: 'white', flex: 1, alignItems: 'center', paddingLeft: 30 }}>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: "#aaa" }}># {profiles[k].iccid}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <TextButton style={{ width: 90 }} color="white" titleColor="red" title="Delete" onPress={() => { this.onDelete(profiles[k].iccid) }} /></View>
                  </View>
                </View></View>);
          }

          let activityIndicator;

          if (profiles[k].loading) {
            activityIndicator = this.renderProgressIndicator();
          } else {
            activityIndicator = (
              <View style={{}}><Switch value={status} onPress={(event) => event.stopPropagation()} onValueChange={(value) => { this.onValueChange(profiles[k].iccid, value) }} />
              </View>
            )
          }

          return (
            <View key={k} style={{ marginLeft: 10, marginRight: 10, backgroundColor: 'white', marginBottom: 10, elevation: 2 }}>
              <TouchableNativeFeedback onPress={() => this.props.actions.extra(profiles[k].iccid)}>
                <View style={{ flexDirection: 'row', height: 70, backgroundColor: 'white', padding: 10, alignItems: 'center', justifyContent: 'center' }}>

                  <View style={{ justifyContent: 'center', paddingLeft: 8, marginRight: 10 }}>
                    <Image source={require('../../assets/img/logo-icon.png')} />
                  </View>
                  <View style={{ flex: 1 }}><Text style={{ fontWeight: 'bold' }}>1,100 MB</Text></View>
                  <View style={{ flex: 1 }}><Text> </Text></View>

                  {activityIndicator}
                </View>
              </TouchableNativeFeedback>

              {additional}
            </View>
          );
        }
      });

      return (
        <AndroidBackButtonBehavior isFocused={true}
          onBackButtonPress={() => Promise.resolve(BackHandler.exitApp())}>
          <View style={styles.container}>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ backgroundColor: '#273338', flex: 1, paddingLeft: 30, justifyContent: 'center', height: 55 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: 'white', fontSize: 18, marginLeft: 10 }}>My connectivity profiles</Text>
                </View>
              </View>
            </View>

            <ScrollView refreshControl={<RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />}>
              {active}
              {this.renderItems(items)}
            </ScrollView>
          </View>
        </AndroidBackButtonBehavior>
      );
    } catch (e) {
      alert(e);
    }
  }
}

const styles = StyleSheet.create({
  button: {
    paddingTop: 20
  },
  row: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
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
  activityIndicator: {
    height: 80
  }
});

const mapStateToProps = ({ profile }) => {
  return {
    profile,
  }
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    actions: bindActionCreators(actions, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListProfiles);
