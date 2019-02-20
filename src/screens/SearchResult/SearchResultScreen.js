import React, { Component } from 'react';
import { FlatList, ScrollView, View, Image, Text, Button,
         ActivityIndicator } from 'react-native';
import { SecureStore } from 'expo';

import SearchResultTicketButton from 'library/components/SearchResultTicketButton';
import constants from 'library/utils/constants';
import colors from 'res/colors';
import { UrlFormat } from 'library/utils/functions';
import styles from './styles';


export default class SearchResultsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: [],
            pageCounter: 1,
            status: 0
        }
    }

    componentDidMount() {
        this.searchForArtist();
    }

    searchForArtist = async () => {
        var searchVal = this.props.navigation.getParam('searchValue', null);
        if(searchVal === null) {
            this.props.navigation.navigate('Error');
        } else {
            let api_key = await SecureStore.getItemAsync(constants.local_setlist_fm);
            var url = UrlFormat(constants.setlist_fm_search_artists, encodeURIComponent(searchVal));
            let data = await this.doFetch(url, api_key);
            if(data[0] === 200)
                this.searchForSetlist(data[1].artist[0].mbid);
            else
                this.setState({isLoading: false, status: data[0]})

        }
    }

    searchForSetlist = async (mbid) => {
        let api_key = await SecureStore.getItemAsync(constants.local_setlist_fm);
        var url = UrlFormat(constants.setlist_fm_search_setlists, mbid, this.state.pageCounter);
        let data = await this.doFetch(url, api_key);
        if(data[0] === 200) {
            let oldData = this.state.data;
            data[1].setlist.forEach((setlist) => oldData.push(setlist));
            this.setState({isLoading: false, data: oldData});
        }
    }

    doFetch = async (url, api_key) => {
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'x-api-key': api_key
            }
        })
        .then((response) => {
            const statusCode = response.status;
            const data = response.json();
            return Promise.all([statusCode, data]);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        if(this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator size='large' color={colors.black} />
                </View>
            )
        } else {
            if(this.state.status === 404) {
                return(
                    <View style={styles.rootContainer}>
                        <Text> Cannot find {this.props.navigation.getParam('searchValue', null)} </Text>
                    </View>
                )
            }
            return (
                <FlatList
                    style={styles.parent}
                    data={this.state.data}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        this.loadMore()
                    }}
                    renderItem={({item}) => <SearchResultTicketButton data={item}/>}
                    keyExtractor={item => item.id}
                />
            )
        }
    }

    loadMore = async () => {
        this.setState({pageCounter: this.state.pageCounter+1});
        this.searchForSetlist(this.state.data[0].artist.mbid);
    }

}
