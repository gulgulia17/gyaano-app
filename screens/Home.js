import React, { Component } from 'react'
import {
    Text, View, StyleSheet, Dimensions, Image, SafeAreaView, FlatList, TouchableOpacity
} from 'react-native'
import {
    Container, Content, Card, CardItem, Body, Button, Icon, Spinner,
} from 'native-base';
import Carousel from 'react-native-snap-carousel';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';


export default class Home extends Component {
    state = {
        status: false,
        courses: [],
        banner: [],
    }
    componentDidMount = async () => {
        this.setState({
            status: true,
        });
        const token = await AsyncStorage.getItem('token');
        this.getBanner(token)
        let self = this
        try {
            Axios.get('http://home.gyaano.in/api/getcourses', {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
                .then(function (response) {
                    self.setState({
                        courses: response.data.courses,
                        status: false,
                    });
                })
        } catch (error) {
            console.log(error)
        }
    }


    getBanner = (token) => {
        try {
            fetch('http://home.gyaano.in/api/getbannerimage', {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            }).then(response => response.json())
                .then(async (responseJson) => {
                    console.log(responseJson)
                    this.setState({
                        banner: responseJson.success,
                    })
                });
        } catch (error) {
            console.log(error)
        }
    }


    render() {
        const { status, courses, banner } = this.state
        const { navigation } = this.props
        const { header, boxWithShadow } = styles

        const RenderItem = ({ imagePath }) => {
            return (
                <View style={styles.slide}>
                    <Image
                        style={{ height: 200, width: Dimensions.get('window').width, resizeMode: 'contain' }}
                        source={{ uri: `http://home.gyaano.in/mainbanner/${imagePath}` }} />
                </View>
            );
        }

        const RenderCard = ({ imagePath, id, title, price, pyst }) => {
            return (
                <TouchableOpacity onPress={() => {
                    navigation.navigate('CourseList', {
                        title, id, pyst, price
                    })
                }}>
                    <Card style={{ width: Dimensions.get('window').width / 2.1 }}>
                        <CardItem cardBody>
                            <Image source={{ uri: imagePath }} style={{ height: 150, width: '100%', flex: 1, resizeMode: 'contain' }} />
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text style={{ fontSize: 16, fontFamily: 'Montserrat-SemiBold', }} numberOfLines={1}>{title}</Text>
                                <Text note style={{ fontFamily: 'Montserrat-Medium', }}>
                                    {pyst == 'pay' ?
                                        `₹ ${price}` : 'Free'
                                    }</Text>
                            </Body>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            );
        }

        return (
            <Container>
                <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
                    <View style={boxWithShadow}>
                        <View style={{ marginTop: '5%', flexDirection: 'row', alignItems: 'baseline' }}>
                            <Button transparent onPress={() => navigation.openDrawer()} >
                                <Icon name='menu' style={{ color: '#000' }} />
                            </Button>
                            <Text style={[header]}>Courses</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={banner}
                        renderItem={({ item }) =>
                            <RenderItem imagePath={item.name} />}
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={Dimensions.get('window').width}
                    />
                    <View style={{ paddingVertical: '3%', alignItems: 'center' }}>
                        <Text style={[header, { textAlign: 'center' }]}>Courses</Text>
                    </View>
                </View>
                <Content >
                    <SafeAreaView style={{ flex: 1, paddingHorizontal: 6 }}>
                        <FlatList
                            data={courses}
                            renderItem={
                                ({ item }) =>
                                    <RenderCard
                                        id={item.id}
                                        imagePath={`http://home.gyaano.in/images/banner_image/${item.banner_image}`}
                                        title={item.title}
                                        price={item.price}
                                        pyst={item.payment_status}
                                    />
                            }
                            keyExtractor={(item, index) => 'key' + index}
                            numColumns={2}
                            refreshing={status}
                            onRefresh={this.componentDidMount}
                        />

                    </SafeAreaView>
                </Content>
                {
                    status ?
                        <Spinner color='blue' style={{ position: 'absolute', top: '50%', left: '45%', zIndex: 101 }} />
                        : null
                }
            </Container >
        )
    }
}
const styles = StyleSheet.create({
    header: {
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#0005',
        fontFamily: 'Montserrat-SemiBold',
        marginTop: '2.8%'
    },
    boxWithShadow: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
    }
})