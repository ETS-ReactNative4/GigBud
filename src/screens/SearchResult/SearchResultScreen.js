import React, { Component } from 'react';
import { ScrollView, View, Image, Text, Button } from 'react-native';
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
            data: null,
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
            searchVal = searchVal.trim().replace(' ', '%20');
            var url = UrlFormat(constants.setlist_fm_search_artists, searchVal);
            console.log(url);
            let data = await this.doFetch(url, api_key);
            this.searchForSetlist(data.artist[0].mbid);
        }
    }

    searchForSetlist = async (mbid) => {
        let api_key = await SecureStore.getItemAsync(constants.local_setlist_fm);
        var url = UrlFormat(constants.setlist_fm_search_setlists, mbid, this.state.pageCounter);
        let data = await this.doFetch(url, api_key);
        this.setState({loading: false, data: data});
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
                console.log(JSON.stringify(data, null, 2));
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
                <ScrollView style={styles.parent}>
                    {this._renderSetlists()}
                </ScrollView>
            )
        }
    }

    _renderSetlists() {
        let buttons = [];
        let data = this.state.data;

        for(var i = 0; i < data.setlist.length; i++) {
            let setlist = data.setlist[i];
            buttons.push(
                <SearchResultTicketButton
                    key={'row-' + i}
                    data={setlist}
                />
            );
        }
        return buttons;
    }
}
