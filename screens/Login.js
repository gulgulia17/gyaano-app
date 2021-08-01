import React, { Component } from 'react';
import { Image, StyleSheet, ActivityIndicator, TouchableOpacity, } from 'react-native'
import { Container, Button, Content, Item, Input, Icon, Text, View } from 'native-base';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { getUniqueId } from 'react-native-device-info';

export default class Login extends Component {

    state = {
        status: false,
        email: '',
        password: '',
        device_id: '',
        secure: true,
    }
    componentDidMount = async () => {
        this.setState({ device_id: getUniqueId() })
    }

    render() {
        const { navigation } = this.props
        const { status, email, password, device_id, secure } = this.state


        const _loginHandler = async () => {
            this.setState({ status: true })
            fetch('http://home.gyaano.in/api/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    device_id: device_id,
                }),
            }).then((response) => response.json())

                .then(async (responseJson) => {
                    console.log(responseJson)
                    this.setState({
                        status: false,
                    });
                    if (responseJson.success) {
                        await AsyncStorage.setItem('isLoggedIn', '1');
                        await AsyncStorage.setItem('token', responseJson.success.token);
                        await AsyncStorage.setItem('userID', `${responseJson.success.userid}`);
                        this.props.navigation.dispatch(StackActions.replace('HomeScreen'))
                    } else if (responseJson.error) {
                        alert(responseJson.error);
                    } else if (responseJson.message) {
                        alert(responseJson.message)
                    } else {
                        alert("Something went wrong please try again.");
                    }
                })
                .catch((error) => {
                    this.setState({
                        status: false,
                    });
                    alert(error);
                });
        }

        const showPassword = (secure) => {
            this.setState({ secure })
        }

        const LoginButton = () => {
            return (
                <View style={{ margin: '3%' }}>
                    {
                        email.length && password.length && device_id.length ?
                            <Button block bordered transparent dark onPress={() => _loginHandler()} disabled={status ? true : false}>
                                <Text style={styles.title}>login</Text>
                            </Button>
                            :
                            <Text style={[styles.footerTitle, { textAlign: 'center', fontSize: 12, letterSpacing: 0.5, color: 'red', }]}>Please fill all the fields to continue.</Text>
                    }
                </View>
            )
        }

        const SucessIcon = ({ field }) => {
            return (
                <View>
                    {
                        field.length ?
                            <Icon name='checkmark-circle' style={{ color: '#ef6c00' }} />
                            : null
                    }
                </View>
            )
        }
        return (
            <Container>
                <View style={{ marginTop: '5%' }}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back' style={{ color: '#000' }} />
                    </Button>
                </View>
                <Content style={{ backgroundColor: '#fff' }} padder>
                    <View style={{ alignItems: 'center', borderBottomColor: '#0001', borderBottomWidth: 1, paddingVertical: 5 }}>
                        <Image source={require('./../assets/logo.png')} style={{ height: 150, width: 150 }} />
                    </View>
                    <View style={{ marginTop: '15%' }}>
                        <View style={{ margin: '3%' }}>
                            <Text style={styles.title}>Email address</Text>
                            <Item>
                                <Icon type="FontAwesome5" name='envelope' style={{ color: '#0008' }} />
                                <Input
                                    onChangeText={(email) => this.setState({ email })}
                                    value={email}
                                    autoCapitalize="none"
                                    placeholder='Please enter your email.'
                                />
                                <SucessIcon field={email} />
                            </Item>
                        </View>
                        <View style={{ margin: '3%' }}>
                            <Text style={styles.title}>Password</Text>
                            <Item>
                                <Icon type="FontAwesome5" name='key' style={{ color: '#0008' }} />
                                <Input
                                    onChangeText={(password) => this.setState({ password })}
                                    value={password}
                                    autoCapitalize="none"
                                    secureTextEntry={secure}
                                    placeholder='Please enter your password.'
                                />
                                <SucessIcon field={password} />
                                <TouchableOpacity onPress={() => showPassword(!secure)}>
                                    <Icon name={secure ? 'eye' : 'eye-off'} style={{ color: '#ef6c00', fontSize: 30 }} />
                                </TouchableOpacity>
                            </Item>
                        </View>
                        <LoginButton />
                        <View style={styles.bottomLinks}>
                            <Text style={styles.title}>Not yet registered? </Text>
                            <Button
                                disabled={status ? true : false}
                                transparent
                                style={{ marginLeft: -10 }}
                                onPress={() => navigation.push('Register')}
                            >
                                <Text style={[styles.title, { marginTop: '-25%', color: 'blue', }]}>register</Text>
                            </Button>
                        </View>
                        <TouchableOpacity
                            disabled={status ? true : false}
                            onPress={() => navigation.navigate('Forgot')}
                        >
                            <Text style={[styles.title, { textAlign: 'center', color: 'blue' }]}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        status ?
                            <ActivityIndicator
                                style={{ position: 'absolute', top: '50%', left: '47%' }}
                                size="large"
                            /> : null
                    }
                </Content>
            </Container >
        )
    }
}

const styles = StyleSheet.create({
    footerTitle: {
        fontFamily: 'Montserrat-SemiBold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 10
    },
    title: {
        fontFamily: 'Montserrat-Regular',
    },
    bottomLinks: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
    }
})
