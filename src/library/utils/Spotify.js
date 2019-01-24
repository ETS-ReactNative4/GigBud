import { AuthSession } from 'expo';
import { EncodeBase64 } from 'library/utils/functions';

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



export {
    AuthenticateUser,
    RequestAccessTokens,
    RequestTokenFromRefresh,
};
