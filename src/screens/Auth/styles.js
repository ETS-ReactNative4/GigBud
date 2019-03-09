import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    gradientContainer: {
        flex: 1,
        height: '100%'
    },
    image: {
        height: '45%',
        width: '100%',
        opacity: 0.5
    },
    title: {
        position: 'absolute',
        marginTop: '5%',
        marginLeft: '2.5%',
        color: 'white',
        fontSize: 62,
        fontFamily: 'bad-script-regular',
    },
    infoBlock: {
        flex: 1,
        alignSelf: 'center',
        width: '65%',
        marginTop: '10%'
    },
    info: {
        color: 'white',
        flexDirection: 'row',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonBlock: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    spotifyBtn: {
        height: '35%',
        width: '65%',
    },
    buttonGradient: {
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    spotifyIcon: {
        height: 50,
        width: 50,
        alignSelf: 'center'
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
});

export default styles;
