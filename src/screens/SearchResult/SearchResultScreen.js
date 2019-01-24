import React, { Component } from 'react';
import { FlatList, ScrollView, View, Image, Text, Button } from 'react-native';
import { SecureStore } from 'expo';

import SearchResultTicketButton from 'library/components/SearchResultTicketButton';
import constants from 'library/utils/constants';
import { UrlFormat } from 'library/utils/functions';
import styles from './styles';

export default class SearchResultsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            pageCounter: 1
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
            console.log(url);
            let data = await this.doFetch(url, api_key);
            this.searchForSetlist(data.artist[0].mbid);
        }
    }

    searchForSetlist = async (mbid) => {
        let api_key = await SecureStore.getItemAsync(constants.local_setlist_fm);
        var url = UrlFormat(constants.setlist_fm_search_setlists, mbid, this.state.pageCounter);
        let data = await this.doFetch(url, api_key);
        if(data != null) {
            let oldData = this.state.data;
            data.setlist.forEach((setlist) => oldData.push(setlist));
            this.setState({loading: false, data: oldData});
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
        .then(([code, data]) => {
            if(code === 200) {
                // console.log(JSON.stringify(data, null, 2));
                return data;
            } else if(code === 404) {
                this.setState({isLoading: false, status: 404});
            } else {
                this.props.navigation.navigate('Error');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        if(this.state.loading) {
            return null;
        } else {
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
