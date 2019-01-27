import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    header: {
        fontWeight: 'bold',
    },
    image: {
        height: 200,
        width: 400,
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        width: '100%',
    },
    disabledTrack: {
        opacity: 0.5
    },
    enabledTrack: {
        opacity: 1
    }
});

export default styles;
