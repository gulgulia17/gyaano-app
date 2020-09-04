import React, { Component } from 'react'
import { Text, StyleSheet, ActivityIndicator, Dimensions, FlatList, BackHandler } from 'react-native'
import { Container, Content, List, ListItem, Card } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'

const NotificationRender = ({ data: { notificationtitle, notificationdesscript } }) => {
    return (
        <Card>
            <List>
                <ListItem style={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <Text style={{
                        marginBottom: '2%',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: 2
                    }}>{notificationtitle}</Text>
                    <Text>{notificationdesscript}</Text>
                </ListItem>
            </List>
        </Card>
    )
}

export default class Notifications extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoadding: false,
            notificationData: [],
        }
    }

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        const token = await AsyncStorage.getItem('token');
        this.setState((state) => ({
            isLoadding: !state.isLoadding,
        }))
        fetch('http://home.gyaano.in/api/getnotification', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                if (typeof responseJson.success == "string") {
                    this.setState((state) => ({
                        isLoadding: !state.isLoadding,
                    }))
                    alert(responseJson.success)
                } else {
                    this.setState((state) => ({
                        isLoadding: !state.isLoadding,
                        notificationData: responseJson.data.notification,
                    }))
                }

            })
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        this.props.navigation.goBack()
    };

    render() {
        const { isLoadding, notificationData } = this.state
        const {
            loadder,
            hide,
        } = styles
        return (
            <Container>
                <Content padder>
                    <FlatList
                        data={notificationData}
                        renderItem={
                            ({ item }) => <NotificationRender data={item} />}
                    />
                </Content>
                <ActivityIndicator
                    size="large"
                    style={isLoadding ? loadder : hide}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    loadder: {
        position: 'absolute',
        top: Dimensions.get('window').height / 2,
        left: Dimensions.get('window').width / 2,
    },
    hide: {
        display: 'none'
    },
})
