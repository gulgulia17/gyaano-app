import React, { Component } from 'react'
import { Container, Content, View, Item, Input, Icon, Text, Button } from 'native-base'
import { StyleSheet, ActivityIndicator, Alert, ToastAndroid, BackHandler } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

const ErrorRender = ({ error }) => {
    return (
        <Text style={[styles.title, styles.error]}>*{error}</Text>
    )
}

export default class ResetPassword extends Component {
    state = {
        isLoadding: false,
        currentpassword: '',
        currentPasswordError: '',
        newpassword: '',
        newPasswordError: '',
        confirmnewpassword: '',
        confirmNewPasswordError: '',
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        this.props.navigation.goBack()
    };

    ResetPasswordHandler = async (currentpassword, newpassword, confirmnewpassword) => {
        if (currentpassword && newpassword && confirmnewpassword) {
            if (newpassword === confirmnewpassword) {
                const token = await AsyncStorage.getItem('token');
                const id = await AsyncStorage.getItem('userID');
                let formdata = new FormData();
                formdata.append("student_id", id)
                formdata.append("currentpassword", currentpassword)
                formdata.append("newpassword", newpassword)
                this.setState((state) => ({
                    isLoadding: !state.isLoadding,
                }))
                fetch('http://home.gyaano.in/api/change/password', {
                    method: 'POST',
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formdata,
                })
                    .then(response => response.json())
                    .then(async (responseJson) => {
                        ToastAndroid.show(`${responseJson.message}`, ToastAndroid.SHORT);
                        if (responseJson.success) {
                            this.props.navigation.goBack()
                        }
                    })
                    .catch(error => console.log(error))
                    .finally(() =>
                        this.setState((state) => ({
                            isLoadding: !state.isLoadding,
                        }))
                    )
            } else {
                Alert.alert('Password mismatch', 'confirm password doesn\'t match');
            }
        } else {
            Alert.alert('All fields required', 'Please fill all fields to continue.');
        }
    }

    render() {
        const {
            isLoadding,
            currentpassword,
            currentPasswordError,
            newpassword,
            newPasswordError,
            confirmnewpassword,
            confirmNewPasswordError
        } = this.state
        const {
            title,
            center
        } = styles
        return (
            <Container>
                <Content style={{ paddingHorizontal: '5%', backgroundColor: '#fff' }}>
                    <View style={{ marginTop: '5%' }}>
                        <View style={{ paddingRight: 5, marginBottom: '10%' }}>
                            <Text style={title}>Current Password</Text>
                            <Item success>
                                <Input
                                    placeholder='Current Password'
                                    onChangeText={(currentpassword) => this.setState({ currentpassword })}
                                    value={currentpassword}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                />
                                {
                                    currentpassword.length ?
                                        <Icon name='checkmark-circle' /> : null
                                }
                            </Item>
                            {
                                currentPasswordError ?
                                    <ErrorRender error={currentPasswordError} /> : null
                            }
                        </View>
                        <View style={{ paddingRight: 5, marginBottom: '10%' }}>
                            <Text style={title}>New Password</Text>
                            <Item success>
                                <Input
                                    placeholder='New Password'
                                    onChangeText={(newpassword) => this.setState({ newpassword })}
                                    value={newpassword}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                />
                                {
                                    newpassword.length ?
                                        <Icon name='checkmark-circle' /> : null
                                }
                            </Item>
                            {
                                newPasswordError ?
                                    <ErrorRender error={newPasswordError} /> : null
                            }
                        </View>
                        <View style={{ paddingRight: 5, marginBottom: '10%' }}>
                            <Text style={title}>Confirm New Password</Text>
                            <Item success>
                                <Input
                                    placeholder='Confirm New Password'
                                    onChangeText={(confirmnewpassword) => this.setState({ confirmnewpassword })}
                                    value={confirmnewpassword}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                />
                                {
                                    newpassword === confirmnewpassword && confirmnewpassword.length ?
                                        <Icon name='checkmark-circle' /> : null
                                }
                            </Item>
                            {
                                confirmNewPasswordError ?
                                    <ErrorRender error={confirmNewPasswordError} /> : null
                            }
                        </View>
                        <View style={{ paddingRight: 5, marginBottom: '10%' }}>
                            <Button
                                block
                                transparent
                                dark
                                bordered
                                disabled={isLoadding ? true : false}
                                onPress={() => this.ResetPasswordHandler(currentpassword, newpassword, confirmnewpassword)}
                            >
                                <Text>Submit</Text>
                            </Button>
                        </View>
                    </View>
                    {isLoadding ?
                        <ActivityIndicator size="large" style={center} /> : null}
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        fontSize: 14,
    },
    error: {
        color: 'red',
    },
    center: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%'
    }
})