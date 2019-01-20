import AuthScreen from 'screens/Auth/AuthScreen';
import HomeScreen from 'screens/Home/HomeScreen';
import ProfileScreen from 'screens/Profile/ProfileScreen';
import FavoritesScreen from 'screens/Favorites/FavoritesScreen';
import SearchResultScreen from 'screens/SearchResult/SearchResultScreen';
import CreatePlaylistScreen from 'screens/CreatePlaylist/CreatePlaylistScreen';
import firebase from 'utils/firebase';
import Store from 'utils/Store';

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

    checkIfLaunched = () => {
        AsyncStorage.getItem('alreadyLaunched').then(value => {
            console.log(value);
            value = 'false'
            if(value === 'true') {
                 this.props.navigation.navigate('App');
            } else {
                this.getAndStoreApiKey('setlist_fm')
                    // .then(this.getAndStoreApiKey('spotify'))
                    // .then(this.getAndStoreApiKey('apple_music'))
                    .then(() => {
                        AsyncStorage.setItem('alreadyLaunched', 'true');
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
        var setlistRef = db.collection('api_keys').doc(keyName);
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
