import React, { Component } from 'react';
import { ScrollView, View, Image, Text, Button } from 'react-native';
import { SecureStore } from 'expo';

import constants from 'library/utils/constants';
import { UrlFormat } from 'library/utils/functions';

export default class CreatePlaylistScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {data: this.props.navigation.getParam('setlistData')}
    }

    componentDidMount() {

    }

    doFetch = async (url) => {
        return fetch(url)
            .then((response) => {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const {navigate} = this.props.navigation;
        const data = this.state.data;
        return (
            <ScrollView>
                <Text>{data.artist.name}</Text>
                <Text>{data.eventDate} * {data.venue.name}</Text>
                <Text>{data.venue.city.name}, {data.venue.city.stateCode}, {data.venue.city.country.code}</Text>
                <Text>Tracks</Text>
                {this._renderTracks(0)}
                <Text>Encore</Text>
                {this._renderTracks(1)}
            </ScrollView>
        );
    }

    _renderTracks(set) {
        let tracks = [];
        let data = this.state.data;

        if(data.sets.set.length > set) {
            for(var i = 0; i < data.sets.set[set].song.length; i++) {
                tracks.push(<Text key={'row-' + i}>{data.sets.set[0].song[i].name}</Text>);
            }
        }

        return tracks;
    }

}
