import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import colors from 'res/colors';

// React component that is a loading spinner
class Loader extends Component {
    render() {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator
                    size='large'
                    color={colors.black} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loaderContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Loader;
