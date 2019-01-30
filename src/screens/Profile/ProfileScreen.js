import React, { Component } from 'react';
import { View, Image, Text, Button, AsyncStorage } from 'react-native';

import constants from 'utils/constants';

export default class ProfileScreen extends Component {
    logout = async () => {
        AsyncStorage.setItem(constants.isLoggedIn, 'false');
        this.props.navigation.navigate('Initial');
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Text>Profile screen</Text>
                <Button
                    title="Go to home"
                    onPress={() => navigate('Home')}
                />
                <Button
                    title="Logout"
                    onPress={this.logout} />
            </View>
        );
    }
}
