import React, { Component } from 'react';
import { View, Image, Text, Button, AsyncStorage, TouchableOpacity,
         ActivityIndicator, Alert } from 'react-native';
import { Font, LinearGradient } from 'expo';

import images from 'res/images';
import colors from 'res/colors';
import strings from 'res/strings';
import styles from './styles';
import constants from 'library/utils/constants';
import StreamingFactory from 'library/factories/StreamingFactory';

export default class AuthScreen extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
    }

    setStreamingService = async (service) => {
        // Alert.alert('Alert title', 'Alert message', [
        //     {text: 'Cancel', onPress: () => console.log('cancel pressed'), style: 'cancel'},
        //     {text: 'OK', onPress: () => console.log('ok pressed')}
        // ])
        var factory = new StreamingFactory(service);
        var type = factory.createService();
        console.log(type);
        let result = await type.authenticateUser();
        if(result.type === 'success')
            this.props.navigation.navigate('App');
        else
            console.log('Error from AuthenticateUser : ' + result.description);
    }

    render() {
        return (
                <LinearGradient
                    colors={[colors.black, colors.navyblue]}
                    style={styles.gradientContainer}>
                    <Image
                        source={images.turnover}
                        style={styles.image}
                    />
                    <Text style={[styles.title, {fontFamily: 'bad-script-regular'}]}>GigBud</Text>
                    <View style={styles.infoBlock}>
                        <Text style={styles.info}>Please login to begin</Text>
                    </View>
                    <View style={styles.buttonBlock}>
                        <TouchableOpacity
                            onPress={() => {this.setStreamingService('spotify')}}
                            style={styles.spotifyBtn}>
                            <LinearGradient
                                colors={[colors.teal, colors.seafoam]}
                                style={styles.buttonGradient}
                                start={[1, 0]}
                                end={[0, 1]}>
                                    <Image
                                        source={images.spotifyIcon}
                                        style={styles.spotifyIcon} />
                                    <Text style={styles.btnText}>{strings.spotify}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
        )
    }
}
