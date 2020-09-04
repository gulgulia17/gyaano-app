import React, { Component } from 'react'
import { StyleSheet, Image, ImageBackground, StatusBar } from 'react-native'
import { StackActions } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';

export default class Splash extends Component {
    componentDidMount = async () => {
        setTimeout(async () => {
            const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
            this.props.navigation.dispatch(
                StackActions.replace(isLoggedIn == 1 ? 'HomeScreen' : 'AuthScreen', {
                    screen: 'Auth'
                })
            )
        }, 3000);
    }
    render() {
        const { title } = styles
        return (
            <ImageBackground source={require('./../assets/splash.jpg')} style={styles.image}>
                <StatusBar hidden={true} />
                <Animatable.View
                    animation="slideInDown"
                    iterationCount={5}
                    direction="alternate"
                    style={title}
                >
                    <Image source={require('./../assets/logo.png')} style={{ height: 200, width: 200 }} />
                </Animatable.View>
            </ImageBackground>

        )
    }
}


const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center',
    },
    text: {
        color: "grey",
        fontSize: 30,
        fontWeight: "bold"
    }
});
