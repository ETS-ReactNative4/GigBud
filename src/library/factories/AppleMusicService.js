import constants from 'utils/constants';
import { GetJWT } from 'utils/functions';
import { SecureStore } from 'expo';

export default class AppleMusicService {
    constructor() {

    }

    async storeTokens(tokens) {

    }

    async authenticateUser() {
        // Get jwt from firebase functions
        var json = GetJWT();
        let jwtToken = json.token;
        let iat = json.iat;

        // Store token and iat
        // Store iat so that firebase functions don't have to be
        // called every time, some calculations can be done
        // token expires in 7 days

        // Get store front of user and store that info

        console.log('apple music - authenticate user');
        return {
            type: 'error',
            description: 'errorrrr'
        }
    }

    async getAllTracks() {

    }

    async handleSubmit(playlistTracks, trackObjects, title, visibility, shuffle) {

    }
}
