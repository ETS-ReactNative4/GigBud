import React, { Component } from 'react';
import { View, Image, Text, Button, AsyncStorage } from 'react-native';
import { SecureStore, LinearGradient } from 'expo';

import images from 'res/images';
import colors from 'res/colors';
import strings from 'res/strings';
import styles from './styles';
import constants from 'library/utils/constants';

export default class AuthScreen extends Component {
    constructor() {
        super();
    }

    setStreamingService = async (service) => {
        AsyncStorage.setItem(constants.local_streaming_service, service)
                    .then(() => {
                        // Authenticate user and save refresh key

                        // this.setState({streamingServiceChosen: true});
                        AsyncStorage.setItem(constants.first_launch, 'false').then(() => {
                            this.props.navigation.navigate('App');
                        })
                    })
                    .catch((error) => {
                        console.log('error in setStreamingService: ' + error);
                        throw error;
                    });
    }

    render() {
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
    }
}
