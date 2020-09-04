import React, { Component } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    Alert
} from "react-native";
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from "native-base";
import { StackActions } from '@react-navigation/native';
const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta);document.forms.payu.submit();'
export default class Subscription extends Component {
    state = {
        modalVisible: false,
        paytm: null,
        payStatus: '',
    };

    componentDidMount() {
        this.PaymentHandler(this.props.route.params)
    }

    setModalVisible = (visible) => {
        this.setState({
            paytm: null,
            isLoadding: false,
            modalVisible: visible,
            payStatus: 'canceled',
        });
    }
    componentDidMount = async () => {

        const { courseId } = this.props.route.params
        const token = await AsyncStorage.getItem('token');
        const userID = await AsyncStorage.getItem('userID');
        this.setState({
            isLoadding: true,
            payStatus: null
        })
        let formdata = new FormData();
        formdata.append("student_id", userID)
        formdata.append("course_id", courseId)
        fetch('http://home.gyaano.in/api/payment', {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formdata,
        })
            .then(response => response.text())
            .then(async (responseJson) => {
                console.log(responseJson)
                this.setState({
                    paytm: responseJson,
                    modalVisible: true,
                    isLoadding: false,
                })
            })
    }
    render() {
        const { modalVisible, paytm, isLoadding, payStatus } = this.state;
        const { centeredView, openButton, textStyle, show, hide } = styles
        const { courseId } = this.props.route.params
        if (payStatus === "success") {
            this.setState({
                modalVisible: false,
                payStatus: '',
            })
            Alert.alert(
                'Success',
                'Thankyou , you have successfully subscribed.',
                [
                    { text: 'Yay!', onPress: () => this.props.navigation.dispatch(StackActions.replace('Home')) },
                ],
                { cancelable: false },
            );
        }
        if (payStatus === "canceled") {
            this.setState({
                modalVisible: false,
                payStatus: '',
            })
            Alert.alert(
                'Payment Canceled',
                'Sorry , you have canceled the payment.',
                [
                    { text: 'Okay', onPress: () => this.props.navigation.goBack() },
                ],
                { cancelable: false },
            );
        }
        if (payStatus === "failure") {
            this.setState({
                modalVisible: false,
                payStatus: '',
            })
            Alert.alert(
                'Payment Failed',
                'Sorry , your payment failed.',
                [
                    { text: 'Okay', onPress: () => this.props.navigation.goBack() },
                ],
                { cancelable: false },
            );
        }
        return (
            <View style={centeredView} >
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => this.setModalVisible(!modalVisible)}
                >
                    <WebView source={{ html: paytm }}
                        automaticallyAdjustContentInsets={false}
                        injectedJavaScript={INJECTEDJAVASCRIPT}
                        onNavigationStateChange={(navigationState) => {
                            console.log(navigationState.title)
                            if (navigationState.title == 'success') {
                                console.log(navigationState.title);
                                this.setState({
                                    payStatus: 'success',
                                })
                            }
                            if (navigationState.title == 'failure') {
                                console.log(navigationState.title);
                                this.setState({
                                    payStatus: 'failure',
                                })
                            }
                        }
                        }
                    />
                </Modal>

                {/* <Button block
                    style={[openButton, { marginTop: "5%" }]}
                    onPress={() => {
                        this.PaymentHandler(courseId);
                    }}
                >
                    <Text style={textStyle}>Payment</Text>
                </Button> */}
                <ActivityIndicator
                    size="large"
                    style={isLoadding ? show : hide}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        paddingHorizontal: '5%'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        height: Dimensions.get('window').height,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 8,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontSize: 16
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    show: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: '50%'
    },
    hide: {
        display: 'none'
    }
});
