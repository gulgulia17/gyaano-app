import React, { Component } from 'react'

import StackNavigator from './routes/StackNavigator'
import PushNotificationIOS from "@react-native-community/push-notification-ios"
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';

export default class App extends Component {
  async componentDidMount() {
    messaging().subscribeToTopic("all")
      .then(() => console.log('Subscribed to topic!'))
  }
  render() {
    return (
      <StackNavigator />
    )
  }
}