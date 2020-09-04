import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { Container, Content, Card, Spinner, Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';

const ListRender = ({ url, title, navigation, subs, subscribed }) => {
    return (
        <TouchableOpacity
            onPress={() =>
                subs == "no" ?
                    (!subscribed ?
                        Alert.alert('No Subscription', 'You dont have a subscription please get one.') :
                        navigation.navigate('CoursePlayer', { url: url }))
                    : navigation.navigate('CoursePlayer', { url: url })}>
            <Card style={styles.pdfContainer}>
                <View style={styles.pdf}>
                    <Text
                        style={styles.pdfTitle}
                        numberOfLines={1}
                    >{title}</Text>
                    {
                        subs == "no" ? null :
                            <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Icon type="FontAwesome5" name="file-video" />
                            </View>

                    }

                </View>
            </Card>
        </TouchableOpacity>
    )
}

export default class CourseTopic extends Component {
    state = {
        status: false,
        courseList: [],
        pdflink: '',
    }
    componentDidMount = async () => {
        this.setState({
            status: true,
        });
        const { title, courseid, subjectid, subscribed } = this.props.route.params
        await AsyncStorage.setItem('courseid', `${courseid}`);
        await AsyncStorage.setItem('subjectid', `${subjectid}`);
        await AsyncStorage.setItem('subscribed', `${subscribed}`);
        this.props.navigation.setOptions({ title })
        const token = await AsyncStorage.getItem('token');
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
        }).then((response) => response.json())
            .then(async (responseJson) => {
                this.setState({
                    status: false,
                });
                if (typeof responseJson.data != "undefined") {
                    this.setState({
                        courseList: responseJson.data,
                    })
                } else if (typeof responseJson.error != "undefined") {
                    console.log(responseJson.error)
                } else {
                    console.log(responseJson)
                }
            })
            .catch((error) => {
                this.setState({
                    status: false,
                });
                alert(error);
            });

    }

    render() {

        const { status, courseList } = this.state
        const { navigation } = this.props
        const { subscribed } = this.props.route.params
        const { center, hide } = styles
        return (

            <Container>
                <Content padder>
                    <SafeAreaView>
                        {
                            courseList.length ?
                                <FlatList
                                    data={courseList}
                                    renderItem={
                                        ({ item }) =>
                                            <ListRender
                                                url={item.link}
                                                title={item.topic}
                                                navigation={navigation}
                                                subs={item.is_demo}
                                                subscribed={subscribed}
                                                id={item.topicid}
                                            />
                                    }
                                    keyExtractor={(item, index) => 'key' + index}
                                    refreshing={status}
                                    onRefresh={this.componentDidMount}
                                /> : <Text style={{ textAlign: 'center', fontSize: 16, marginTop: '50%' }}>No data available</Text>
                        }
                    </SafeAreaView>
                </Content>
                <ActivityIndicator size="large" style={status ? center : hide} />
            </Container >
        )
    }
}

const styles = StyleSheet.create({
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
        width: '60%',
        fontFamily: 'Montserrat-SemiBold',
    },
    divider: {
        borderColor: '#0003',
        width: '30%',
        borderWidth: 1,
        alignSelf: 'center',
        marginVertical: '5%'
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
