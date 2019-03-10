import React, { Component } from 'react';
import { View, Image, Text, Button, ActivityIndicator,
         AsyncStorage, FlatList, ScrollView } from 'react-native';
import { LinearGradient } from 'expo';

import GradientBackground from 'library/components/GradientBackground';
import SearchResultTicketButton from 'library/components/SearchResultTicketButton';
import Loader from 'library/components/Loader';
import constants from 'library/utils/constants';
import colors from 'res/colors';
import styles from './styles';

export default class FavoritesScreen extends Component {
    static navigationOptions = {
        headerBackground: (
            <LinearGradient
                colors={[colors.black, colors.navyblue]}
                style={{ flex: 1, opacity: 0.85}}
                start={[1, 0]}
                end={[0, 1]}
            />
        ),
        headerTitle: 'Favorites',
        headerTitleStyle: { flex: 1, color: 'white', textAlign: 'center' }
    };

    constructor(props) {
        super(props);
        this.state = {isLoading: true, favoriteSetlists: []};

        this._isMounted = false;
    }

    componentWillMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this.getFavoriteSetlists().then(() => {
            if(this._isMounted)
                this.setState({isLoading: false});
        });
    }

    getFavoriteSetlists = async () => {
        let setlists = await AsyncStorage.getItem(constants.favoriteSetlists);
        if(setlists != null) {
            if(this._isMounted)
                this.setState({favoriteSetlists: JSON.parse(setlists)});
        } else {
            this.setlists = [];
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        if(this.state.isLoading) {
            return (
                <GradientBackground colors={[colors.pink, colors.navyblue]}>
                    <Loader />
                </GradientBackground>
            )
        }

        return (
            <GradientBackground colors={[colors.pink, colors.navyblue]}>
                <ScrollView>
                    <Text style={styles.title}>Setlists you love</Text>
                    <FlatList
                        style={styles.flatlist}
                        data={this.state.favoriteSetlists}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                            this.loadMore()
                        }}
                        renderItem={({item}) =>
                            <SearchResultTicketButton data={item} />
                        }
                    />
                </ScrollView>
            </GradientBackground>
        )
    }

    loadMore = async () => {
        return null;
    }
}
