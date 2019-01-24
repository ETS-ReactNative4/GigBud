import React, { Component } from 'react';
import { View, Image, Text, Button, AsyncStorage } from 'react-native';
import { SecureStore, LinearGradient, AuthSession } from 'expo';

import images from 'res/images';
import colors from 'res/colors';
import strings from 'res/strings';
import styles from './styles';
import constants from 'library/utils/constants';
import { EncodeBase64 } from 'library/utils/functions';
import { AuthenticateUser, RequestAccessTokens } from 'library/utils/Spotify';

export default class AuthScreen extends Component {
    constructor(props) {
        super(props);
    }

    setStreamingService = async (service) => {
        if(service === 'spotify') {
            let spotifyID = await SecureStore.getItemAsync(constants.local_spotify_id);
            let spotifySecret = await SecureStore.getItemAsync(constants.local_spotify_secret);
            let scopes = 'playlist-modify-private playlist-modify-public';
            let result = await AuthenticateUser(spotifyID, spotifySecret, scopes);
            if(result.type === 'success') {
                let tokens = await RequestAccessTokens(result.authCode, spotifyID, spotifySecret, result.redirectUrl);
                this.storeSpotify(tokens);
                this.props.navigation.navigate('App');
            } else {
                console.log('Error from AuthenticateUser');
            }
        } else if(service === 'apple_music') {
            // Do apple music things
        }
    }

    storeSpotify = async (tokens) => {
        SecureStore.setItemAsync(constants.local_spotify_access_token,
            tokens.access_token);
        SecureStore.setItemAsync(constants.local_spotify_refresh_token,
            tokens.refresh_token);
        AsyncStorage.setItem(constants.local_streaming_service, 'spotify');
        AsyncStorage.setItem(constants.first_launch, 'false');
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
