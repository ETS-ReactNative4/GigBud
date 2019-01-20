import React, { Component } from 'react';
import { View, Image, Text, Button } from 'react-native';

export default class SearchResultsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            data: null
        }
    }

    componentWillMount() {
        // Get search val
        var searchVal = this.props.navigation.getParam('searchValue', null);
        if(searchVal === null) {
            this.setState({
                loading: false,
                error: true,
                data: null
            });
            this.props.navigation.navigate('Error');
        } else {
            // Get setlist.fm api key from storage

            // Search setlist.fm and update state
            
        }
    }

    // search = async() => {
    //     const val = this.props.navigation.getParam('searchValue', null);
    //     console.log(val);
    //     if(val === null) {
    //         this.props.navigation.navigate('Error');
    //     } else {
    //         this.setState({
    //             searchComplete: true,
    //             searchVal: JSON.stringify(val)
    //         });
    //     }
    // }

    render() {
        if(this.state.loading) {
            return null;
        } else {
            // Error encountered
            if(this.state.error) {
                this.props.navigation.navigate('Error');
            }

            return (
                <View>
                    <Text>SearchResults screen</Text>
                    <Button
                        title="Go to home"
                        onPress={() => navigate('Home')}
                    />
                    <Text>{this.state.searchVal}</Text>
                </View>
            )
        }
    }
}
