import React, { Component } from 'react';
import { Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, } from 'react-native'
import { Container, Button, Content, Spinner, Item, Input, Icon, Text, View } from 'native-base'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { getUniqueId } from 'react-native-device-info';
import APIKey from '../google-congig';

export default class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        mobile: '',
        devide_id: '',
        lastname: '',
        cityid: '',
        stateid: '',
        status: false,
        nameError: null,
        emailError: null,
        passwordError: null,
        mobileError: null,
        devide_idError: null,
        lastnameError: null,
        cityidError: null,
        stateidError: null,
        secure: true,
        google: false,
        pressed: false
    }
    componentDidMount = async () => {
        this.setState({ devide_id: getUniqueId() })
        GoogleSignin.configure({
            androidClientId: APIKey,
            forceCodeForRefreshToken: true,
        });
    }

    google = async () => {
        this.setState({ status: true })
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (typeof userInfo.user != "undefined") {
                this.setState({
                    name: userInfo.user.givenName,
                    email: userInfo.user.email,
                    lastname: userInfo.user.familyName,
                    google: true,
                })
                await GoogleSignin.revokeAccess()
            } else {
                alert('Something went wrong');
            }


        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log(statusCodes.SIGN_IN_CANCELLED);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log(statusCodes.IN_PROGRESS);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
            } else {
                console.log(error)
            }
        }
        finally {
            this.setState({ status: false })
        }
    }

    render() {
        const { navigation } = this.props
        const {
            name, email, password, mobile, lastname, cityid, stateid, devide_id, status,
            nameError, emailError, passwordError, mobileError, lastnameError, cityidError, stateidError,
            secure, google,
        } = this.state
        const _registerHandler = () => {
            this.setState({
                status: true, emailError: null,
                passwordError: null,
                nameError: null,
                mobileError: null,
            })
            fetch('http://home.gyaano.in/api/registerr', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    mobile,
                    lastname,
                    cityid,
                    stateid,
                    device_id: devide_id,
                    c_password: password,
                    is_social: google ? 1 : 0
                }),
            }).then((response) => response.json())
                .then(async (responseJson) => {
                    this.setState({
                        status: false,
                    });
                    if (responseJson.success) {
                        Alert.alert(
                            'Success',
                            'Thankyou , you have successfully registered.',
                            [
                                { text: 'Yay!', onPress: () => this.props.navigation.goBack() },
                            ],
                            { cancelable: false },
                        );
                    } else if (responseJson.error) {
                        const {
                            name, email, password, mobile, lastname, cityid, stateid
                        } = responseJson.error
                        if (typeof responseJson.error == "string") {
                            alert(responseJson.error)
                        }
                        if (email != "undefined") {
                            this.setState({
                                emailError: email,
                            })
                        }
                        if (name != "undefined") {
                            this.setState({
                                nameError: name,
                            })
                        }
                        if (lastname != "undefined") {
                            this.setState({
                                lastnameError: lastname,
                            })
                        }
                        if (password != "undefined") {
                            this.setState({
                                passwordError: password,
                            })
                        }
                        if (mobile != "undefined") {
                            this.setState({
                                mobileError: mobile,
                            })
                        }
                        if (cityid != "undefined") {
                            this.setState({
                                cityidError: cityid,
                            })
                        }
                        if (stateid != "undefined") {
                            this.setState({
                                stateidError: stateid,
                            })
                        }

                    } else {
                        Alert.alert('Error', 'Something went wrong please try again later or contact admin.')
                        console.log(responseJson);
                    }
                })
                .catch((error) => {
                    this.setState({
                        status: false,
                    });
                    alert(error);console.log(error);
                });
        }
        const ErrorRender = ({ error }) => {
            return (
                <Text style={{ marginTop: 5, color: 'red', fontWeight: '700' }}>{`*${error}`}</Text>
            )
        }
        const showPassword = (secure) => {
            this.setState({ secure })
        }
        return (
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <Container>
                    <View style={{ marginTop: '5%', flexDirection: "row", justifyContent: 'space-between' }}>
                        <Button transparent onPress={() => navigation.goBack()}>
                            <Icon name='arrow-back' style={{ color: '#000' }} />
                        </Button>

                    </View>
                    <View style={{ alignItems: 'center', borderBottomWidth: 1, borderColor: '#0001' }} padder>
                        <Button
                            bordered rounded block dark transparent
                            onPress={() => this.google()}
                            onPressIn={() => this.setState({ pressed: true })}
                            onPressOut={() => this.setState({ pressed: false })}
                            style={[this.state.pressed ? [styles.button, { transform: [{ translateY: 5 }] }] : styles.button]}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={[this.state.pressed ? { color: '#fff' } : { color: '#fff' }, { paddingHorizontal: '1%', textTransform: 'uppercase', fontFamily: 'Montserrat-SemiBold', }]}>Fill with google</Text>
                                <Icon style={[this.state.pressed ? { color: '#fff' } : { color: '#fff' }, { paddingHorizontal: '1%' }]} name="google" type="FontAwesome5" />
                            </View>
                        </Button>
                    </View>
                    <Content style={{ paddingHorizontal: '5%', backgroundColor: '#fff' }}>
                        <View style={{ marginTop: '5%' }}>

                            <View style={{ margin: '3%', flexDirection: 'row' }}>
                                <View style={{ width: '50%', paddingRight: 5 }}>
                                    <Item success>
                                        <Input
                                            placeholder='First Name'
                                            onChangeText={(name) => this.setState({ name })}
                                            value={name}
                                        />
                                        {
                                            name.length ?
                                                <Icon style={{ color: '#ef6c00' }} name='checkmark-circle' /> : null
                                        }
                                    </Item>
                                    {
                                        nameError ?
                                            <ErrorRender error={nameError} /> : null
                                    }
                                </View>
                                <View style={{ width: '50%', paddingLeft: 5 }}>
                                    <Item success>
                                        <Input
                                            placeholder='Last Name'
                                            onChangeText={(lastname) => this.setState({ lastname })}
                                            value={lastname}
                                        />
                                        {
                                            lastname.length ?
                                                <Icon style={{ color: '#ef6c00' }} name='checkmark-circle' /> : null
                                        }
                                    </Item>
                                    {
                                        lastnameError ?
                                            <ErrorRender error={lastnameError} /> : null
                                    }
                                </View>
                            </View>
                            <View style={{ margin: '3%', }}>
                                <Item success>
                                    <Input
                                        placeholder='Email address'
                                        onChangeText={(email) => this.setState({ email })}
                                        value={email}
                                        autoCapitalize="none"
                                        disabled={google}
                                    />
                                    {
                                        email.length ?
                                            <Icon style={{ color: '#ef6c00' }} name='checkmark-circle' /> : null
                                    }
                                </Item>
                                {
                                    emailError ?
                                        <ErrorRender error={emailError} /> : null
                                }
                            </View>

                            <View style={{ margin: '3%', }}>
                                <Item success>
                                    <Input
                                        placeholder='Mobile number'
                                        onChangeText={(mobile) => this.setState({ mobile })}
                                        value={mobile}
                                        keyboardType="number-pad"
                                        maxLength={10}
                                    />
                                    {
                                        mobile.length ?
                                            <Icon style={{ color: '#ef6c00' }} name='checkmark-circle' /> : null
                                    }
                                </Item>
                                {
                                    mobileError ?
                                        <ErrorRender error={mobileError} /> : null
                                }
                            </View>

                            <View style={{ margin: '3%', }}>
                                <Item success>
                                    <Input
                                        placeholder='Choose password'
                                        onChangeText={(password) => this.setState({ password })}
                                        value={password}
                                        secureTextEntry={secure}
                                        autoCapitalize="none"
                                    />
                                    {
                                        password.length ?
                                            <Icon style={{ color: '#ef6c00' }} name='checkmark-circle' /> : null
                                    }
                                    <TouchableOpacity onPress={() => showPassword(!secure)}>
                                        <Icon name={secure ? 'eye' : 'eye-off'} style={{ color: '#ef6c00', fontSize: 30 }} />
                                    </TouchableOpacity>
                                </Item>
                                {
                                    passwordError ?
                                        <ErrorRender error={passwordError} /> : null
                                }
                            </View>

                            <View style={{ margin: '3%', }}>
                                <Item success>
                                    <Input
                                        placeholder='Your City'
                                        onChangeText={(cityid) => this.setState({ cityid })}
                                        value={cityid}
                                    />
                                    {
                                        cityid.length ?
                                            <Icon style={{ color: '#ef6c00' }} name='checkmark-circle' /> : null
                                    }
                                </Item>
                                {
                                    cityidError ?
                                        <ErrorRender error={cityidError} /> : null
                                }
                            </View>

                            <View style={{ margin: '3%', }}>
                                <Item success>
                                    <Input
                                        placeholder='Your State'
                                        onChangeText={(stateid) => this.setState({ stateid })}
                                        value={stateid}
                                    />
                                    {
                                        stateid.length ?
                                            <Icon style={{ color: '#ef6c00' }} name='checkmark-circle' /> : null
                                    }
                                </Item>
                                {
                                    stateidError ?
                                        <ErrorRender error={stateidError} /> : null
                                }
                            </View>

                            <View style={{ margin: '3%' }}>
                                <Button block bordered transparent dark onPress={() => _registerHandler()} disabled={status ? true : false}>
                                    <Text>register</Text>
                                </Button>
                            </View>

                            <View style={{ margin: '3%', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
                                <Text>Already registered? </Text>
                                <Button
                                    disabled={status ? true : false}
                                    transparent
                                    style={{ marginLeft: -10 }}
                                    onPress={() => navigation.push('Login')}
                                >
                                    <Text style={{ color: 'blue', }}>login</Text>
                                </Button>
                            </View>
                        </View>
                    </Content>
                    <ActivityIndicator size="large" style={status ? { position: 'absolute', top: '50%', left: '45%', zIndex: 101 } : { display: "none" }} />
                </Container>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    footerTitle: {
        fontWeight: '500',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 10
    },
    button: {
        borderColor: "#ef6c00",
        backgroundColor: "#ef6c00",
        borderWidth: 1,
        borderRadius: 10,
        color: '#fff',
    }
})