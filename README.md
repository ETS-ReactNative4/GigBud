# GigBud

## Description
GigBud is a mobile application that allows users to sign into their preferred streaming service and begin saving playlists from their favorite artist's recent setlists. GigBud uses setlist.fm to search for recent playlists from an artist and then uses the api of the preferred streaming service to save the songs into a single playlist on the user's account.

## Flow
On initial use, a user will choose a streaming service to login to. On all other app loads, this preference will be saved. A user will search for an artist. The recent setlists from setlist.fm will be displayed to the user. The user will choose one of the setlists and a form for creating a playlist from the tracks will be displayed. After filling out the fields, the user will press the button to create the playlist and the playlist will be added to their account on the streaming service.

## UI Mockups
Please look at the mockups.pdf to see the UI mockups.

## Codebase
1. src/library
  -Components: Re-usable React UI components
  -Factories: Collection of classes that follow the factory design pattern
  -Utils: Collection of classes that have re-usable functions
2. src/res
  -UI constants, i.e. strings, colors, images, etc.
3. src/screens
  -React Native components that are each screen of the app

## Problems in Development
Apple Music. Apple requires you to generate your own developer token with the ES236 crypto algorithm. This developer token can be used to query general information about the Apple Music catalog. However, in order to get information about a user or add things to their account (playlists), you also need to use either the MusicKit or StoreKit libraries provided by Apple to obtain a user token. MusicKit is a browser-based js library and StoreKit is a Swift library. Neither of these are compatible with React Native, my development environment. My best option would be to use StoreKit, but that would require me to re-write several parts of my current code in native code, rather than the current js. 
