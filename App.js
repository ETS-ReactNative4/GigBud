import AuthScreen from 'screens/Auth/AuthScreen';
import HomeScreen from 'screens/Home/HomeScreen';
import ProfileScreen from 'screens/Profile/ProfileScreen';
import FavoritesScreen from 'screens/Favorites/FavoritesScreen';
import SearchResultScreen from 'screens/SearchResult/SearchResultScreen';
import CreatePlaylistScreen from 'screens/CreatePlaylist/CreatePlaylistScreen';
import firebase from 'utils/firebase';
import constants from 'library/utils/constants';

import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import {
    createSwitchNavigator, createStackNavigator,
    createBottomTabNavigator, createAppContainer
} from 'react-navigation';
import { SecureStore } from 'expo';


class InitialCheckScreen extends React.Component {
    constructor() {
        super();
        this.checkIfLaunched()
    }

    checkIfLaunched = async () => {
        AsyncStorage.getItem(constants.first_launch).then((value) => {
            // console.log(value);
            value = 'true'
            if(value === 'false') {
                 this.props.navigation.navigate('App');
            } else {
                this.getAndStoreApiKey(constants.firebase_setlist_fm)
                    // .then(this.getAndStoreApiKey(constants.firebase_spotify))
                    // .then(this.getAndStoreApiKey(constants.firebase_apple_music))
                    .then(() => {
                        AsyncStorage.setItem(constants.first_launch, 'false');
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
