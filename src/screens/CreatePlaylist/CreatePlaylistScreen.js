import React, { Component } from 'react';
import { ScrollView, View, Image, Text, Switch, TextInput,
         ActivityIndicator, AsyncStorage, Modal,
         KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { LinearGradient, SecureStore } from 'expo';
import { FontAwesome } from '@expo/vector-icons';
import { Overlay, Button } from 'react-native-elements';

import colors from 'res/colors';
import constants from 'library/utils/constants';
import GradientBackground from 'library/components/GradientBackground';
import Loader from 'library/components/Loader';
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
            submitLoading: false,
            submitSuccessful: false,
            submitFail: false
        }

        this._isMounted = false;
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Gets the factory for the service the user is using
    // gets tracks and other artists data
    componentDidMount() {
        this.getPreferredService().then(() => {
            var factory = new StreamingFactory(this.prefService);
            this.serviceType = factory.createService();
            this.getAllTracks();
            this.getOtherArtists();
        });
        this.isaFavoriteSetlist();
    }

    // Gets all other artists that played at the same concert
    // as the given artist
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

    // Checks to see if this setlist is a favorited setlist
    isaFavoriteSetlist = async () => {
        this.favoriteSetlists = await AsyncStorage.getItem(constants.favoriteSetlists);
        // console.log(this.favoriteSetlists);
        if(this.favoriteSetlists == null) {
            this.favoriteSetlists = [];
            if(this._isMounted)
                this.setState({isFavorite: false});
        } else {
            this.favoriteSetlists = JSON.parse(this.favoriteSetlists);
            let isFavorite = false;
            for(var setlist in this.favoriteSetlists) {
                if(this.state.data.id === this.favoriteSetlists[setlist].id) {
                    isFavorite = true;
                }
            }
            if(this._isMounted)
                this.setState({isFavorite: isFavorite});
        }
    }

    // Gets the preferred streaming service of the user
    getPreferredService = async () => {
        this.prefService = await AsyncStorage.getItem(constants.local_streaming_service);
    }

    // Gets all tracks of this concert
    getAllTracks = async () => {
        let result = await this.serviceType.getAllTracks(this.state.data.artist.name);
        // Assign things with the result
        if(result[0] === 'OK') {
            this.trackObjects = result[1];
            this.trackTitles = result[2];
            this.artistImageUrl = result[3];
            if(this._isMounted)
                this.setState({isLoading: false});
        } else {
            console.error('Error getting all tracks');
            // error
        }
    }

    // Logic for creating a playlist when the button is pressed
    handleSubmit = async () => {
        if(this._isMounted)
            this.setState({submitLoading: true})
        let result = await this.serviceType.handleSubmit(this.playlistTracks, this.trackObjects,
                        this.state.title, this.state.isPublic, this.state.doShuffle,
                        this.state.includeOtherArtists, this.otherArtists);
        console.log(result);
        // Let user know what happened on back-end
        if(result === 'OK') {
            // popup modal or navigate to success screen
            this.addToPastPlaylists();
            if(this._isMounted)
                this.setState({submitSuccessful: true, submitLoading: false});
        } else {
            // popup modal error? - display error description
            if(this._isMounted)
                this.setState({submitFail: true, submitLoading: false})
        }
        this.props.navigation.navigate('App');
    }

    // Adds this playlist to the history of playlists a user has created
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

    // Toggles whether this setlist is a favorited setlist or not
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
        if(this._isMounted)
            this.setState({isFavorite: !this.state.isFavorite});
    }

    render() {
        const {navigate} = this.props.navigation;
        const data = this.state.data;
        this.playlistTracks = [];
        if(this.state.isLoading) {
            return (
                <GradientBackground colors={[colors.pink, colors.navyblue]}>
                    <Loader />
                </GradientBackground>
            )
        } else {
            return (
                <GradientBackground colors={[colors.pink, colors.navyblue]}>

                    <View style={styles.rootContainer}>
                    <KeyboardAvoidingView style={styles.rootContainer}
                        keyboardVerticalOffset={100} behavior='padding' enabled>
                        <Overlay
                            isVisible={this.state.submitLoading}
                            height='25%' >
                            <Loader />
                        </Overlay>
                        <Overlay
                            isVisible={this.state.submitSuccessful}
                            height='25%' >
                            <View style={styles.submitOverlayContainer}>
                                <Text style={styles.overlayText}>Success!</Text>
                                <Text style={styles.overlayText}>Your playlist has been made!</Text>
                                <Button
                                    title='Go to Home'
                                    onPress={() => navigate('Home')} />
                            </View>
                        </Overlay>
                        <Overlay
                            isVisible={this.state.submitFail}
                            height='25%' >
                            <View style={styles.submitOverlayContainer}>
                                <Text style={styles.overlayText}>An error has occurred!</Text>
                                <Text style={styles.overlayText}>Please try again.</Text>
                                <Button
                                    title='Close'
                                    onPress={() => this.setState({submitFail: !this.state.submitFail})} />
                            </View>
                        </Overlay>
                        <Image
                            source={{uri: this.artistImageUrl}}
                            style={styles.image}
                            resizeMode='cover' />
                        <View style={styles.underImageContainer}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.artistName}>{data.artist.name}</Text>
                                <Text style={styles.venue}>{data.eventDate} * {data.venue.name}</Text>
                                <Text style={styles.location}>{data.venue.city.name}, {data.venue.city.stateCode}, {data.venue.city.country.code}</Text>
                            </View>
                            <Button
                                title=''
                                icon={!this.state.isFavorite ?
                                    <FontAwesome name='star-o' size={30} color='white' />
                                    : <FontAwesome name='star' size={30} color='yellow' />
                                }
                                onPress={this.toggleFavorite}
                                style={styles.favoriteButton}
                                type='clear' />
                        </View>
                        <View style={styles.separator} />

                        <ScrollView style={styles.scrollContainer}
                            contentContainerStyle={styles.scrollContent}
                            keyboardDismissMode='on-drag'>
                            <View style={styles.tracksContainer}>
                                <Text style={styles.header}>Tracks</Text>
                                {this._renderTracks(0)}
                                <Text style={styles.header}>Encore</Text>
                                {this._renderTracks(1)}
                            </View>
                            <View style={styles.optionsContainer}>
                                <View style={styles.otherArtistsContainer}>
                                    <Text style={[styles.otherArtistsLabel, styles.optionsHeader]}>Include other artists at this gig</Text>
                                    <Switch
                                        onValueChange={() => this.setState({includeOtherArtists: !this.state.includeOtherArtists})}
                                        value={this.state.includeOtherArtists}/>
                                </View>
                                <View style={styles.visibilityContainer}>
                                    <Text style={[styles.publicLabel, styles.optionsHeader]}>Public</Text>
                                    <Switch
                                        onValueChange={() => this.setState({isPublic: !this.state.isPublic})}
                                        value={this.state.isPublic}/>
                                    <Text style={[styles.privateLabel, styles.optionsHeader]}>Private</Text>
                                </View>
                                <View style={styles.shuffleContainer}>
                                    <Text style={[styles.optionsHeader, styles.shuffleLabel]}>Shuffle</Text>
                                    <Switch
                                        onValueChange={() => this.setState({doShuffle: !this.state.doShuffle})}
                                        value={this.state.doShuffle}/>
                                </View>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.inputLabel}>Title</Text>
                                    <TextInput
                                        underlineColorAndroid='transparent'
                                        placeholder='Playlist title...'
                                        onChangeText={(text) => this.setState({title: text})}
                                        style={styles.titleInput} />
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={this.handleSubmit}
                                style={styles.createPlaylistButton}>
                                <LinearGradient
                                    colors={[colors.teal, colors.seafoam]}
                                    style={styles.buttonGradient}
                                    start={[1, 0]}
                                    end={[0, 1]}>
                                        <Text style={styles.createPlaylistText}>Create Playlist</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </ScrollView>
                        </KeyboardAvoidingView>
                    </View>

                </GradientBackground>
            )
        }
    }

    // Renders list of playlist tracks
    // set them as disabled if not on the streaming service
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
                        style={[styles.track, disabled ? styles.disabledTrack : styles.enabledTrack]}>{i+1}. {name}</Text>
                );
            }
        }

        return tracks;
    }

}
