import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    Modal,
    BackHandler,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
} from 'react-native'
import { View, Button, Icon, List, ListItem } from 'native-base';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation';
import { ScrollView } from 'react-native-gesture-handler';

export default class CoursePlayer extends Component {
    constructor(props) {
        super(props);
        this.onProgress = this.onProgress.bind(this);
        this.onError = this.onError.bind(this);
        this.onBuffer = this.onBuffer.bind(this);
    }


    state = {
        rate: 1,
        volume: 1,
        muted: false,
        resizeMode: 'contain',
        duration: 0.0,
        currentTime: 0.0,
        active: false,
        modalVisible: false,
        fullScreen: true,
        opacity: 0,
        quality: 180,
        isBuffering: false,
    };

    onLoadStart = () => {
        this.setState({ opacity: 1 });
    }

    onLoad = () => {
        this.setState({ opacity: 0 });
    }

    onBuffer(data) {
        alert('Buffernin please wait');
        this.setState({ isBuffering: data.isBuffering });
    }
    onProgress(data) {
        this.setState({ currentTime: data.currentTime });
    }

    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
            return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        } else {
            return 0;
        }
    }
    onError() {
        this.setState({ error: data.error });
    }

    renderRateControl(rate) {
        const isSelected = (this.state.rate == rate);

        return (
            <ListItem>
                <TouchableOpacity onPress={() => { this.setState({ rate: rate }) }}>
                    <Text style={{ fontWeight: isSelected ? "bold" : "normal" }}>
                        {rate}x
                    </Text>
                </TouchableOpacity>
            </ListItem>
        )
    }

    videoQualityControl(quality) {
        const isSelected = (this.state.quality == quality);

        return (
            <ListItem>
                <TouchableOpacity onPress={() => { this.setState({ quality: quality }) }}>
                    <Text style={{ fontWeight: isSelected ? "bold" : "normal" }}>
                        {quality}px
                    </Text>
                </TouchableOpacity>
            </ListItem>
        )
    }
    renderResizeModeControl(resizeMode) {
        const isSelected = (this.state.resizeMode == resizeMode);

        return (
            <ListItem>
                <TouchableOpacity onPress={() => { this.setState({ resizeMode: resizeMode }) }}>
                    <Text style={[styles.controlOption, { fontWeight: isSelected ? "bold" : "normal" }]}>
                        {resizeMode}
                    </Text>
                </TouchableOpacity>
            </ListItem>
        )
    }

    renderVolumeControl(volume) {
        const isSelected = (this.state.volume == volume);

        return (
            <ListItem>
                <TouchableOpacity onPress={() => { this.setState({ volume: volume }) }}>
                    <Text style={[styles.controlOption, { fontWeight: isSelected ? "bold" : "normal" }]}>
                        {volume * 100}%
                    </Text>
                </TouchableOpacity>
            </ListItem>
        )
    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    fullScreen = () => {
        Orientation.getOrientation((err, orientation) => {
            if (orientation == 'LANDSCAPE') {
                Orientation.lockToPortrait();
            } else {
                Orientation.lockToLandscape();
            }
        });

    }

    backAction = () => {
        Orientation.getOrientation((err, orientation) => {
            if (orientation == 'LANDSCAPE') {
                Orientation.lockToPortrait();
            }
        });
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }
    render() {

        const { modalVisible, quality, isBuffering } = this.state
        const {
            container,
            fullScreen,
            rateControl,
            centeredView,
            modalView,
            closeModal,
            activityIndicator,
        } = styles
        const url = this.props.route.params.url
        return (
            <View style={container}>
                <StatusBar hidden={true} />

                <Video source={{ uri: url }}
                    style={fullScreen}
                    rate={this.state.rate}
                    paused={this.state.paused}
                    volume={this.state.volume}
                    muted={this.state.muted}
                    resizeMode={this.state.resizeMode}
                    onBuffer={this.onBuffer}
                    onLoadStart={this.onLoadStart}
                    onLoad={this.onLoad}
                    onProgress={this.onProgress}
                    onEnd={() => { ToastAndroid.show("Video finishes!", ToastAndroid.SHORT); }}
                    controls
                    selectedVideoTrack={{
                        type: 'resolution',
                        value: quality
                    }}
                    bufferConfig={{
                        minBufferMs: 15000,
                        maxBufferMs: 50000,
                        bufferForPlaybackMs: 2500,
                        bufferForPlaybackAfterRebufferMs: 5000,
                    }}
                    onError={this.onError}
                />
                <ActivityIndicator
                    animating
                    size="large"
                    color="#fff"
                    style={[activityIndicator,
                        { opacity: this.state.opacity }]}
                />
                {
                    isBuffering ? <ActivityIndicator /> : null
                }
                <View style={[{ left: 0 }, rateControl]}>
                    <Button
                        transparent
                        onPress={() => {
                            this.fullScreen();
                        }}
                    >
                        <Icon type="FontAwesome5" name="compress" style={{ color: "#fff", fontSize: 15 }} />
                    </Button>
                </View>
                <View style={rateControl}>
                    <Button
                        transparent
                        onPress={() => {
                            this.setModalVisible(true);
                        }}
                    >
                        <Icon type="FontAwesome5" name="ellipsis-v" style={{ color: "#fff", fontSize: 15 }} />
                    </Button>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!modalVisible);
                    }}
                >

                    <View style={centeredView}>
                        <View style={modalView}>
                            <View style={closeModal}>
                                <Button
                                    transparent
                                    onPress={() => { this.setModalVisible(!modalVisible); }}
                                >
                                    <Icon name="close" />
                                </Button>
                            </View>
                            <ScrollView>
                                <View>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Play Rate</Text>
                                    <List style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {this.renderRateControl(0.25)}
                                        {this.renderRateControl(0.5)}
                                        {this.renderRateControl(1.0)}
                                        {this.renderRateControl(1.5)}
                                        {this.renderRateControl(2.0)}
                                    </List>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Quality</Text>
                                    <List style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {this.videoQualityControl(180)}
                                        {this.videoQualityControl(240)}
                                        {this.videoQualityControl(360)}
                                        {this.videoQualityControl(480)}
                                    </List>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Volume</Text>
                                    <List style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {this.renderVolumeControl(0.5)}
                                        {this.renderVolumeControl(1)}
                                        {this.renderVolumeControl(1.5)}
                                    </List>
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Resize</Text>
                                    <List style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {this.renderResizeModeControl('cover')}
                                        {this.renderResizeModeControl('contain')}
                                        {this.renderResizeModeControl('stretch')}
                                    </List>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    backgroundVideo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * .6,
    },

    container: {
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

    rateControl: {
        flexDirection: 'row',
        position: 'absolute',
        top: 10,
        right: 10
    },

    centeredView: {
        flex: 1,
        marginTop: '22%'
    },
    modalView: {
        width: '100%',
        padding: '5%',
        backgroundColor: "white",
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    closeModal: {
        alignItems: 'flex-end',
        margin: -10
    },
    activityIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
});

