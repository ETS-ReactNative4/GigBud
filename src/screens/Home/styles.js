import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        marginTop: '10%',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        width: '85%',
        borderRadius: 5
    },
    input: {
        color: 'white',
    },
    centeredText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
        marginTop: '10%',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    flatlist: {
        flex: 1,
        width: '85%',
        alignSelf: 'center',
    },
});

export default styles;
