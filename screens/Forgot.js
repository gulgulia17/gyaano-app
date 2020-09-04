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
    }
    _forogotHandler = (email) => {

        !email ? alert('Please enter your email address.')
            : this.forgot(email)
    }

    forgot = (email) => {
        this.setState({ isLoadding: true })
        let formdata = new FormData()
        formdata.append("email", email)
        fetch('http://home.gyaano.in/api/forgot/password', {
            method: 'POST',
            body: formdata
        })
            .then(response => response.json())
            .then(async (responseJson) => {
                if (responseJson.succes) {
                    this.setState({ email: '' })
                    alert('Please use the link send to your email to reset password.')
                } else {
                    if (typeof responseJson.message == "object") {
                        Alert.alert('Invalid Email', `${responseJson.message.email}`)
                    } else {
                        Alert.alert('Error', `${responseJson.message}`)
                    }
                }
            })
            .catch(e => console.log(e)).finally(() => this.setState({ isLoadding: false }))
    }
    render() {
        const { isLoadding, email } = this.state
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
                                    onChangeText={(email) => this.setState({ email })}
                                    value={email}
                                    autoCapitalize="none"
                                    placeholder='Please enter your email.'
                                />
                                <SucessIcon field={email} />
                            </Item>
                        </View>
                        <View style={{ margin: '3%' }}>
                            <Button
                                block bordered
                                transparent
                                dark
                                onPress={() => this._forogotHandler(email)}
                                disabled={isLoadding ? true : false}>
                                <Text>submit</Text>
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
    }
})
