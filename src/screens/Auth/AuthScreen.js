import React, { Component } from 'react';
import { View, Image, Text, Button, AsyncStorage } from 'react-native';
import { SecureStore, LinearGradient } from 'expo';

import images from 'res/images';
import colors from 'res/colors';
import strings from 'res/strings';
import styles from './styles';

export default class AuthScreen extends Component {
    constructor() {
        super();
        SecureStore.getItemAsync('setlist_fm_api_key')
            .then((key) => {
                console.log(key);
            });
        this.state = {streamingServiceChosen: null}
    }

    setStreamingService = async (service) => {
        AsyncStorage.setItem('streamingService', service)
                    .then(() => {
                        this.setState({streamingServiceChosen: true});
                        // ** this is not a valid function
                        this.props.navigation.navigate('App');
                    })
                    .catch((error) => {
                        console.log('error in setStreamingService: ' + error);
                        throw error;
                    });
    }

    render() {
        const {navigate} = this.props.navigation;
        // if(this.state.streamingServiceChosen) {
        //     this.props.navigation.navigate('App');
        //     return null;
        // } else {
            return (
                <View style={styles.rootContainer}>
                    <LinearGradient
                        colors={[colors.black, colors.navyblue]}
                        style={styles.gradientContainer}>
                        <Image
                            source={images.turnover}
                            style={styles.image}
                        />
                        <Button
                            title={strings.spotify}
                            onPress={() => {this.setStreamingService('spotify')}}
                        />
                        <Button
                            title={strings.appleMusic}
                            onPress={() => {this.setStreamingService('apple_music')}}
                        />
                    </LinearGradient>
                </View>
            )
        // }
    }
}
