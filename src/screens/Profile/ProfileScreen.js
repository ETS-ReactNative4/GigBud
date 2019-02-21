import React, { Component } from 'react';
import {
    View, Image, Text, Button, AsyncStorage,
    ActivityIndicator
} from 'react-native';
import SearchResultTicketButton from 'library/components/SearchResultTicketButton';

import StreamingFactory from 'library/factories/StreamingFactory';
import constants from 'utils/constants';
import colors from 'res/colors';
import styles from './styles';

export default class ProfileScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {isLoading: true, pastPlaylists: []};
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.loadThings();
    }

    loadThings = async () => {
        this.getPastPlaylists()
        .then(() => this.getArtistRecommendations())
        .then(() => this.setState({isLoading: false}));
    }

    hasBeenLongerThanADay = async () => {
        let result = false;
        let time = await AsyncStorage.getItem('artistRecsTimeStamp');
        if(time != null) {
            let timeNow = Date.now() / 1000; // seconds since UNIX epoch
            if((timeNow - parseInt(time)) < 86,400) { // (60 secs)*(60 mins)*(24 hr)
                result = false;
            } else {
                result = true;
            }
        } else {
            result = true;
        }
        return result;
    }

    getArtistRecommendations = async () => {
        // Get 3 artist suggestions based on 3 recent playlists
        // Generate random index number, add that artist to list to render
        // Add time stamp to storage to only do once per day
        let hasBeenLongerThanADay = await this.hasBeenLongerThanADay();

        if(hasBeenLongerThanADay) {
            // Generate new recs
            let factory = new StreamingFactory(this.prefService);
            let serviceType = factory.createService();
            let artistNames = [];
            // Get 3 most recent playlists
            var i = 0;
            while(i < this.state.pastPlaylists.length && i < 3) {
                artistNames.push(this.state.pastPlaylists[i].artist.name);
                i++;
            }
            // Get related artists
            // [{name: artistName, genre: genre}]
            let recommendations = await serviceType.getRecommendations(artistNames);
            // Get 3 random artists
            let actualRecs = [];
            for(let j = 0; j < 3; j++) {
                let rand = Math.floor(Math.random() * recommendations.length);
                actualRecs.push(recommendations[rand]);
                recommendations.splice(rand, 1);
            }
            // Save timestamp and artist recommendations to storage
            AsyncStorage.setItem('artistRecsTimeStamp', (Date.now()).toString());
            AsyncStorage.setItem('pastArtistRecommendations', JSON.stringify(actualRecs));
            this.setState({recommendations: actualRecs});
        } else {
            // use past recs
            let pastRecs = await AsyncStorage.getItem('pastArtistRecommendations');
            this.setState({recommendations: JSON.parse(pastRecs)});
        }
    }

    getPastPlaylists = async () => {
        this.prefService = await AsyncStorage.getItem(constants.local_streaming_service);
        let p = await AsyncStorage.getItem(constants.pastPlaylists);
        if(p != null) {
            this.setState({pastPlaylists: JSON.parse(p)});
        }
    }

    logout = async () => {
        AsyncStorage.setItem(constants.isLoggedIn, 'false');
        this.props.navigation.navigate('Initial');
    }

    render() {
        const {navigate} = this.props.navigation;
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
            <View style={styles.rootContainer}>

                <Text>Profile screen</Text>

                <Button
                    title="Logout"
                    onPress={this.logout} />

                <View style={styles.parent}>
                    {this._renderRecentPlaylists()}
                </View>
                <View style={styles.parent}>
                    {this._renderArtistSuggestions()}
                </View>
            </View>
        );
    }

    _renderRecentPlaylists() {
        let playlists = []
        let pastPlaylists = this.state.pastPlaylists;
        var i = 0;
        while(i < pastPlaylists.length && i < 3) {
            playlists.push(
                <SearchResultTicketButton
                    key={'playlist-' + i}
                    data={pastPlaylists[i]} />
            );
            i++;
        }
        return playlists;
    }

    _renderArtistSuggestions() {
        let recommendations = this.state.recommendations;
        let recs = [];
        recs.push(<Text key={'recs-' + 0}>{recommendations[0].name} -- {recommendations[0].genre}</Text>);
        recs.push(<Text key={'recs-' + 1}>{recommendations[1].name} -- {recommendations[1].genre}</Text>);
        recs.push(<Text key={'recs-' + 2}>{recommendations[2].name} -- {recommendations[2].genre}</Text>);
        return recs;
    }
}
