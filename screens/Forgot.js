import React, { Component } from 'react'
import { StyleSheet, View, Image, ActivityIndicator, Alert } from 'react-native'
import { Container, Button, Icon, Content, Text, Item, Input } from 'native-base'
const SucessIcon = ({ field }) => {
    return (
        <View>
            {
                field.length ?
                    <Icon name='checkmark-circle' style={{ color: 'green' }} />
                    : null
            }
        </View>
    )
}


export default class Forgot extends Component {
    state = {
        isLoadding: false,
        email: '',
        otp: '',
        otpField: false
    }
    _forogotHandler = (email) => {

        !email ? alert('Please enter your email address.')
            : this.forgot(email)
    }

    _resetPassword = async (email, otp) => {
        const formData = new FormData();
        formData.append('email', email)
        formData.append('otp', otp)
        this.setState({ isLoadding: true })
        const response = await fetch('http://home.gyaano.in/api/reset/password', {
            method: 'POST',
            body: formData
        });
        const responseJson = await response.json()
        if (!responseJson.success) {
            if (typeof responseJson.errors == "object") {
                Alert.alert('Invalid OTP', `${responseJson.errors.otp[0]}`)
            }
            Alert.alert('Error', responseJson.message)
            this.setState({ isLoadding: false })
            return;
        }
        this.props.navigation.navigate('ForgetPassword', { email })
        this.setState({ isLoadding: false })
    }

    forgot = async (email) => {
        const formData = new FormData();
        formData.append('email', email)
        this.setState({ isLoadding: true })
        const response = await fetch('http://home.gyaano.in/api/forgot/password', {
            method: 'POST',
            body: formData
        });
        const responseJson = await response.json()
        if (responseJson.success) {
            Alert.alert('OTP Sent', responseJson.message)
            this.setState({
                otpField: true
            })
        } else {
            if (typeof responseJson.errors == "object") {
                Alert.alert('Invalid Email', `${responseJson.errors.email[0]}`)
            } else {
                Alert.alert('Error', `${responseJson.message}`)
            }
        }
        this.setState({ isLoadding: false })
    }
    render() {
        const { isLoadding, email, otp, otpField } = this.state
        const { navigation } = this.props
        const { logoContainer, bgWhite, center } = styles
        return (
            <Container>
                <View style={{ marginTop: '5%' }}>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back' style={{ color: '#000' }} />
                    </Button>
                </View>
                <Content style={bgWhite} padder>
                    <View style={logoContainer}>
                        <Image source={require('./../assets/logo.png')} style={{ height: 150, width: 150 }} />
                    </View>
                    <View style={{ marginTop: '15%' }}>
                        <View style={{ margin: '3%' }}>
                            <Text>Email address</Text>
                            <Item>
                                <Icon type="FontAwesome5" name='envelope' style={{ color: '#0008' }} />
                                <Input
                                    editable={!otpField}
                                    onChangeText={(email) => this.setState({ email })}
                                    value={email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder='Please enter your email.'
                                />
                                <SucessIcon field={email} />
                            </Item>
                        </View>
                        <View style={[!otpField ? { display: 'none' } : null, { margin: '3%' }]}>
                            <Text>OTP</Text>
                            <Item>
                                <Icon type="FontAwesome5" name='key' style={{ color: '#0008' }} />
                                <Input
                                    onChangeText={(otp) => this.setState({ otp })}
                                    value={otp}
                                    maxLength={6}
                                    keyboardType="number-pad"
                                    placeholder='Please enter your otp.'
                                />
                                <SucessIcon field={otp} />
                            </Item>
                        </View>
                        <View style={{ margin: '3%' }}>
                            <Button
                                block bordered
                                transparent
                                dark
                                onPress={() => otpField ? this._resetPassword(email, otp) : this._forogotHandler(email)}
                                disabled={isLoadding ? true : false}>
                                <Text style={styles.title}>submit</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
                {
                    isLoadding ? <ActivityIndicator size="large" style={center} /> : null
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        borderBottomColor: '#0001',
        borderBottomWidth: 1,
        paddingVertical: 5,
    },
    bgWhite: {
        backgroundColor: '#fff',
    },
    center: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%',
        position: 'absolute',
    },
    title: {
        fontFamily: 'Montserrat-Regular',
    },
})
