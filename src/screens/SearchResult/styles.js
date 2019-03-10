import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    image: {
        marginTop: '5%',
        height: '25%',
        width: '85%',
        alignSelf: 'center',
        borderRadius: 5,
    },
    flatlist: {
        flex: 1,
        width: '85%',
        alignSelf: 'center',
    },
    errorTitle: {
        marginTop: '15%',
        alignSelf: 'center',
        color: 'white',
        fontSize: 62
    },
    errorImage: {
        height: '60%',
        width: '85%',
        alignSelf: 'center',
    },
    errorTextContainer: {
        alignSelf: 'center',
        width: '85%',
    },
    errorText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 28
    },
    bold: {
        fontWeight: 'bold',
    }
});

export default styles;
