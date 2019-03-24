import { StyleSheet } from 'react-native';
import colors from 'res/colors';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    textContainer: {
        flex: 1,
        flexGrow: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
    },
    recentPlaylistsContainer: {
        marginTop: '5%',
        height: '50%',
        width: '85%',
        alignSelf: 'center',
        // justifyContent: 'space-around',
    },
    ticket: {
        height: '33%',
    },
    centeredText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    suggestionsContainer: {
        flex: 1,
        height: '25%',
        width: '85%',
        alignSelf: 'center',
        marginTop: '3%',
    },
    suggestions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '5%',
    },
    suggestionBox: {
        backgroundColor: colors.black,
        flex: 1,
        padding: '3%',
        borderWidth: 1,
        borderColor: '#000000'
    },
    suggestionText: {
        flex: 1,
        color: 'white',
        textAlign: 'center'
    },
    artistName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flex: 1,
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        height: '35%',
        width: '65%',
    },
    buttonGradient: {
        borderRadius: 10,
        flex: 1,
        justifyContent: 'space-around',
    },
    btnText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    }
})

export default styles;
