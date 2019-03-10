import React, { Component } from 'react';
import { ScrollView, View, Image, Text, Button, Switch, TextInput,
         ActivityIndicator, AsyncStorage, Modal,
         KeyboardAvoidingView } from 'react-native';
import { LinearGradient, SecureStore } from 'expo';
import { Overlay } from 'react-native-elements';

import colors from 'res/colors';
import constants from 'library/utils/constants';
import StreamingFactory from 'library/factories/StreamingFactory';
import PlaylistTrack from 'components/PlaylistTrack';
import { UrlFormat, GetOtherArtists } from 'library/utils/functions';
import { RequestTokenFromRefresh, SearchArtist,
         GetAlbumsFromArtist, GetTracksFromAlbum,
         CreatePlaylist, AddSongsToPlaylist, GetUser } from 'library/utils/Spotify';
import styles from './styles';

export default class CreatePlaylistScreen extends Component {
    static navigationOptions = {
        headerBackground: (
            <LinearGradient
              colors={[colors.black, colors.navyblue]}
              style={{ flex: 1, opacity: 0.85 }}
              start={[1, 0]}
              end={[0, 1]}
            />
        ),
        headerTitle: 'Create Playlist',
        headerTitleStyle: { color: 'white', alignSelf: 'center', textAlign: 'center' }
      };

    constructor(props) {
        super(props);
        this.trackTitles = [];
        this.trackObjects = [];
        this.artistImageUrl = '';
        this.playlistTracks = [];
        this.state = {
            data: this.props.navigation.getParam('setlistData'),
            isLoading: true,
            includeOtherArtists: false,
            isPublic: false,
            doShuffle: false,
            isFavorite: false,
            title: '',
            submitSuccessful: false,
            submitFail: false
        }
    }

    componentDidMount() {
        this.getPreferredService().then(() => {
            var factory = new StreamingFactory(this.prefService);
            this.serviceType = factory.createService();
            this.getAllTracks();
            this.getOtherArtists();
        });
        this.isaFavoriteSetlist();
    }

    getOtherArtists = async () => {
        let other = [];
        let otherNames = [];
        let array = await GetOtherArtists(this.state.data.eventDate, this.state.data.venue.id);
        // console.log(array);
        if(array[0] === 200) {
            // success
            for(var i in array[1].setlist) {
                if(array[1].setlist[i].artist.mbid != this.state.data.artist.mbid) {
                    // it is a different artist
                    if(array[1].setlist[i].sets.set.length > 0) {
                        other.push(array[1].setlist[i]);
                        otherNames.push(array[1].setlist[i].artist.name)
                    }
                }
            }
            this.otherArtists = other;
            this.otherArtistsNames = otherNames;
        } else {
            // error
        }
    }

    isaFavoriteSetlist = async () => {
        this.favoriteSetlists = await AsyncStorage.getItem(constants.favoriteSetlists);
        // console.log(this.favoriteSetlists);
        if(this.favoriteSetlists == null) {
            this.favoriteSetlists = [];
            this.setState({isFavorite: false});
        } else {
            this.favoriteSetlists = JSON.parse(this.favoriteSetlists);
            let isFavorite = false;
            for(var setlist in this.favoriteSetlists) {
                if(this.state.data.id === this.favoriteSetlists[setlist].id) {
                    isFavorite = true;
                }
            }
            this.setState({isFavorite: isFavorite});
        }
    }

    getPreferredService = async () => {
        this.prefService = await AsyncStorage.getItem(constants.local_streaming_service);
    }

    getAllTracks = async () => {
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
        let result = await this.serviceType.handleSubmit(this.playlistTracks, this.trackObjects,
                        this.state.title, this.state.isPublic, this.state.doShuffle,
                        this.state.includeOtherArtists, this.otherArtists);
        console.log(result);
        // Let user know what happened on back-end
        if(result === 'OK') {
            // popup modal or navigate to success screen
            this.addToPastPlaylists();
            this.setState({submitSuccessful: true});
        } else {
            // popup modal error? - display error description
            this.setState({submitFail: true})
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
                pastPlaylists = newPastPlaylists;
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

    toggleFavorite = async () => {
        // If this setlist is in favorites, remove
        if(this.state.isFavorite) {
            // Find this setlist in the list
            let index = 0;
            for(let i = 0; i < this.favoriteSetlists.length; i++) {
                if(this.favoriteSetlists[i].id === this.state.data.id) {
                    index = i;
                }
            }
            // Remove it
            this.favoriteSetlists.splice(index, 1);
        } else {
            this.favoriteSetlists.unshift(this.state.data);
        }
        AsyncStorage.setItem(constants.favoriteSetlists, JSON.stringify(this.favoriteSetlists));
        this.setState({isFavorite: !this.state.isFavorite});
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
                <KeyboardAvoidingView style={styles.rootContainer} behavior='padding' enabled>
                <View style={styles.rootContainer}>
                    <Overlay
                        isVisible={this.state.submitSuccessful}>
                        <Text>Success!</Text>
                        <Button
                            title='Go to Home'
                            onPress={() => navigate('App')} />
                    </Overlay>
                    <Overlay
                        isVisible={this.state.submitFail}>
                        <Text>Fail!</Text>
                        <Button
                            title='Close'
                            onPress={() => this.setState({submitFail: !this.state.submitFail})} />
                    </Overlay>
                    <ScrollView style={styles.rootContainer}>
                        <Image source={{uri: this.artistImageUrl}} style={styles.image} />
                        <Text>{data.artist.name}</Text>
                        <Text>{data.eventDate} * {data.venue.name}</Text>
                        <Text>{data.venue.city.name}, {data.venue.city.stateCode}, {data.venue.city.country.code}</Text>
                        <Button
                            title={this.state.isFavorite ? 'Remove favorite' : 'Add favorite'}
                            onPress={this.toggleFavorite} />
                        <View style={styles.separator} />
                        <Text style={styles.header}>Tracks</Text>
                        {this._renderTracks(0)}
                        <Text style={styles.header}>Encore</Text>
                        {this._renderTracks(1)}
                        <View>
                            <Text>Include other artists at this gig</Text>
                            <Switch
                                onValueChange={() => this.setState({includeOtherArtists: !this.state.includeOtherArtists})}
                                value={this.state.includeOtherArtists}/>
                        </View>
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
                </View>
                </KeyboardAvoidingView>
            )
        }
    }

    _renderTracks(set) {
        let tracks = [];
        let data = this.state.data;
        // console.log(data);

        if(data.sets.set.length > set) {
            for(var i = 0; i < data.sets.set[set].song.length; i++) {
                let name = data.sets.set[0].song[i].name;
                let disabled = !this.trackTitles.includes(name.toLowerCase());
                if(!disabled) {
                    this.playlistTracks.push(name);
                }
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
