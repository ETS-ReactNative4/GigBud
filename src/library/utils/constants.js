const constants = {
    first_launch: 'first_launch',
    firebase_table: 'api_keys',
    firebase_setlist_fm: 'setlist_fm',
    firebase_spotify: 'spotify',
    firebase_apple_music: 'apple_music',
    local_setlist_fm: 'setlist_fm_api_key',
    local_spotify: 'spotify_api_key',
    local_apple_music: 'apple_music_api_key',
    local_streaming_service: 'streaming_service',
    setlist_fm_search_artists: 'https://api.setlist.fm/rest/1.0/search/artists?artistName={0}&p=1&sort=sortName',
    setlist_fm_search_setlists: 'https://api.setlist.fm/rest/1.0/artist/{0}/setlists?p={1}',

}

export default constants;
