import React, { Component } from 'react'
import {
    ScrollView,
    RefreshControl,
    StyleSheet,
    View,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import {
    Container, Content, Card, CardItem, Body, Spinner, Text, Title
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';

const Montserrat = require('../assets/fonts/./Montserrat-Medium.ttf')

export default class CourseList extends Component {
    state = {
        refreshing: false,
        status: false,
        subscribed: true,
        coursesCat: [],
        disclaimer: '',
    }
    componentDidMount = async () => {
        this.setState({
            status: true,
        });
        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        const { id, title } = this.props.route.params
        this.props.navigation.setOptions({ title })
        let formdata = new FormData();
        formdata.append("courseid", id)
        this.checkCourse(token, id, userID)
        fetch('http://home.gyaano.in/api/getcoursesub', {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formdata
        }).then((response) => response.json())
            .then(async (responseJson) => {
                this.setState({
                    status: false,
                });
                if (typeof responseJson.inst != "undefined") {
                    this.setState({ disclaimer: responseJson.inst })
                }
                if (typeof responseJson.courses != "undefined") {
                    this.setState({
                        coursesCat: responseJson.courses,
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

    checkCourse = async (token, id, student_id) => {
        let formdata = new FormData();
        formdata.append("course_id", id)
        formdata.append("student_id", student_id)

        fetch(`http://home.gyaano.in/api/checkcourse`, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formdata,
        }).then((response) => response.json())
            .then(async (responseJson) => {
                if (responseJson.success) {
                    this.setState({
                        subscribed: true,
                    })
                } else {
                    this.setState({
                        subscribed: false,
                    })
                }
            })
            .catch((e) => { console.log(e) })
    }

    render() {
        const { status, disclaimer, coursesCat, subscribed, } = this.state
        const { navigation } = this.props
        const { id, price } = this.props.route.params
        const { footer, footerTabs, footerTabsTitle, disclaimerNotice } = styles

        const RenderCard = ({ title, id, subscribed }) => {
            return (
                <TouchableOpacity
                    onPress={() => navigation.navigate('CourseTopic',
                        { screen: 'Videos', params: { title, subscribed, courseid: this.props.route.params.id, subjectid: id } })
                    }>
                    <Card style={{ width: Dimensions.get('window').width / 2.1, paddingVertical: '5%', justifyContent: 'center' }}>
                        <CardItem>
                            <Body style={{ alignItems: 'center' }}>
                                <Text style={[styles.Montserrat, { fontSize: 16 }]}>{title}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                </TouchableOpacity >
            );
        }
        return (
            <Container>
                <ScrollView refreshControl={<RefreshControl refreshing={status} onRefresh={this.componentDidMount} />}>
                    <Content>
                        {
                            disclaimer ?
                                <Body>
                                    <Text style={disclaimerNotice}>{disclaimer}</Text>
                                </Body> : null
                        }
                        <View style={{ flex: 1, paddingHorizontal: 6 }}>
                            <FlatList
                                data={coursesCat}
                                renderItem={
                                    ({ item }) =>
                                        <RenderCard
                                            imagePath={item.imagePath}
                                            title={item.name}
                                            price={item.price}
                                            subs={item.subs}
                                            id={item.id}
                                            subscribed={subscribed}
                                        />
                                }
                                keyExtractor={(item, index) => 'key' + index}
                                numColumns={2}
                            />
                        </View>
                    </Content>
                </ScrollView>
                {

                    !subscribed ?
                        <View style={footer}>
                            <View style={[footerTabs, { backgroundColor: '#fff' }]}>
                                <Text style={footerTabsTitle}>{price ? `₹${price}` : 'Free'}</Text>
                            </View>
                            <View style={[footerTabs, { backgroundColor: 'orange' }]}>
                                <TouchableOpacity onPress={() =>
                                    navigation.dispatch(StackActions.replace('Subscription',
                                        { courseId: id }))
                                }>
                                    <Text style={[{ fontFamily: 'Montserrat-SemiBold', }, footerTabsTitle]}>{price ? 'BUY NOW' : 'Subscribe'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View> :
                        null
                }

                {
                    status ?
                        <Spinner color='blue' style={{ position: 'absolute', top: '50%', left: '45%', zIndex: 101 }} />
                        : null
                }
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disclaimerNotice: {
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontSize: 12,
        marginTop: '3%',
        marginBottom: '1%',
        fontFamily: 'Montserrat-SemiBold',
    },
    header: {
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#0005',
    },
    footer: {
        flexDirection: 'row',
        borderTopColor: '#0003',
        borderTopWidth: 1,
    },
    footerTabs: {
        width: '50%',
        padding: '3%',
    },
    footerTabsTitle: {
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    Montserrat: {
        fontFamily: 'Montserrat-Medium',
    }
})