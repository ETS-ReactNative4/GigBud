const constants = {
    first_launch: 'first_launch',
    firebase_table: 'api_keys',
    firebase_setlist_fm: 'setlist_fm',
    firebase_spotify_id: 'spotify_id',
    firebase_spotify_secret: 'spotify_secret',
    firebase_apple_music: 'apple_music',
    local_setlist_fm: 'setlist_fm_api_key',
    local_spotify_id: 'spotify_id_api_key',
    local_spotify_secret: 'spotify_secret_api_key',
    local_spotify_access_token: 'spotify_access_token',
    local_spotify_refresh_token: 'spotify_refresh_token',
    local_apple_music: 'apple_music_api_key',
    local_streaming_service: 'streaming_service',
    setlist_fm_search_artists: 'https://api.setlist.fm/rest/1.0/search/artists?artistName={0}&p=1&sort=sortName',
    setlist_fm_search_setlists: 'https://api.setlist.fm/rest/1.0/artist/{0}/setlists?p={1}',

}

export default constants;
