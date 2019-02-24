import React, { Component } from 'react';
import { View, Image, Text, Button, ActivityIndicator,
         AsyncStorage } from 'react-native';

import SearchResultTicketButton from 'library/components/SearchResultTicketButton';
import constants from 'library/utils/constants';
import colors from 'res/colors';

export default class FavoritesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true};
    }

    componentDidMount() {
        this.getFavoriteSetlists().then(() => {
            this.setState({isLoading: false});
        });
    }

    getFavoriteSetlists = async () => {
        let setlists = await AsyncStorage.getItem(constants.favoriteSetlists);
        if(setlists != null) {
            this.setlists = JSON.parse(setlists);
        } else {
            this.setlists = [];
        }
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

        return (
            <View>
                <Text>Favorites screen</Text>
                <Button
                    title="Go to home"
                    onPress={() => navigate('Home')}
                />
                {this._renderFavorites()}
            </View>
        );
    }

    _renderFavorites() {
        // TODO: render SearchResultTicketButton for each setlist
        let setlists = [];
        for(var i = 0; i < this.setlists.length; i++) {
            setlists.push(
                <SearchResultTicketButton
                    key={'row-' + i}
                    data={this.setlists[i]} />
            );
        }
        return setlists;
    }
}
