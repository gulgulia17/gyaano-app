import React, { Component } from 'react'
import { Text, StyleSheet, View, ActivityIndicator, Dimensions, Linking, Modal, TouchableOpacity } from 'react-native'
import {
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer'
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Iconn from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontawesome from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import { Icon } from 'native-base';

import { GoogleSignin } from 'react-native-google-signin';
import APIKey from '../google-congig';

export default class DrawerContent extends Component {
    state = {
        fname: 'Null',
        lname: 'Null',
        isSignningOut: false,
        modalVisible: false,
    }

    componentDidMount = async () => {

        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');

        let formdata = new FormData();
        formdata.append("id", userID)
        fetch('https://gyaano.in/api/getprofiledata', {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formdata
        }).then((response) => response.json())
            .then(async (responseJson) => {
                if (responseJson.success) {
                    this.setState({
                        fname: responseJson.success.name,
                        lname: responseJson.success.lastname,
                    })
                } else {
                    console.log(responseJson)
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { fname, lname, isSignningOut, modalVisible } = this.state
        const { navigation } = this.props
        const { userInfoSection, title, font, drawerSection, bottomDrawerSection, center, hide } = styles
        const signOut = async () => {
            this.setState({ isSignningOut: true })
            GoogleSignin.configure({
                androidClientId: APIKey,
                forceCodeForRefreshToken: true,
            });
            try {
                await GoogleSignin.revokeAccess();
                await AsyncStorage.removeItem('isLoggedIn');
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('userID');
                navigation.dispatch(StackActions.replace('AuthScreen'));

            } catch (e) {
                console.log(e);
            } finally {
                // this.setState({ isSignningOut: false })
            }

        }

        return (
            <View style={{ flex: 1 }}>
                <DrawerContentScrollView {...this.props}>
                    <View>
                        <View style={userInfoSection}>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <View style={{ borderRadius: 50, backgroundColor: '#0001', width: 50, height: 50, alignSelf: 'center', justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center' }}>
                                        {fname.charAt(0)} {lname.charAt(0)}
                                    </Text>
                                </View>
                                <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                    <Text style={title}>{fname} {lname}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Iconn
                                    name="home-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={() => <Text style={font}>Home</Text>}
                            onPress={() => { navigation.navigate('HomeTab') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Iconn
                                    name="account-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={() => <Text style={font}>Profile</Text>}
                            onPress={() => { navigation.navigate('Profile') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Iconn
                                    name="file-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={() => <Text style={font}>Docs</Text>}
                            onPress={() => { navigation.navigate('Docs') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Iconn
                                    name="folder-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={() => <Text style={font}>My Subscriptions</Text>}
                            onPress={() => { navigation.navigate('MySubscription') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Iconn
                                    name="bell-outline"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={() => <Text style={font}>Notifications</Text>}
                            onPress={() => { navigation.navigate('Notifications') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Octicons
                                    name="lock"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={() => <Text style={font}>Change Password</Text>}
                            onPress={() => { navigation.navigate('ResetPassword') }}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (
                                <Fontawesome
                                    name="copy"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={() => <Text style={font}>{'Terms & Conditions'}</Text>}
                            onPress={() => { navigation.navigate('TNC') }}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Fontawesome
                                    name="address-card"
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={() => <Text style={font}>Contact Us</Text>}
                            onPress={() => { this.setModalVisible(true) }}
                        />
                        <View style={styles.centeredView}>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => { this.setModalVisible(false) }}
                            >
                                <View style={styles.centeredView}>
                                    <View style={[styles.modalView]}>
                                        <Text style={{ textAlign: "center" }, [styles.title]}>Contact us over</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: '8%' }}>
                                            <View style={{ margin: "10%" }}>
                                                <TouchableOpacity onPress={() => Linking.openURL('mailto:gyaanoapp@gmail.com')}>
                                                    <Icon style={{ textAlign: 'center' }} type="FontAwesome5" name="envelope" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ margin: "10%" }}>
                                                <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/918107746007')}>
                                                    <Icon style={{ textAlign: 'center' }} type="FontAwesome5" name="whatsapp" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ margin: "10%" }}>
                                                <TouchableOpacity onPress={() => Linking.openURL('tel:${+918107746007}')}>
                                                    <Icon style={{ textAlign: 'center' }} name="call" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text style={{ textAlign: "center" }, [styles.title]}>Office hours are from 10AM to 6PM , You can contact us through whatsapp or email.</Text>
                                        <View style={{ paddingVertical: '2%' }}>
                                            <TouchableOpacity onPress={() => Linking.openURL('tel:${+918107746007}')}>
                                                <Text style={{ textAlign: "center", }, [styles.title]}>
                                                    Helpdesk - +91 8107746007
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </View>
                </DrawerContentScrollView>
                <View style={bottomDrawerSection}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Iconn
                                name="exit-to-app"
                                color={color}
                                size={size}
                            />
                        )}
                        label={() => <Text style={font}>{'Sign Out'}</Text>}
                        onPress={() => { signOut() }}
                    />
                </View>

                <ActivityIndicator size="large" style={isSignningOut ? center : hide} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
        paddingBottom: 20,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontFamily: 'Montserrat-SemiBold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    font: {
        fontFamily: 'Montserrat-Medium',
    },
    fontBold: {
        fontFamily: 'Montserrat-SemiBold',
    },
    center: {
        position: 'absolute',
        top: '50%',
        left: '70%',
    },
    hide: {
        display: "none"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
