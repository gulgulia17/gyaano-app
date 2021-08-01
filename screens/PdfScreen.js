import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, Alert, FlatList, ActivityIndicator, Linking } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { Card, Icon } from 'native-base';

const PDFRender = ({ url, title, subscribed, navigation }) => {
    return (
        <View>
            <TouchableOpacity onPress={() =>
                subscribed == "true" ?
                    navigation.navigate('Docviwer', { url: `http://home.gyaano.in/images/pdffile/${url}` })
                    : Alert.alert('No Subscription', 'You dont have a subscription please get one.')}>
                <Card style={styles.pdfContainer}>
                    <View style={styles.pdf}>
                        <Text
                            style={styles.pdfTitle}
                            numberOfLines={1}
                        >{title}</Text>
                        <View style={{ marginLeft: '-10%' }}>
                            <Icon type="FontAwesome5" name="file-pdf" />
                        </View>
                        <TouchableOpacity
                            disabled={subscribed == "true" ? false : true}
                            onPress={() => Linking.openURL(`http://home.gyaano.in/images/pdffile/${url}`)}>
                            <Icon type="FontAwesome5" name="arrow-down" style={{ fontSize: 25 }} />
                        </TouchableOpacity>
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    )
}
export default class PdfScreen extends Component {
    state = {
        refreshing: false,
        pdflink: [],
        subscribed: null
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('token')
        const courseid = await AsyncStorage.getItem('courseid')
        const subjectid = await AsyncStorage.getItem('subjectid')
        const subscribed = await AsyncStorage.getItem('subscribed')
        this.onRefresh(token, courseid, subjectid, subscribed, true)
    }

    onRefresh = (token, courseid, subjectid, subscribed) => {
        this.setState({ refreshing: true, subscribed })
        let formdata = new FormData();
        formdata.append("courseid", courseid)
        formdata.append("subjectid", subjectid)
        fetch(`http://home.gyaano.in/api/getcoursestopics`, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formdata,
        })
            .then(response => response.json())
            .then(async (responseJson) => {
                if (typeof responseJson.pdflink != "undefined") {
                    this.setState({ pdflink: responseJson.pdflink })
                }
            })
            .catch(e => console.log(e)).finally(() => this.setState({ refreshing: false }))
    }
    render() {
        const { refreshing, pdflink, subscribed } = this.state
        const { navigation } = this.props
        const { container, center, hide } = styles

        return (
            <SafeAreaView style={container}>
                {
                    typeof pdflink != "undefined" && pdflink.length ?
                        <FlatList
                            data={pdflink}
                            renderItem={({ item }) =>
                                <PDFRender
                                    title={item.title}
                                    url={item.path}
                                    subscribed={subscribed}
                                    navigation={navigation}
                                />
                            }
                            refreshing={refreshing}
                            onRefresh={() => this.componentDidMount()}
                            keyExtractor={() => `${Math.floor(Math.random() * (10000))}`}
                        />
                        :
                        <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', marginTop: '5%' }}>No Books Available</Text>
                }
                <ActivityIndicator size="large" style={refreshing ? center : hide} />
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    pdfContainer: {
        paddingVertical: '5%',
    },
    pdf: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
    },
    pdfTitle: {
        textTransform: 'capitalize',
        fontSize: 18,
        width: '90%',
        fontFamily: 'Montserrat-SemiBold',
    },
    center: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%'
    },
    hide: {
        display: 'none'
    }
})
