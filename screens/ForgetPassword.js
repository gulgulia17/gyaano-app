import React, { Component } from 'react'
import { StyleSheet, View, Image, ActivityIndicator, Alert } from 'react-native'
import { Container, Button, Icon, Content, Text, Item, Input } from 'native-base'
import { getUniqueId } from 'react-native-device-info';

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


export default class ForgetPassword extends Component {
    state = {
        isLoadding: false,
        email: '',
        password: '',
        password_confirmation: '',
        device_id: '',
    }

    componentDidMount() {
        this.setState({
            email: this.props.route.params.email,
            device_id: getUniqueId()
        })
    }

    _resetPassword = async (email, password, password_confirmation) => {
        if (!password.length || !password_confirmation.length) {
            Alert.alert('Required', 'All fields are required')
            return;
        }

        if (password !== password_confirmation) {
            Alert.alert('Invalid Password', 'New password and Confirm Password must match.')
            return;
        }
        const formData = new FormData();
        formData.append('email', email)
        formData.append('password', password)
        formData.append('password_confirmation', password_confirmation)
        formData.append('device_id', this.state.device_id)

        // this.setState({ isLoadding: true })
        const response = await fetch('http://home.gyaano.in/api/update/password', {
            method: 'POST',
            body: formData
        });
        const responseJson = await response.json()
        console.log(responseJson);
        if (!responseJson.success) {
            Alert.alert('Error', responseJson.message)
            this.setState({ isLoadding: false })
            return;
        }
        this.props.navigation.navigate('Login')
        this.setState({ isLoadding: false })
    }

    render() {
        const { isLoadding, email, password, password_confirmation } = this.state
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
                            <Text>Password</Text>
                            <Item>
                                <Icon type="FontAwesome5" name='key' style={{ color: '#0008' }} />
                                <Input
                                    onChangeText={(password) => this.setState({ password })}
                                    value={password}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    placeholder='Please enter your new password.'
                                />
                                <SucessIcon field={password} />
                            </Item>
                        </View>

                        <View style={{ margin: '3%' }}>
                            <Text>Confirm Password</Text>
                            <Item>
                                <Icon type="FontAwesome5" name='key' style={{ color: '#0008' }} />
                                <Input
                                    onChangeText={(password_confirmation) => this.setState({ password_confirmation })}
                                    value={password_confirmation}
                                    autoCapitalize="none"
                                    placeholder='Please re-enter your new password.'
                                />
                                <SucessIcon field={password_confirmation} />
                            </Item>
                        </View>

                        <View style={{ margin: '3%' }}>
                            <Button
                                block bordered
                                transparent
                                dark
                                onPress={() => this._resetPassword(email, password, password_confirmation)}
                                disabled={isLoadding}>
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
