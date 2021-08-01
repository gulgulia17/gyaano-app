import React, { Component } from 'react'
import { Text, StyleSheet, Dimensions, ActivityIndicator, BackHandler, TouchableOpacity, Image } from 'react-native'
import { Container, Content, Body, Card, CardItem } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { View } from 'react-native-animatable';

export default class MySubscription extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoadding: false,
            courses: [],
        }
    }
    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.setState({
            isLoadding: true,
            courses: [],
        })
        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        let formdata = new FormData();
        formdata.append("student_id", userID)
        fetch('http://home.gyaano.in/api/getsubscribedcourses', {
            method: "POST",
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formdata
        })
            .then(response => response.json())
            .then(async (responseJson) => {
                if (responseJson.status == 200) {
                    this.setState({
                        isLoadding: false,
                        courses: responseJson.data,
                    })
                }
            })
    }

    async componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        this.props.navigation.goBack()
    };

    RenderSubs = ({ banner_image, course_id, title }) => {
        return (
            <TouchableOpacity onPress={() =>
                this.props.navigation.navigate('CourseList', {
                    title, id: course_id, pyst: 'pay', price: 501
                })}>
                <Card style={{ width: Dimensions.get('window').width / 2.1 }}>
                    <CardItem cardBody>
                        <Image source={{ uri: `http://home.gyaano.in/images/banner_image/${banner_image}` }} style={{ height: 150, width: '100%', flex: 1, resizeMode: 'contain' }} />
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }} numberOfLines={1}>{title}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </TouchableOpacity >
        );
    }
    render() {
        const { isLoadding, courses } = this.state
        const {
            loadder,
            hide,
            title
        } = styles

        return (
            <Container>
                <Content padder>
                    {
                        courses.length ?
                            <FlatList
                                data={courses}
                                renderItem={
                                    ({ item }) =>
                                        <this.RenderSubs
                                            banner_image={item.banner_image}
                                            course_id={item.course_id}
                                            title={item.title}
                                        />
                                }
                                numColumns={2}
                            />
                            : <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', marginTop: '5%' }}>No subscription available</Text>
                    }
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
