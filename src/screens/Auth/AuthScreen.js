import React, { Component } from 'react';
import { View, Image, Text, Button, AsyncStorage } from 'react-native';
import { SecureStore, LinearGradient, AuthSession } from 'expo';

import images from 'res/images';
import colors from 'res/colors';
import strings from 'res/strings';
import styles from './styles';
import constants from 'library/utils/constants';
import { EncodeBase64 } from 'library/utils/functions';

export default class AuthScreen extends Component {
    constructor() {
        super();

        this.state = {isLoggedIn: false};
    }

    setStreamingService = async (service) => {
        AsyncStorage.setItem(constants.local_streaming_service, service)
                    .then(async () => {
                        // Authenticate user and save refresh key
                        if(service === 'spotify') {
                            let spotifyID = await SecureStore.getItemAsync(constants.local_spotify_id);
                            let spotifySecret = await SecureStore.getItemAsync(constants.local_spotify_secret);
                            let scopes = 'playlist-modify-private playlist-modify-public';
                            this.authenticateUserWithSpotify(spotifyID, spotifySecret, scopes);
                        } else if(service === 'apple_music') {
                            // Do apple music things
                        }
                    })
                    .catch((error) => {
                        console.log('error in setStreamingService: ' + error);
                        throw error;
                    });
    }

    // Authenticates a user with spotify,
    authenticateUserWithSpotify = async (id, secret, scopes) => {
        let redirectUrl = AuthSession.getRedirectUrl();
        let authUrl = 'https://accounts.spotify.com/authorize?' +
                'response_type=code' +
                '&client_id='+ encodeURIComponent(id) +
                '&scope=' + encodeURIComponent(scopes) +
                '&redirect_uri=' + encodeURIComponent(redirectUrl);
        let result = await AuthSession.startAsync({
            authUrl:authUrl
        });
        if(result.type === 'success') {
            this.spotifyRequestAccessTokens(result.params.code, id, secret, redirectUrl);
        } else {
            console.log(result.errorCode);
        }
    }

    spotifyRequestAccessTokens = async (code, id, secret, uri) => {
        // Because spotify api expects x-www-form-urlencoded
        // we have to build the form body manually, can't use json
        var details = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: uri,
        }
        var formBody = [];
        for(var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedVal = encodeURIComponent(details[property]);
            formBody.push(encodedKey + '=' + encodedVal);
        }
        formBody = formBody.join('&');

        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + EncodeBase64(id + ':' + secret),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody,
        })
        .then((response) => {
            if(response.status === 200) {
                return response.json();
            } else {
                console.log('Error: ' + response.status);
            }
        })
        .then((responseJson) => {
            this.storeSpotify(responseJson).then(() => {
                this.props.navigation.navigate('App');
            })
        })
    }

    storeSpotify = async (resJson) => {
        SecureStore.setItemAsync(constants.local_spotify_access_token,
            resJson.access_token);
        SecureStore.setItemAsync(constants.local_spotify_refresh_token,
            resJson.refresh_token);
        AsyncStorage.setItem(constants.first_launch, 'false');
    }

    render() {
        if(this.state.isLoggedIn) {
            return null;
        } else {
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
}
