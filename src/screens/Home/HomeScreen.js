import React, { Component } from 'react';
import {
    View, Image, Text, Button, TextInput, AsyncStorage,
    ScrollView, FlatList, ActivityIndicator
} from 'react-native';
import {createDrawerNavigator, createAppContainer} from 'react-navigation';

import SearchResultTicketButton from 'library/components/SearchResultTicketButton';
import SearchInput from 'components/SearchInput';
import styles from './styles';
import constants from 'utils/constants';
import colors from 'res/colors';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {isLoading: true, pastPlaylists: []};
    }

    componentDidMount() {
        this.getPastPlaylists();
    }

    getPastPlaylists = async () => {
        let p = await AsyncStorage.getItem(constants.pastPlaylists);
        console.log(JSON.parse(p));
        if(p != null) {
            this.setState({isLoading: false, pastPlaylists: JSON.parse(p)});
        } else {
            this.setState({isLoading: false});
        }
    }

    render() {
        if(this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator size='large' color={colors.black} />
                </View>
            )
        }
        if(this.state.pastPlaylists.length == 0) {
            return (
                <View style={styles.rootContainer}>
                    <SearchInput />
                    <Text>You have not made any playlists yet! Search for an artist to begin making playlists.</Text>
                </View>
            )
        }
        return (
            <ScrollView style={styles.rootContainer}>
                <SearchInput />
                <FlatList
                    style={styles.parent}
                    data={this.state.pastPlaylists}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        this.loadMore()
                    }}
                    renderItem={({item}) => <SearchResultTicketButton data={item}/>}
                    keyExtractor={item => item.id}
                />
            </ScrollView>
        )
    }

    loadMore = async () => {
        return null;
    }
}
