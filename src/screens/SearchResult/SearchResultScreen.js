import React, { Component } from 'react';
import { View, Image, Text, Button } from 'react-native';

export default class SearchResultsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchComplete: false,
            searchVal: ''
        }
        this.search();
    }

    search = async() => {
        const val = this.props.navigation.getParam('searchValue', null);
        console.log(val);
        if(val === null) {
            this.props.navigation.navigate('Error');
        } else {
            this.setState({
                searchComplete: true,
                searchVal: JSON.stringify(val)
            });
        }
    }

    render() {
        if(this.state.searchComplete) {
            return (
                <View>
                    <Text>SearchResults screen</Text>
                    <Button
                        title="Go to home"
                        onPress={() => navigate('Home')}
                    />
                    <Text>{this.state.searchVal}</Text>
                </View>
            );
        } else {
            return null;
        }
    }
}
