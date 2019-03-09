import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    recentPlaylistsContainer: {
        flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        marginTop: '10%',
    },
    suggestionsContainer: {
        flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        marginTop: '10%',
    },
    logoutButton: {
        flex: 1,
        alignSelf: 'center',
        height: '5%',
        width: '65%',
    },
    buttonGradient: {
        borderRadius: 10,
        flex: 1,
    },
    btnText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: -1},
        textShadowRadius: 5,
    }
})

export default styles;
