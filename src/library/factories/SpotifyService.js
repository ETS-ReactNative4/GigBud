import {
	RequestTokenFromRefresh, SearchArtist,
	GetAlbumsFromArtist, GetTracksFromAlbum,
	CreatePlaylist, AddSongsToPlaylist, GetUser,
	AuthenticateUser, RequestAccessTokens
} from 'utils/Spotify';
import constants from 'utils/constants';
import { SecureStore } from 'expo';
import { AsyncStorage } from 'react-native';

export default class SpotifyService {
	constructor() {
		this.refreshToken = '';
		this.id = '';
		this.secret = '';
		this.artistImageUrl = '';
	}

	async storeTokens(tokens) {
		SecureStore.setItemAsync(constants.local_spotify_access_token,
            tokens.access_token);
        SecureStore.setItemAsync(constants.local_spotify_refresh_token,
            tokens.refresh_token);
        AsyncStorage.setItem(constants.local_streaming_service, 'spotify');
        AsyncStorage.setItem(constants.isLoggedIn, 'true');
	}

	async authenticateUser() {
		id = await SecureStore.getItemAsync(constants.local_spotify_id);
		secret = await SecureStore.getItemAsync(constants.local_spotify_secret);
		let scopes = 'playlist-modify-private playlist-modify-public';
		let result = await AuthenticateUser(id, secret, scopes);
		if(result.type === 'success') {
			let tokens = await RequestAccessTokens(result.authCode, id, secret, result.redirectUrl);
			this.storeTokens(tokens);
			return {type: 'success'};
		} else {
			return {type: 'error', description: 'description'};
		}
	}

	async getTokensFromStorage() {
		return Promise.all([
			SecureStore.getItemAsync(constants.local_spotify_refresh_token),
			SecureStore.getItemAsync(constants.local_spotify_id),
			SecureStore.getItemAsync(constants.local_spotify_secret)
		]);
	}

	async getAllTracks(artistName) {
		// Retrieve tokens from storage
		let p = await this.getTokensFromStorage();
		this.refreshToken = p[0];
        this.id = p[1];
        this.secret = p[2];
        // Get access token from the refresh token
        let token = await RequestTokenFromRefresh(this.refreshToken, this.id, this.secret);
        // Get artist details
        let artist = await SearchArtist(token, artistName);
        this.artistImageUrl = artist.artists.items[0].images[1].url;
        // Get albums details
        let albums = await GetAlbumsFromArtist(token, artist.artists.items[0].id);
        // Get songs details
        trackObjects = [];
        trackTitles = [];
        for(var album in albums) {
            let tracksResult = await GetTracksFromAlbum(token, albums[album].id);
            for(var track in tracksResult) {
                trackObjects.push(tracksResult[track]);
                trackTitles.push(tracksResult[track].name.toLowerCase());
            }
        }
        // Return status, track details, track titles, and image url
        return ['OK', trackObjects, trackTitles, this.artistImageUrl];
	}

	// Shuffles an array and returns the result
	// could possibly put this in utils/functions.js
	shuffle(a) {
		for(let i = a.length-1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i+1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	async handleSubmit(playlistTracks, trackObjects, title, isPublic, doShuffle) {
		// Get track IDs
		var trackIDs = [];
        for(var song in playlistTracks) {
            for(var track in trackObjects) {
                if(playlistTracks[song].toLowerCase() === trackObjects[track].name.toLowerCase()) {
                    trackIDs.push(trackObjects[track].id);
                    break;
                }
            }
        }
        // Shuffle IDs if user wants
        if(doShuffle)
        	trackIDs = this.shuffle(trackIDs);
        // Get access token from refresh
        let token = await RequestTokenFromRefresh(this.refreshToken, this.id, this.secret);
        // Get user profile
        let userID = await GetUser(token);
        // Create empty playlist
        let playlistID = await CreatePlaylist(token, userID, title, isPublic);
        // Add all songs to the new empty playlist
        AddSongsToPlaylist(token, playlistID, trackIDs).then(() => {
        	return ['OK'];
        });
	}
}
