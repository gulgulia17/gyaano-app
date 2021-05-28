import React, { Component } from 'react'
import { Alert, BackHandler, Linking } from 'react-native';
import StackNavigator from './routes/StackNavigator'
import messaging from '@react-native-firebase/messaging';
import VersionCheck from 'react-native-version-check';

export default class App extends Component {
  async componentDidMount() {
    messaging().subscribeToTopic("all")
      .then(() => console.log('Subscribed to topic!'))
    this.checkUpdateNeeded();
  }

  checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded.isNeeded) {
        Alert.alert(
          'Please Update',
          'You will have to update your app to the latest version to continue using,',
          [
            {
              text: 'Update',
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeeded.storeUrl);
              },
            },
          ],
          { cancelable: false },
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <StackNavigator />
    )
  }
}