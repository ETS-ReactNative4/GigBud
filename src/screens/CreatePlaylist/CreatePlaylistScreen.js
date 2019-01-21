import React, { Component } from 'react';
import { View, Image, Text, Button } from 'react-native';

export default class CreatePlaylistScreen extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Text>{JSON.stringify(this.props.navigation.getParam('setlistData'))}</Text>
            </View>
        );
    }
}
