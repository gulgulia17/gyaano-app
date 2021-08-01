import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native'
import { Container, Content, Card, Body, Icon, CardItem } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';

const ListRender = ({ thumbnail, url, title, navigation, subs, subscribed, description, date }) => {
    return (
        <TouchableOpacity
            onPress={() =>
                subs == "no" ?
                    (!subscribed ?
                        Alert.alert('No Subscription', 'You dont have a subscription please get one.') :
                        navigation.navigate('CoursePlayer', { url: url }))
                    : navigation.navigate('CoursePlayer', { url: url })}>
            <Card style={styles.pdfContainer}>
                <CardItem header style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>{title}</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: subs == "no" ? '#90ee90' : '#6691e0', width: '30%', height: 30, borderRadius: 5000 }}>
                        <Text style={{ color: '#fff', textAlignVertical: 'center', textAlign: 'center', fontFamily: 'Montserrat-SemiBold' }}>{subs == "no" ? 'Paid' : 'Demo'}</Text>
                    </View>
                </CardItem>
                <CardItem>
                    <View style={[{ width: '100%', borderWidth: 0.8, borderColor: '#0004', borderRadius: 8 }, !thumbnail ? { justifyContent: 'center', alignItems: 'center' } : null]}>
                        {
                            thumbnail ? <Image source={{ uri: `http://home.gyaano.in/images/thumbnail/${thumbnail}` }} style={{ width: '100%', flex: 1, height: 150 }} /> :
                                <Text style={{ padding: '5%', fontFamily: 'Montserrat-Regular' }}>No Image</Text>
                        }
                    </View>
                </CardItem>
                <CardItem footer>
                    <Text style={{ fontFamily: 'Montserrat-SemiBold' }}>{date}</Text>
                </CardItem>
            </Card>
        </TouchableOpacity>
    )
}

export default class CourseTopic extends Component {
    state = {
        courseList: [],
        pdflink: '',
        isLoadding: true
    }
    componentDidMount = async () => {
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
                alert(error);
            }).finally(() => {
                this.setState({
                    isLoadding: false
                })
            });

    }

    render() {

        const { isLoadding, courseList } = this.state
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
                                                thumbnail={item.thumbnail}
                                                url={item.link}
                                                title={item.topic}
                                                navigation={navigation}
                                                subs={item.is_demo}
                                                subscribed={subscribed}
                                                id={item.topicid}
                                                description={item.description}
                                                date={item.date}
                                            />
                                    }
                                    keyExtractor={(item, index) => 'key' + index}
                                    refreshing={isLoadding}
                                    onRefresh={this.componentDidMount}
                                /> : <Text style={[!isLoadding ? { textAlign: 'center', fontSize: 16, marginTop: '50%' } : hide]}>No data available</Text>
                        }
                    </SafeAreaView>
                </Content>
                <ActivityIndicator size="large" style={isLoadding ? center : hide} color="black" />
            </Container >
        )
    }
}

const styles = StyleSheet.create({
    pdfContainer: {
        paddingVertical: '0%',
    },
    pdf: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        borderTopColor: '#0005',
        paddingTop: '4%',
        borderTopWidth: 1
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
