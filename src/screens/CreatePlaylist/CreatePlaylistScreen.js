import React, { Component } from 'react';
import { ScrollView, View, Image, Text, Button, Switch, TextInput,
         ActivityIndicator } from 'react-native';
import { SecureStore } from 'expo';

import colors from 'res/colors';
import constants from 'library/utils/constants';
import { UrlFormat } from 'library/utils/functions';
import { RequestTokenFromRefresh, SearchArtist,
         GetAlbumsFromArtist, GetTracksFromAlbum } from 'library/utils/Spotify';
import styles from './styles';

export default class CreatePlaylistScreen extends Component {
    constructor(props) {
        super(props);
        this.tracksOnSpotify = [];
        this.state = {
            data: this.props.navigation.getParam('setlistData'),
            isLoading: true,
        }
    }

    componentDidMount() {
        this.getAllTracks();
    }

    getAllTracks = async () => {
        let refToken = await SecureStore.getItemAsync(constants.local_spotify_refresh_token);
        let id = await SecureStore.getItemAsync(constants.local_spotify_id);
        let secret = await SecureStore.getItemAsync(constants.local_spotify_secret);
        let token = await RequestTokenFromRefresh(refToken, id, secret);
        let artist = await SearchArtist(token, this.state.data.artist.name);
        let albums = await GetAlbumsFromArtist(token, artist.artists.items[0].id);
        tracks = [];
        for(var album in albums) {
            let tracksResult = await GetTracksFromAlbum(token, albums[album].id);
            tracks = tracks.concat(tracksResult);
        }
        this.tracksOnSpotify = tracks;
        this.setState({isLoading: false})
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

    togglePublicPrivate = () => {
        this.setState({public: !this.state.public});
    }

    toggleShuffle = () => {
        this.setState({shuffle: !this.state.shuffle});
    }

    handleTitle = (text) => {
        this.setState({title: text});
    }

    render() {
        const {navigate} = this.props.navigation;
        const data = this.state.data;
        if(this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator size='large' color={colors.black} />
                </View>
            )
        } else {
            return (
                <ScrollView style={styles.rootContainer}>

                    <Text>{data.artist.name}</Text>
                    <Text>{data.eventDate} * {data.venue.name}</Text>
                    <Text>{data.venue.city.name}, {data.venue.city.stateCode}, {data.venue.city.country.code}</Text>
                    <Text style={styles.header}>Tracks</Text>
                    {this._renderTracks(0)}
                    <Text style={styles.header}>Encore</Text>
                    {this._renderTracks(1)}
                    <Text style={styles.header}>Duration:...</Text>
                    <View>
                        <Text style={styles.header}>Public</Text>
                        <Switch
                            onValueChange={this.togglePublicPrivate}
                            value={this.state.public}/>
                        <Text style={styles.header}>Private</Text>
                    </View>
                    <View>
                        <Text style={styles.header}>Shuffle</Text>
                        <Switch
                            onValueChange={this.toggleShuffle}
                            value={this.state.shuffle}/>
                    </View>
                    <Text>Title</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder='Playlist title...'
                        onChangeText={this.handleTitle}/>
                    <Button title='Create Playlist' onPress={() => console.log('pressed')} />
                </ScrollView>
            )
        }
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
