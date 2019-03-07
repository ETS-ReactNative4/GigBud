import React, { Component } from 'react';
import {
    View, Image, Text, Button, TextInput, AsyncStorage,
    ScrollView, FlatList, ActivityIndicator
} from 'react-native';
import { Header, SearchBar } from 'react-native-elements';
import { LinearGradient } from 'expo';
import {createDrawerNavigator, createAppContainer} from 'react-navigation';

import SearchResultTicketButton from 'library/components/SearchResultTicketButton';
import styles from './styles';
import constants from 'utils/constants';
import colors from 'res/colors';
import strings from 'res/strings';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {isLoading: true, pastPlaylists: [], search: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getPastPlaylists();
    }

    getPastPlaylists = async () => {
        let p = await AsyncStorage.getItem(constants.pastPlaylists);
        console.log(JSON.parse(p));
        if(p != null) {
            this.setState({isLoading: false, pastPlaylists: JSON.parse(p)});
        } else {
            this.setState({isLoading: false});
        }
    }

    handleChange(text) {
        this.setState({search: text});
    }

    handleSubmit(event) {
        if(this.state.search.trim() === '') {
            // alert
        } else {
            this.props.navigation.navigate('Results', {
                searchValue: this.state.search
            });
        }
    }

    render() {
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
                <LinearGradient
                    colors={[colors.pink, colors.navyblue]}
                    style={styles.gradientContainer}
                    start={[1, 0]}
                    end={[0, 1]}>
                    <ScrollView style={styles.scrollContainer}>
                        <SearchBar
                            containerStyle={styles.searchContainer}
                            placeholder={strings.searchPlaceholder}
                            onChangeText={this.handleChange}
                            value={this.state.search}
                            onSubmitEditing={this.handleSubmit}
                        />
                        <FlatList
                            style={styles.flatlist}
                            data={this.state.pastPlaylists}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                this.loadMore()
                            }}
                            renderItem={({item}) => <SearchResultTicketButton data={item}/>}
                        />
                    </ScrollView>
                </LinearGradient>
            </View>
        )
    }

    loadMore = async () => {
        return null;
    }
}
