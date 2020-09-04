import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, Dimensions, Alert } from 'react-native'
import Pdf from 'react-native-pdf';
export default class Docviwer extends Component {
    render() {
        const source = { uri: 'http://samples.leanpub.com/thereactnativebook-sample.pdf', cache: true };
        const url = { uri: this.props.route.params.url, cache: true };
        console.log(url)
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <Pdf
                    source={
                        typeof url != "undefined" ?
                            url : source
                    }
                    onLoadComplete={(numberOfPages) => {
                        console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page) => {
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        Alert.alert('Error', `${error}`)
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

