import { StyleSheet } from 'react-native';
import colors from 'res/colors';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    title: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 32,
        marginTop: '10%',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 5,
    },
    flatlist: {
        flex: 1,
        marginTop: '10%',
        marginBottom: '10%',
        paddingLeft: '5%',
        paddingTop: '5%',
        paddingRight: '5%',
        paddingBottom: '5%',
        width: '85%',
        alignSelf: 'center',
        backgroundColor: colors.activeBlack,
        borderRadius: 10,
        // opacity: 0.7
    }
});

export default styles;
