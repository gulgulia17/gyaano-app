import React, { Component } from 'react'
import { ScrollView, RefreshControl, StyleSheet, TouchableOpacity, Text, Dimensions, View, FlatList, Alert } from 'react-native';
import { Body, Card, CardItem, Container, Content } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
export default class EBook extends Component {
    state = {
        isLoadding: true,
        ebooks: [],
        subscribed: true,
        price: '',
        pdfid: ''
    }
    async componentDidMount() {
        const props = this.props.route.params;
        this.setState({ isLoadding: true, pdfid: props.pdfid })
        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        this.checkEbook(token, props.pdfid, userID)
        let formData = new FormData();
        formData.append('pdfid', props.pdfid)
        const response = await fetch('http://home.gyaano.in/api/getebooks', {
            method: 'post',
            body: formData,
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        const responseJson = await response.json()
        if (typeof responseJson.ebooks == 'object') {
            this.setState({ ebooks: responseJson.ebooks, price: responseJson.price })
        }
        this.setState({ isLoadding: false })
    }

    checkEbook = async (token, id, student_id) => {
        let formdata = new FormData();
        formdata.append("pdfid", id)
        formdata.append("student_id", student_id)

        const response = await fetch(`http://home.gyaano.in/api/getsubscribedpdf`, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formdata,
        });
        const responseJson = await response.json()
        if (responseJson.success) {
            this.setState({
                subscribed: true,
            })
        } else {
            this.setState({
                subscribed: false,
            })
        }
    }

    render() {
        const { isLoadding, ebooks, subscribed, price, pdfid } = this.state
        const { navigation } = this.props
        const RenderCard = ({ pdfname, title }) => {
            return (
                <TouchableOpacity
                    onPress={() =>
                        subscribed ?
                            navigation.navigate('Docviwer', { url: `http://home.gyaano.in/e-books/${pdfname}` })
                            : Alert.alert('No Subscription', 'You dont have a subscription please get one.')}
                >
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
                <ScrollView refreshControl={<RefreshControl refreshing={isLoadding} onRefresh={this.componentDidMount} />}>
                    <Content>
                        <View style={{ flex: 1, paddingHorizontal: 6 }}>
                            <FlatList
                                data={ebooks}
                                renderItem={
                                    ({ item }) =>
                                        <RenderCard
                                            pdfname={item.pdfname}
                                            title={item.title}
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
                        <View style={styles.footer}>
                            <View style={[styles.footerTabs, { backgroundColor: '#fff' }]}>
                                <Text style={styles.footerTabsTitle}>{price ? `₹${price}` : 'Free'}</Text>
                            </View>
                            <View style={[styles.footerTabs, { backgroundColor: 'orange' }]}>
                                <TouchableOpacity onPress={() =>
                                    navigation.dispatch(StackActions.replace('Subscription',
                                        { courseId: pdfid, pdf: true }))
                                }>
                                    <Text style={[{ fontFamily: 'Montserrat-SemiBold', }, styles.footerTabsTitle]}>{price ? 'BUY NOW' : 'Subscribe'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View> :
                        null
                }
            </Container>
        )
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