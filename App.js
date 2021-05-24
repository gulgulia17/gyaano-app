import React, { Component } from 'react'

import StackNavigator from './routes/StackNavigator'
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