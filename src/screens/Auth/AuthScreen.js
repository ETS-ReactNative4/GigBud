import React, { Component } from 'react';
import { View, Image, Text, Button, AsyncStorage } from 'react-native';
import { LinearGradient } from 'expo';

import images from 'res/images';
import colors from 'res/colors';
import strings from 'res/strings';
import styles from './styles';
import constants from 'library/utils/constants';
import StreamingFactory from 'library/factories/StreamingFactory';

export default class AuthScreen extends Component {
    constructor(props) {
        super(props);
    }

    setStreamingService = async (service) => {
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
                </LinearGradient>
            </View>
        )
    }
}
