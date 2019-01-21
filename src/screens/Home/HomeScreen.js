import React, { Component } from 'react';
import {
    View, Image, Text, Button, TextInput
} from 'react-native';
import {createDrawerNavigator, createAppContainer} from 'react-navigation';


import SearchInput from 'components/SearchInput';
import styles from './styles';


export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.rootContainer}>
                <SearchInput />

            </View>
        )
    }
}
