import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from '@expo/ex-navigation';
import { router } from '../../router';
import { TextButton } from 'react-native-material-buttons';
import { customLog } from '../../modules/console';

class Home extends Component {

  state = {
    'error': '',
    'data': {}
  };

  render() {
    const {
      navpush,
      modal,
      error,
      profile } = this.props;

    customLog("Rending HOME with profile: " + JSON.stringify(profile));

    try {
      if (profile.error && profile.error.length > 0) {
        const alertHeader = (profile.errorHeader && profile.errorHeader.length > 0) ? profile.errorHeader : 'Unexpected Problem';
        const alertButtons = [
          { text: 'OK', onPress: () => { profile.fatalError ? BackHandler.exitApp() : customLog('Button Clicked'); } },
        ];

        Alert.alert(
          alertHeader,
          profile.error,
          alertButtons,
          { cancelable: false });
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Image style={styles.logo} source={require('../../assets/img/sim.png')} />
            <Text style={styles.header}>You do not have any connectivity profiles yet.</Text>
            <View style={styles.description}>
              <Text style={styles.descriptionFont}>Add a profile to use data while you're in other countries.</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.button}>
              <TextButton style={{ width: 150, borderRadius: 0 }} title='GET STARTED' color="white" titleColor="#273338" onPress={() => { navpush('root', router.getRoute('selectoperator')) }} />
            </View>
          </View>
        </View>
      );
    } catch (e) {
      alert(e);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#273338',
  },
  contentTop: {
    flex: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  content: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 22,
    color: 'white'
  },
  descriptionFont: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center'
  },
  description: {
    marginTop: 10,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  button: {
    flexDirection: 'row'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const mapStateToProps = ({ profile }) => {
  return {
    profile,
  }
}

const mapDispatchToProps = (dispatch, state) => {

  return {
    navpush: bindActionCreators(NavigationActions.push, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

