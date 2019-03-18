import React, { Component } from 'react';
import { FlatList, ScrollView, View, Image, Text, Button,
         ActivityIndicator, AsyncStorage } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { LinearGradient, SecureStore } from 'expo';

import SearchResultTicketButton from 'library/components/SearchResultTicketButton';
import GradientBackground from 'library/components/GradientBackground';
import Loader from 'library/components/Loader';
import { UrlFormat } from 'library/utils/functions';
import StreamingFactory from 'library/factories/StreamingFactory';
import constants from 'library/utils/constants';
import colors from 'res/colors';
import strings from 'res/strings';
import images from 'res/images';
import styles from './styles';

export default class SearchResultsScreen extends Component {
    static navigationOptions = {
        headerBackground: (
            <LinearGradient
              colors={[colors.black, colors.navyblue]}
              style={{ flex: 1, opacity: 0.85 }}
              start={[1, 0]}
              end={[0, 1]}
            />
        ),
        headerTitle: 'Search Results',
        headerTitleStyle: { color: 'white', alignSelf: 'center', textAlign: 'center' }
      };

    constructor(props) {
        super(props);
        this.artistName = this.props.navigation.getParam('searchValue', null);
        this.state = {
            isLoading: true,
            data: [],
            pageCounter: 1,
            status: 0,
            imageUrl: '',
        }

        this._isMounted = false;
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.loadData().then(() => {
            if(this._isMounted)
                this.setState({isLoading: false})
        });
    }

    loadData = async () => {
        return Promise.all([
            this.searchForArtist(),
            this.getArtistImage()
        ]);
    }

    getArtistImage = async () => {
        let prefService = await AsyncStorage.getItem(constants.local_streaming_service);
        var factory = new StreamingFactory(prefService);
        var service = factory.createService();
        let imageUrl = await service.GetImageUrl(this.artistName);
        if(this._isMounted)
            this.setState({imageUrl: imageUrl});
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
            else {
                if(this._isMounted)
                    this.setState({status: data[0]})
            }
        }
    }

    searchForSetlist = async (mbid) => {
        let api_key = await SecureStore.getItemAsync(constants.local_setlist_fm);
        var url = UrlFormat(constants.setlist_fm_search_setlists, mbid, this.state.pageCounter);
        let data = await this.doFetch(url, api_key);
        console.log(data);
        if(data[0] === 200) {
            let oldData = this.state.data;
            data[1].setlist.forEach((setlist) => oldData.push(setlist));
            if(this._isMounted)
                this.setState({data: oldData});
        } else {
            if(this._isMounted)
                this.setState({status: data[0]});
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
                <GradientBackground colors={[colors.pink, colors.navyblue]}>
                    <Loader />
                </GradientBackground>
            )
        } else {
            if(this.state.status === 404) {
                return(
                    <GradientBackground colors={[colors.pink, colors.red]}>
                        <Text style={styles.errorTitle}>Oops!</Text>
                        <Image
                            source={images.mp3error}
                            style={styles.errorImage}
                            resizeMode='contain'/>
                        <View style={styles.errorTextContainer}>
                            <Text style={styles.errorText}>
                            <Text style={styles.errorText}>Your search</Text>
                            <Text style={[styles.bold, styles.errorText]}>
                                {' ' + this.props.navigation.getParam('searchValue', null)}
                            </Text>
                            <Text style={styles.errorText}> did not return any search results!</Text>
                            </Text>
                        </View>
                    </GradientBackground>
                )
            }
            return (
                    <GradientBackground colors={[colors.pink, colors.navyblue]}>
                        <Image
                            source={{uri: this.state.imageUrl}}
                            style={styles.image}
                            resizeMode='cover' />
                        <FlatList
                            style={styles.flatlist}
                            data={this.state.data}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                this.loadMore()
                            }}
                            renderItem={({item}) => <SearchResultTicketButton data={item}/>}
                            keyExtractor={item => item.id}
                        />
                    </GradientBackground>
            )
        }
    }

    loadMore = async () => {
        if(this._isMounted)
            this.setState({pageCounter: this.state.pageCounter+1});
        this.searchForSetlist(this.state.data[0].artist.mbid);
    }

}
