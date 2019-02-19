import React, { Component } from 'react';
import { ScrollView, View, Image, Text, Button, Switch, TextInput,
         ActivityIndicator, AsyncStorage } from 'react-native';
import { SecureStore } from 'expo';

import colors from 'res/colors';
import constants from 'library/utils/constants';
import StreamingFactory from 'library/factories/StreamingFactory';
import PlaylistTrack from 'components/PlaylistTrack';
import { UrlFormat } from 'library/utils/functions';
import { RequestTokenFromRefresh, SearchArtist,
         GetAlbumsFromArtist, GetTracksFromAlbum,
         CreatePlaylist, AddSongsToPlaylist, GetUser } from 'library/utils/Spotify';
import styles from './styles';

export default class CreatePlaylistScreen extends Component {
    constructor(props) {
        super(props);
        this.trackTitles = [];
        this.trackObjects = [];
        this.artistImageUrl = '';
        this.playlistTracks = [];
        this.state = {
            data: this.props.navigation.getParam('setlistData'),
            isLoading: true,
            isPublic: false,
            doShuffle: false,
            title: ''
        }
    }

    componentDidMount() {
        this.getPreferredService().then(() => {
            var factory = new StreamingFactory(this.prefService);
            this.serviceType = factory.createService();
            this.getAllTracks();
        });
    }

    getPreferredService = async () => {
        this.prefService = await AsyncStorage.getItem(constants.local_streaming_service);
    }

    getAllTracks = async () => {
        // this.refreshToken = await SecureStore.getItemAsync(constants.local_spotify_refresh_token);
        // this.spotifyID = await SecureStore.getItemAsync(constants.local_spotify_id);
        // this.spotifySecret = await SecureStore.getItemAsync(constants.local_spotify_secret);
        // let token = await RequestTokenFromRefresh(this.refreshToken, this.spotifyID, this.spotifySecret);
        // let artist = await SearchArtist(token, this.state.data.artist.name);
        // this.artistImageUrl = artist.artists.items[0].images[1].url;
        // let albums = await GetAlbumsFromArtist(token, artist.artists.items[0].id);
        // tracks = [];
        // trackTitles = [];
        // for(var album in albums) {
        //     let tracksResult = await GetTracksFromAlbum(token, albums[album].id);
        //     for(var track in tracksResult) {
        //         tracks.push(tracksResult[track]);
        //         trackTitles.push(tracksResult[track].name.toLowerCase());
        //     }
        // }
        // this.tracksOnSpotify = tracks;
        // this.trackTitles = trackTitles;
        // this.setState({isLoading: false})
        let result = await this.serviceType.getAllTracks(this.state.data.artist.name);
        // Assign things with the result
        if(result[0] === 'OK') {
            this.trackObjects = result[1];
            this.trackTitles = result[2];
            this.artistImageUrl = result[3];
            this.setState({isLoading: false});
        } else {
            console.error('Error getting all tracks');
            // error
        }
    }

    handleSubmit = async () => {
        // this.addToPastPlaylists()
        // var trackIDs = [];
        // for(var song in this.playlistTracks) {
        //     for(var track in this.tracksOnSpotify) {
        //         if(this.playlistTracks[song].toLowerCase() === this.tracksOnSpotify[track].name.toLowerCase()) {
        //             trackIDs.push(this.tracksOnSpotify[track].id);
        //             break;
        //         }
        //     }
        // }
        // let token = await RequestTokenFromRefresh(this.refreshToken, this.spotifyID, this.spotifySecret);
        // let userID = await GetUser(token);
        // let playlistID = await CreatePlaylist(token, userID, this.state.title, !this.state.public);
        // AddSongsToPlaylist(token, playlistID, trackIDs);
        let result = await this.serviceType.handleSubmit(this.playlistTracks, this.trackObjects,
                        this.state.title, this.state.isPublic, this.state.doShuffle);
        // Let user know what happened on back-end
        if(result === 'OK') {
            // popup modal or navigate to success screen
        } else {
            // popup modal error? - display error description
        }
        this.props.navigation.navigate('App');
    }

    addToPastPlaylists = async () => {
        let pastPlaylists = await AsyncStorage.getItem(constants.pastPlaylists);
        if(pastPlaylists != null) {
            pastPlaylists = JSON.parse(pastPlaylists);
            if(pastPlaylists.length > 10) {
                // Grab 9 most recent then push this one to the front
                newPastPlaylists = [];
                for(var i = 0; i < 9; i++) {
                    newPastPlaylists.push(pastPlaylists[i]);
                }
                newPastPlaylists.unshift(this.state.data);
            }
            else {
                // Push this setlist to the beginning as most recent
                pastPlaylists.unshift(this.state.data);
            }
        } else {
            // Create list
            pastPlaylists = [];
            pastPlaylists.push(this.state.data);
        }
        AsyncStorage.setItem(constants.pastPlaylists, JSON.stringify(pastPlaylists));
    }

    render() {
        const {navigate} = this.props.navigation;
        const data = this.state.data;
        this.playlistTracks = [];
        if(this.state.isLoading) {
            return (
                <View>
                    <ActivityIndicator size='large' color={colors.black} />
                </View>
            )
        } else {
            return (
                <ScrollView
                    style={styles.rootContainer}>
                    <Image source={{uri: this.artistImageUrl}} style={styles.image} />
                    <Text>{data.artist.name}</Text>
                    <Text>{data.eventDate} * {data.venue.name}</Text>
                    <Text>{data.venue.city.name}, {data.venue.city.stateCode}, {data.venue.city.country.code}</Text>
                    <View style={styles.separator} />
                    <Text style={styles.header}>Tracks</Text>
                    {this._renderTracks(0)}
                    <Text style={styles.header}>Encore</Text>
                    {this._renderTracks(1)}
                    <Text style={styles.header}>Duration:...</Text>
                    <View>
                        <Text style={styles.header}>Public</Text>
                        <Switch
                            onValueChange={() => this.setState({isPublic: !this.state.isPublic})}
                            value={this.state.isPublic}/>
                        <Text style={styles.header}>Private</Text>
                    </View>
                    <View>
                        <Text style={styles.header}>Shuffle</Text>
                        <Switch
                            onValueChange={() => this.setState({doShuffle: !this.state.doShuffle})}
                            value={this.state.doShuffle}/>
                    </View>
                    <Text>Title</Text>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder='Playlist title...'
                        onChangeText={(text) => this.setState({title: text})}/>
                    <Button title='Create Playlist' onPress={this.handleSubmit} />
                </ScrollView>
            )
        }
    }

    _renderTracks(set) {
        let tracks = [];
        let data = this.state.data;

        if(data.sets.set.length > set) {
            for(var i = 0; i < data.sets.set[set].song.length; i++) {
                let name = data.sets.set[0].song[i].name;
                let disabled = !this.trackTitles.includes(name.toLowerCase());
                if(!disabled) this.playlistTracks.push(name);
                tracks.push(
                    <Text
                        key={'row-' + i}
                        style={disabled ? styles.disabledTrack : styles.enabledTrack}>{name}</Text>
                );
            }
        }

        return tracks;
    }

}
