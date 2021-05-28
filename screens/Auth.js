import React, { Component } from 'react';
import {
    Image, TouchableOpacity, Linking, ActivityIndicator, Alert,
    Modal,
    StyleSheet,
    ToastAndroid,
} from 'react-native'
import { Container, Button, Content, Text, View, Icon } from 'native-base';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { getUniqueId } from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import { APIKey, APIKeyBackup } from '../google-congig';

export default class Auth extends Component {
    state = {
        userInfo: [],
        status: false,
        modalVisible: false
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    _loginHandler = async (email) => {
        const device_id = getUniqueId();
        this.setState({ status: true })
        fetch('http://home.gyaano.in/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                is_social: 1,
                device_id: device_id,
            }),
        }).then((response) => response.json())

            .then(async (responseJson) => {
                this.setState({
                    status: false,
                });
                if (responseJson.success) {
                    await AsyncStorage.setItem('isLoggedIn', '1');
                    await AsyncStorage.setItem('token', responseJson.success.token);
                    await AsyncStorage.setItem('userID', `${responseJson.success.userid}`);
                    ToastAndroid.show("Login Successful, If you don't get redirected automatically please reopen the app.", ToastAndroid.LONG);
                    this.props.navigation.dispatch(StackActions.replace('HomeScreen'))
                } else if (responseJson.error) {
                    await GoogleSignin.revokeAccess();
                    Alert.alert('Error', `${responseJson.error}`);
                } else if (responseJson.message) {
                    await GoogleSignin.revokeAccess();
                    Alert.alert('Error', `${responseJson.message}`)
                } else {
                    await GoogleSignin.revokeAccess();
                    Alert.alert('Error', "Something went wrong please try again.");
                }
            })
            .catch((error) => {
                this.setState({
                    status: false,
                });
                Alert.alert('Error', error);
            });
    }

    signIn = async (APIKey) => {
        this.setState({ status: true });
        try {
            GoogleSignin.configure({
                webClientId: APIKey
            });
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            this.setState({ userInfo, status: true, });
            this._loginHandler(userInfo.user.email);

        } catch (e) {
            try {
                this.signIn(APIKeyBackup);
            } catch (e) {
                ToastAndroid.show("Login Faild, Something went wrong please try with email and password!.", ToastAndroid.LONG);
            }
        } finally {
            this.setState({ status: false, });
        }
    };

    render() {
        const { navigation } = this.props
        const { modalVisible } = this.state
        return (
            <Container>
                <Content style={{ paddingHorizontal: '5%', paddingVertical: '15%', backgroundColor: '#fff' }}>
                    <View style={{ alignItems: 'center', borderBottomWidth: 1, borderColor: '#0001' }}>
                        <Image source={require('./../assets/logo.png')} style={{ height: 200, width: 200, marginVertical: '5%', }} />
                    </View>
                    <View style={{ marginTop: '30%' }}>
                        <View style={{ margin: '3%' }}>
                            <Button block bordered transparent dark onPress={() => navigation.navigate('Login')}>
                                <Text style={[styles.title, { letterSpacing: 2, }]}>login traditionally</Text>
                            </Button>
                        </View>
                        <View style={{ margin: '3%' }}>
                            <Button block bordered transparent onPress={() => this.signIn(APIKey)}>
                                <Icon name="google" type="FontAwesome5" />
                                <Text style={[styles.title, { letterSpacing: 2, }]}>Login with Google</Text>
                            </Button>
                        </View>
                        <View style={{ margin: '3%' }}>
                            <Button block bordered transparent success onPress={() => navigation.navigate('Register')}>
                                <Text style={[styles.title, { letterSpacing: 2, }]}>Register</Text>
                            </Button>
                        </View>
                        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                            <Text style={[styles.title, styles.buttonHelp]}>Need help ? Contact Us</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => { this.setModalVisible(false) }}
                        >
                            <View style={styles.centeredView}>
                                <View style={[styles.modalView]}>
                                    <Text style={{ textAlign: "center" }, [styles.title]}>Contact us over</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: '8%' }}>
                                        <View style={{ margin: "10%" }}>
                                            <TouchableOpacity onPress={() => Linking.openURL('mailto:gyaanoapp@gmail.com')}>
                                                <Icon style={{ textAlign: 'center' }} type="FontAwesome5" name="envelope" />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ margin: "10%" }}>
                                            <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/918107746007')}>
                                                <Icon style={{ textAlign: 'center' }} type="FontAwesome5" name="whatsapp" />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ margin: "10%" }}>
                                            <TouchableOpacity onPress={() => Linking.openURL('tel:${+918107746007}')}>
                                                <Icon style={{ textAlign: 'center' }} name="call" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <Text style={{ textAlign: "center" }, [styles.title]}>Office hours are from 10AM to 6PM , You can contact us through whatsapp or email.</Text>
                                    <View style={{ paddingVertical: '2%' }}>
                                        <TouchableOpacity onPress={() => Linking.openURL('tel:${+918107746007}')}>
                                            <Text style={{ textAlign: "center", }, [styles.title]}>
                                                Helpdesk - +91 8107746007
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </Content>
                {
                    this.state.status ?
                        <ActivityIndicator
                            style={{ position: 'absolute', top: '50%', left: '47%' }}
                            size="large"
                        /> : null
                }
            </Container >

        );
    }
}
const styles = StyleSheet.create({
    title: {
        fontFamily: 'Montserrat-SemiBold',
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontSize: 14,
        textAlign: 'center',
    },
    buttonHelp: {
        alignItems: 'center',
        color: 'blue',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})
