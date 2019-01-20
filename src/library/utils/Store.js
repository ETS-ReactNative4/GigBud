// // Usage: 
// import Store from 'utils/Store';
// ...
// let obj = {
//     something: 'hello world'
// }
//
// Store('key', obj) // Stores the object as a string
// let data = Store('key') // Gets the stringified value out of storage
//                         // Use JSON stringify reversing

import Expo from 'expo'

const Store = async (key: string, value?: Object) => {
    let json = '';

    if('object' == typeof value) {
        Expo.SecureStore.setItemAsync(key, JSON.stringify(value));
    } else {
        json = await Expo.SecureStore.getItemAsync(key);
        return json;
    }
}

export default Store;
