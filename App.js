import AuthScreen from 'screens/Auth/AuthScreen';
import HomeScreen from 'screens/Home/HomeScreen';
import ProfileScreen from 'screens/Profile/ProfileScreen';
import FavoritesScreen from 'screens/Favorites/FavoritesScreen';
import SearchResultScreen from 'screens/SearchResult/SearchResultScreen';
import CreatePlaylistScreen from 'screens/CreatePlaylist/CreatePlaylistScreen';
import firebase from 'utils/firebase';

import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import {
    createSwitchNavigator, createStackNavigator,
    createBottomTabNavigator, createAppContainer
} from 'react-navigation';
import Expo from 'expo';


class InitialCheckScreen extends React.Component {
    constructor() {
        super();
        this.checkIfLaunched()
    }

    checkIfLaunched = async () => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
            console.log(value);
            /// value = 'false'
            if(value === 'true') {
                this.props.navigation.navigate('App');
            } else {
                // Load api keys from firebase
                var db = firebase.firestore();
                var settings = {timestampsInSnapshots: true};
                db.settings(settings);
                var setlistRef = db.collection('api_keys').doc('setlist_fm');
                setlistRef.get().then(function(doc) {
                    if (doc.exists) {
                        console.log('setlist_fm data: ' + doc.data());
                        // Look at console to see how it comes back
                        // Store with SecureStore
                        // Expo.SecureStore.setItemAsync('setlist_fm_key', key);
                    } else {
                        console.log('no setlist_fm doc');
                    }
                }).catch(function(error) {
                    console.log('error getting setlist_fm doc: ', error);
                });
                // ** Repeat for spotify and apple music
                // Navigate to Auth screen
                AsyncStorage.setItem('alreadyLaunched', 'true');
                this.props.navigation.navigate('Auth');
            }
        });
    }

    render() {
        return null;
    }
}

const SearchStack = createStackNavigator(
    {
        Home: HomeScreen,
        Results: SearchResultScreen,
        CreatePlaylist: CreatePlaylistScreen
    },
    {
        initialRouteName: 'Home'
    }
)

const AppStack = createBottomTabNavigator(
    {
        Home: SearchStack,
        Favorites: FavoritesScreen,
        Profile: ProfileScreen,
    },
    {
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        }
    }

);

const AuthStack = createStackNavigator({
    SignIn: AuthScreen
});

const AppContainer = createAppContainer(createSwitchNavigator(
    {
        Initial: InitialCheckScreen,
        App: AppStack,
        Auth: AuthScreen
    },
    {
        initialRouteName: 'Initial'
    }
));

export default AppContainer;
AppRegistry.registerComponent('main', () => AppContainer)
