import React, { Component } from 'react';
import { View, Image, Text, Button } from 'react-native';

export default class ErrorScreen extends Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Text>Error screen</Text>
                <Button
                    title="Go to home"
                    onPress={() => navigate('Home')}
                />
            </View>
        );
    }
}
