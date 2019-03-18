import { AuthSession } from 'expo';
import { EncodeBase64, UrlFormat } from 'library/utils/functions';
import constants from 'library/utils/constants';

async function AuthenticateUser(id, secret, scopes) {
    let redirectUrl = AuthSession.getRedirectUrl();
    let authUrl = 'https://accounts.spotify.com/authorize?' +
            'response_type=code' +
            '&client_id='+ encodeURIComponent(id) +
            '&scope=' + encodeURIComponent(scopes) +
            '&redirect_uri=' + encodeURIComponent(redirectUrl);
    let result = await AuthSession.startAsync({
        authUrl:authUrl
    });
    if(result.type === 'success') {
        return {
            type: 'success',
            authCode: result.params.code,
            redirectUrl: redirectUrl
        };
    } else {
        return {
            type: 'error'
        }
        console.log(result.errorCode);
    }
}

async function RequestAccessTokens(authCode, id, secret, uri) {
    // Because spotify api expects x-www-form-urlencoded
    // we have to build the form body manually, can't use json
    var details = {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: uri,
    }
    var formBody = [];
    for(var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedVal = encodeURIComponent(details[property]);
        formBody.push(encodedKey + '=' + encodedVal);
    }
    formBody = formBody.join('&');

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + EncodeBase64(id + ':' + secret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody,
    })
    .then((response) => {
        if(response.status === 200) {
            return response.json();
        } else {
            throw(response.status);
        }
    })
    .then((responseJson) => {
        return {
            access_token: responseJson.access_token,
            refresh_token: responseJson.refresh_token
        };
    })
    .catch((error) => {
        console.log(error);
    })
}

async function RequestTokenFromRefresh(refreshToken, id, secret) {
    var details = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }
    var formBody = [];
    for(var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedVal = encodeURIComponent(details[property]);
        formBody.push(encodedKey + '=' + encodedVal);
    }
    formBody = formBody.join('&');

    return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + EncodeBase64(id + ':' + secret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody,
    })
    .then((response) => {
        if(response.status === 200) {
            return response.json();
        } else {
            throw(response.status);
        }
    })
    .then((responseJson) => {
        return responseJson.access_token;
    })
    .catch((error) => {
        console.log(error);
    })
}

async function SearchArtist(authToken, artist) {
    let url = UrlFormat(constants.spotify_search_artists, encodeURIComponent(artist));
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson;
    })
}

async function GetRelatedArtists(authToken, url) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then((response) => response.json())
}

async function GetArtistRecommendations(authToken, ids) {
    var artists = [];
    for(let i = 0; i < ids.length; i++) {
        let url = UrlFormat('https://api.spotify.com/v1/artists/{0}/related-artists', ids[i]);
        let data = await GetRelatedArtists(authToken, url);
        for(let j = 0; j < data.artists.length; j++) {
            artists.push({name: data.artists[j].name, genre: data.artists[j].genres[1]});
        }
    }
    return artists;
}

async function GetAlbumsFromArtist(authToken, artistID) {
    let url = UrlFormat(constants.spotify_get_albums, artistID);
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        var albums = [];
        for(var item in responseJson.items) {
            albums.push({
                name: responseJson.items[item].name,
                id: responseJson.items[item].id
            })
        }
        return albums;
    })
    .catch((error) => {console.error(error)})
}

async function GetTracksFromAlbum(authToken, albumID) {
    let url = UrlFormat(constants.spotify_get_tracks, albumID);
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
        var tracks = [];
        for(var item in responseJson.items) {
            tracks.push({
                name: responseJson.items[item].name,
                id: responseJson.items[item].id,
                duration: responseJson.items[item].duration_ms
            })
        }
        return tracks;
    })
}

async function GetUser(authToken) {
    return fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then((response) => response.json())
    .then((resJson) => {
        return resJson.id;
    })
}

async function CreatePlaylist(authToken, userID, title, pub) {
    var details = {
        name: title,
        description: 'New playlist description',
        public: pub
    }
    let url = UrlFormat('https://api.spotify.com/v1/users/{0}/playlists', userID);
    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details),
    })
    .then((response) => response.json())
    .then((responseJson) => {
        return responseJson.id;
    })
    .catch((error) => {
        console.error(error);
    })
}

async function AddSongsToPlaylist(authToken, id, tracks) {
    var uris = []
    if(tracks.length > 99) {
        for(let i = 0; i < 99; i++) {
            uris.push('spotify:track:' + tracks[i]);
        }
    }
    else {
        for(var track in tracks) {
            uris.push('spotify:track:' + tracks[track]);
        }
    }
    formBody = 'uris=' + uris;

    let url = UrlFormat('https://api.spotify.com/v1/playlists/{0}/tracks', id);
    return fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({uris: uris})
    })
    .then((response) => response.json())
    .then((resJson) => {
        console.log(resJson);
        return resJson;
    })
    .catch((error) => {
        console.error(error);
        return error;
    })
}



export {
    AuthenticateUser,
    RequestAccessTokens,
    RequestTokenFromRefresh,
    SearchArtist,
    GetAlbumsFromArtist,
    GetTracksFromAlbum,
    GetUser,
    CreatePlaylist,
    AddSongsToPlaylist,
    GetArtistRecommendations
};
