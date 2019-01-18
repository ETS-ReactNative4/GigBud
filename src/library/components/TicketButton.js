import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo';

import colors from 'res/colors';

class TicketButton extends Component {
    render() {
        const { band, date, venue, location, songs, onPress } = this.props;
        // console.log(this.props);
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={styles.parent}>
                <LinearGradient
                    colors={[colors.blue, colors.skyblue]}
                    style={styles.gradientStyle}
                    start={[1, 0]}
                    end={[0, 1]}>
                    <View style={styles.date}>
                        <Text>{date}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text>{band}</Text>
                        <Text>{venue}</Text>
                        <Text>{location}</Text>
                        <Text>{songs} songs</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}

TicketButton.propTypes = {
    band: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    venue: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    songs: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%'
    },
    gradientStyle: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%',
    },
    date: {
        flexWrap: 'wrap',
        fontWeight: 'bold',
        width: '25%',
        borderRightColor: 'black',
        borderRightWidth: 2,
        opacity: 1
    },
    info: {
        flexDirection: 'column',
        alignItems: 'center',
        height: '75%',
        opacity: 1
    }
});

export default TicketButton;
