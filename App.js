import AuthScreen from 'screens/Auth/AuthScreen';
import HomeScreen from 'screens/Home/HomeScreen';
import ProfileScreen from 'screens/Profile/ProfileScreen';
import FavoritesScreen from 'screens/Favorites/FavoritesScreen';
import SearchResultScreen from 'screens/SearchResult/SearchResultScreen';
import CreatePlaylistScreen from 'screens/CreatePlaylist/CreatePlaylistScreen';
import ErrorScreen from 'screens/Error/ErrorScreen';
import firebase from './src/library/utils/firebase';
import constants from 'library/utils/constants';
import colors from 'res/colors';

import React from 'react';
import { AppRegistry, AsyncStorage, View } from 'react-native';
import {
    createSwitchNavigator, createStackNavigator,
    createBottomTabNavigator, createAppContainer,
    createMaterialBottomTabNavigator
} from 'react-navigation';
import { Font, SecureStore, LinearGradient } from 'expo';
import { FontAwesome } from '@expo/vector-icons';

import fonts from 'res/fonts';

class InitialCheckScreen extends React.Component {
    constructor(props) {
        super(props);
        Font.loadAsync({
            'bad-script-regular': fonts.badScript
        })
        .then(() => this.checkIfLaunched());
    }

    checkIfLaunched = async () => {
        AsyncStorage.getItem(constants.isLoggedIn).then((value) => {
            // console.log(value);
            //value = 'false'
            if(value === 'true') {
                 this.props.navigation.navigate('App');
            } else {
                this.getAndStoreApiKey(constants.firebase_setlist_fm)
                    .then(this.getAndStoreApiKey(constants.firebase_spotify_id))
                    .then(this.getAndStoreApiKey(constants.firebase_spotify_secret))
                    // .then(this.getAndStoreApiKey(constants.firebase_apple_music))
                    .then(() => {
                        this.props.navigation.navigate('Auth');
                    })
                    .catch((error) => {
                        console.log(error);
                        throw error;
                    });
            }
        });
    }

    getAndStoreApiKey = async (keyName) => {
        var db = firebase.firestore();
        var setlistRef = db.collection(constants.firebase_table).doc(keyName);
        setlistRef.get().then((doc) => {
            if(doc.exists) {
                let data = doc.data();
                let key = data.key;
                var storeKey = keyName + '_api_key';
                SecureStore.setItemAsync(storeKey, key)
                    .catch((error) => {
                        console.log(error);
                        throw error;
                    });
            } else {
                throw 'Error getting ' + keyName + ' doc.';
            }
        }).catch((error) => {
            console.log(error);
            throw error;
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
        CreatePlaylist: CreatePlaylistScreen,
        Error: ErrorScreen,
    },
    {
        initialRouteName: 'Home',
    }
)

const FavoriteStack = createStackNavigator(
    {
        Favorites: FavoritesScreen
    },
    {
        initialRouteName: 'Favorites'
    }
)

const ProfileStack = createStackNavigator(
    {
        Profile: ProfileScreen
    },
    {
        initialRouteName: 'Profile'
    }
)

const AppStack = createBottomTabNavigator(
    {
        Home: SearchStack,
        Favorites: FavoriteStack,
        Profile: ProfileStack,
    },
    {
        tabBarOptions: {
            activeBackgroundColor: 'grey',
            inactiveBackgroundColor: colors.black,
            activeTintColor: colors.white,
            inactiveTintColor: colors.white,
        },
        initialRouteName: 'Home'
    }
);
// const AppStack = createMaterialBottomTabNavigator(
//     {
//         Home: SearchStack,
//         Favorites: FavoriteStack,
//         Profile: ProfileStack,
//     },
//     {
//         initialRouteName: 'Home',
//         activeColor: 'grey',
//         inactiveColor: colors.black,
//     }
// )

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
