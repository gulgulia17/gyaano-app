import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    FlatList,
    ActivityIndicator
} from 'react-native'
import {
    Container,
    Content,
    Card,
    CardItem,
    Body,
    Button,
    Icon,
} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

export default class Docs extends Component {
    state = {
        isLoadding: false,
        CardData: [],
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('token');
        this.getPdfData(token)
    }

    getPdfData = async (token) => {
        this.setState({ isLoadding: true })
        fetch('http://home.gyaano.in/api/getpdf', {
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => response.json())
            .then(async (responseJson) => {
                if (typeof responseJson.courses == 'object') {
                    console.log(responseJson.courses)
                    this.setState({ CardData: responseJson.courses })
                }
            }).catch((e) => console.log(e)).finally(() => this.setState({ isLoadding: false }))
    }

    render() {

        const { navigation } = this.props
        const { isLoadding, CardData } = this.state
        const { center, hide } = styles
        const RenderCard = ({ item, id, imagePath, title }) => {
            return (
                <TouchableOpacity onPress={() => navigation.navigate('EBook', { pdfid: item.id })}>
                    <Card style={{ width: Dimensions.get('window').width / 2.15, marginRight: '3%' }}>
                        <CardItem cardBody>
                            <Image source={{ uri: `http://home.gyaano.in/images/banner_image/${imagePath}` }} style={{ height: 150, width: null, flex: 1, resizeMode: 'center' }} />
                        </CardItem>
                        <CardItem style={{ borderTopColor: '#000', borderTopWidth: 0.5 }}>
                            <Body>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16 }}>{title}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            );
        }
        return (
            <Container>
                <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
                    <View style={styles.boxWithShadow}>
                        <View style={{ marginTop: '5%', flexDirection: 'row', alignItems: 'baseline' }}>
                            <Button transparent onPress={() => navigation.openDrawer()} >
                                <Icon name='menu' style={{ color: '#000' }} />
                            </Button>
                            <Text style={[styles.title, { marginTop: '2.8%' }]}>Docs</Text>
                        </View>
                    </View>
                </View>
                <Content>
                    <SafeAreaView style={{ flex: 1, paddingHorizontal: 6 }}>
                        {
                            CardData.length ?
                                <FlatList
                                    data={CardData}
                                    renderItem={
                                        ({ item }) =>
                                            <RenderCard
                                                item={item}
                                                id={item.id}
                                                imagePath={item.banner_image}
                                                title={item.title}
                                            />
                                    }
                                    numColumns={2}
                                    keyExtractor={(item, index) => 'key' + index}
                                    refreshing={isLoadding}
                                    onRefresh={this.componentDidMount}
                                /> : <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', marginTop: '5%' }}>No Books Available</Text>
                        }
                    </SafeAreaView>
                </Content>
                <ActivityIndicator size="large" style={isLoadding ? center : hide} />
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Montserrat-SemiBold',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#0005',
    },
    boxWithShadow: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
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
