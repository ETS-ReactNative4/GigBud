import { StyleSheet } from 'react-native';
import colors from 'res/colors';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    image: {
        marginTop: '5%',
        height: '25%',
        width: '85%',
        alignSelf: 'center',
        borderRadius: 5,
    },
    underImageContainer: {
        flexDirection: 'row',
        width: '85%',
        alignSelf: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    artistName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    venue: {
        color: 'white',
        fontSize: 14,
    },
    location: {
        color: 'white',
        fontSize: 14,
    },
    favoriteButton: {
        flex: 1,
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        width: '100%',
        marginTop: '3%',
        marginBottom: '3%',
    },
    scrollContainer: {
        flex: 1,
        height: '100%',
        width: '85%',
        alignSelf: 'center',
        marginBottom: '5%',
        // justifyContent: 'space-between',
    },
    scrollContent: {
        // alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    tracksContainer: {
        backgroundColor: 'rgba(55, 59, 68, 0.5)',
        borderRadius: 10,
        padding: '3%',
        // marginTop: '5%',
    },
    header: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    track: {
        color: 'white',
        marginLeft: '4%',
    },
    disabledTrack: {
        opacity: 0.5,
    },
    enabledTrack: {
        opacity: 1
    },
    optionsContainer: {
        backgroundColor: 'rgba(55, 59, 68, 0.5)',
        borderRadius: 10,
        padding: '3%',
        marginTop: 15
    },
    optionsHeader: {
        color: 'white',
        fontSize: 16,
    },
    otherArtistsContainer: {
        flexDirection: 'row',
    },
    otherArtistsLabel: {
        marginRight: 10,
    },
    visibilityContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    publicLabel: {
        marginRight: 10,
    },
    privateLabel: {
        marginLeft: 10,
    },
    shuffleContainer: {
        flexDirection: 'row',
        marginTop: 15,
    },
    shuffleLabel: {
        marginRight: 10,
    },
    titleContainer: {
        marginTop: 15,
    },
    inputLabel: {
        color: 'white',
    },
    titleInput: {
        backgroundColor: 'rgba(55, 59, 68, 1)',
        borderRadius: 10,
        fontSize: 22,
        padding: '3%',
        color: 'white'
    },
    createPlaylistButton: {
        flex: 1,
        marginTop: 30,
    },
    buttonGradient: {
        borderRadius: 10,
        width: '100%',
        padding: '3%',
        alignSelf: 'center'
    },
    createPlaylistText: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
        alignSelf: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    submitOverlayContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    overlayText: {
        fontSize: 24,
        alignSelf: 'center',
    }
});

export default styles;
