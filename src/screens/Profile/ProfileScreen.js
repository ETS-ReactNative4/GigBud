import React, { Component } from 'react';
import {
    View, Image, Text, Button, AsyncStorage,
    ActivityIndicator
} from 'react-native';
import SearchResultTicketButton from 'library/components/SearchResultTicketButton';

import StreamingFactory from 'library/factories/StreamingFactory';
import constants from 'utils/constants';
import colors from 'res/colors';

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

    getArtistRecommendations = async () => {
        // Get 3 artist suggestions based on 3 recent playlists
        // maybe something like get all recommendations for each
        // then count up if any appear more than once
        // suggest the highest ones, otherwise random
        let factory = new StreamingFactory(this.prefService);
        let serviceType = factory.createService();
        let pastPlaylists = this.state.pastPlaylists;
        let artistNames = [];
        var i = 0;
        while(i < pastPlaylists.length && i < 3) {
            artistNames.push(pastPlaylists[i].artist.name);
            i++;
        }
        // [{name: artistName, genre: genre}]
        let recommendations = await serviceType.getRecommendations(artistNames);
        this.setState({recommendations: recommendations});
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
            <View>

                <Text>Profile screen</Text>

                <Button
                    title="Logout"
                    onPress={this.logout} />

                <View>
                    {this._renderRecentPlaylists()}
                </View>
                <View>
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
