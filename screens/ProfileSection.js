import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    BackHandler
} from 'react-native'
import {
    Container,
    Content,
    Body,
    Button,
    Icon,
    Item,
    Input,
    Spinner,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
export default class ProfileSection extends Component {
    state = {
        editable: false,
        profiledata: [],
        isLoadding: false,
        cityid: '',
        id: '',
        lastname: '',
        name: '',
        stateid: '',
    }
    componentDidMount = async () => {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        this.setState({
            isLoadding: true,
        });
        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');

        let formdata = new FormData();
        formdata.append("id", userID)
        fetch('http://home.gyaano.in/api/getprofiledata', {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formdata
        }).then((response) => response.json())
            .then(async (responseJson) => {
                this.setState({
                    isLoadding: false,
                });
                if (typeof responseJson.success != "undefined") {
                    this.setState({
                        cityid: responseJson.success.cityid,
                        id: responseJson.success.id,
                        lastname: responseJson.success.lastname,
                        name: responseJson.success.name,
                        stateid: responseJson.success.stateid,
                    })

                } else if (typeof responseJson.error != "undefined") {
                    console.log(responseJson.error)
                } else {
                    console.log(responseJson)
                }
            })
            .catch((error) => {
                this.setState({
                    isLoadding: false,
                });
                alert(error);
            });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    backAction = () => {
        this.props.navigation.goBack()
    };

    render() {
        const { editable, isLoadding, cityid, id, lastname, name, stateid } = this.state
        const { title } = styles
        const editableProfile = () => {
            this.setState((state) => ({
                editable: !state.editable,
            }))
        }
        const profileEditHandler = async () => {
            this.setState((state) => ({
                isLoadding: !state.isLoadding,
                editable: !state.editable,
            }))
            const token = await AsyncStorage.getItem('token');
            let formdata = new FormData();
            formdata.append("id", id)
            formdata.append("name", this.state.name)
            formdata.append("lastname", this.state.lastname)
            formdata.append("stateid", this.state.stateid)
            formdata.append("cityid", this.state.cityid)
            fetch('http://home.gyaano.in/api/profileupdate', {
                method: 'POST',
                headers: {
                    "Accept": 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: formdata
            }).then((response) => response.json())
                .then(async (responseJson) => {
                    this.setState({
                        isLoadding: false,
                    });
                    if (typeof responseJson.success != "undefined") {
                        this.setState({
                            profiledata: responseJson.success
                        })

                    } else if (typeof responseJson.error != "undefined") {
                        console.log(responseJson.error)
                    } else {
                        console.log(responseJson)
                    }
                })
                .catch((error) => {
                    this.setState({
                        isLoadding: false,
                    });
                    alert(error);
                });
        }

        return (
            <Container>
                <Content>
                    <View style={{
                        borderBottomWidth: 1,
                        paddingBottom: '10%',
                        borderBottomColor: '#0005'
                    }}>
                        <Body style={{
                            marginTop: '10%',
                        }}>
                            <View style={{
                                borderRadius: 50,
                                backgroundColor: '#0001',
                                width: 100,
                                height: 100,
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={[title,
                                    {
                                        borderBottomWidth: 0,
                                        fontSize: 22,
                                        textAlign: 'center',
                                        alignSelf: 'center'
                                    }]}>
                                    {name.charAt(0)} {lastname.charAt(0)}
                                </Text>
                            </View>
                        </Body>
                    </View>
                    <View style={{
                        padding: '2%',
                        alignItems: 'flex-end',
                    }}>
                        {
                            editable ?
                                <Text
                                    style={{
                                        color: 'red',
                                        fontWeight: 'bold',
                                        fontSize: 11, textTransform: 'uppercase',
                                        letterSpacing: 2
                                    }}>
                                    All fields are required.
                                </Text> :
                                <Button transparent onPress={() => editableProfile()} >
                                    <Icon type="FontAwesome5" name='edit' style={{ color: '#0007' }} />
                                </Button>
                        }
                    </View>
                    <Content padder>
                        <View style={{ marginBottom: '2%' }}>
                            <Text>First Name</Text>
                            <Item disabled>
                                <Input
                                    disabled={editable ? false : true}
                                    value={name}
                                    onChangeText={(name) => this.setState({ name })}
                                />
                            </Item>
                        </View>
                        <View style={{ marginBottom: '2%' }}>
                            <Text>Last Name</Text>
                            <Item disabled>
                                <Input
                                    disabled={editable ? false : true}
                                    value={lastname}
                                    onChangeText={(lastname) => this.setState({ lastname })}
                                />
                            </Item>
                        </View>
                        <View style={{ marginBottom: '2%' }}>
                            <Text>City</Text>
                            <Item disabled>
                                <Input
                                    disabled={editable ? false : true}
                                    value={cityid}
                                    onChangeText={(cityid) => this.setState({ cityid })}
                                />
                            </Item>
                        </View>
                        <View style={{ marginBottom: '2%' }}>
                            <Text>State</Text>
                            <Item disabled>
                                <Input
                                    disabled={editable ? false : true}
                                    value={stateid}
                                    onChangeText={(stateid) => this.setState({ stateid })}
                                />
                            </Item>
                        </View>
                        <View style={{ marginBottom: '2%' }}>
                            {
                                cityid.length && cityid != "undefinded" && lastname.length
                                    && lastname != "undefinded" && name.length
                                    && name != "undefinded" && stateid && editable ?
                                    <Button block bordered transparent dark onPress={() => profileEditHandler()}>
                                        <Text style={[title, {
                                            borderBottomWidth: 0, fontSize: 16, textAlign: 'center',
                                            alignSelf: 'center'
                                        }]}>Submit</Text>
                                    </Button>
                                    : null
                            }
                        </View>
                    </Content>
                </Content>
                {
                    isLoadding ?
                        <Spinner color="#0005" style={{ position: 'absolute', top: '50%', left: '45%' }}
                        /> : null
                }
            </Container >
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#0005',
    }
})


// phone
// speedmeter
