import React, { Component } from 'react'
import { Container, Content, Text } from 'native-base'
import { StyleSheet, BackHandler } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

export default class TNC extends Component {
    state = {
        tnc: '',
        isLoadding: false,
    }

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.setState({ isLoadding: true })
        const token = await AsyncStorage.getItem('token');
        fetch('http://home.gyaano.in/api/termcondition', {
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        }).then(response => response.json()).then(async (responseJson) => {
            if (responseJson.success) {
                this.setState({
                    tnc: responseJson.message
                })
            }
        })
            .catch((e) => console.log(e)).finally(() => this.setState({ isLoadding: false }))
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        this.props.navigation.goBack()
    };

    render() {
        const { tnc } = this.state
        return (
            <Container>
                <Content>
                    <Text>{tnc}</Text>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({})
