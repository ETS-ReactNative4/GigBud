import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo';
import { withNavigation } from 'react-navigation';

import colors from 'res/colors';

class TicketButton extends Component {
    render() {
        const { data } = this.props;
        const id = data.id;
        const date = data.eventDate;
        const artist = data.artist.name;
        const venue = data.venue.name;
        const location = this.getLocation(data);
        const songs = this.getNumSongs(data);
        var disabled = (songs === 0) ? true : false;
        return (
            <TouchableOpacity
                activeOpacity={disabled ? 1 : 0.5}
                disabled={disabled}
                onPress={() => this.navigateToForm(data)}
                style={disabled ? styles.parentDisabled : styles.parent}>
                <LinearGradient
                    colors={[colors.blue, colors.skyblue]}
                    style={styles.gradientStyle}
                    start={[1, 0]}
                    end={[0, 1]}>
                    <View style={styles.date}>
                        <Text>{date}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text>{artist}</Text>
                        <Text>{venue}</Text>
                        <Text>{location}</Text>
                        <Text>{songs} songs</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    getLocation(data) {
        let city = data.venue.city;
        return city.name + ', ' + city.stateCode + ', ' + city.country.code;
    }

    getNumSongs(data) {
        let num = 0;
        data.sets.set.forEach((set) => num += set.song.length)
        return num;
    }

    navigateToForm = (data) => {
        this.props.navigation.navigate('CreatePlaylist',
        {
            setlistData: data
        });
    }
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%'
    },
    parentDisabled: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        opacity: 0.7
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

export default withNavigation(TicketButton);
