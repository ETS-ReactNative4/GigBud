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
                        {this._dateDay({date})}
                        {this._dateMonth({date})}
                        {this._dateYear({date})}
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.artistName}>{artist}</Text>
                        <Text style={styles.infoText}>{location}</Text>

                        <Text style={styles.infoText}>{songs} songs</Text>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    _dateDay(date) {
        let day = date.date.substring(0, 2);
        return (
            <View style={styles.dateTextView}>
                <Text style={styles.dateText}>{day}</Text>
            </View>
        );
    }

    _dateMonth(date) {
        let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        let index = date.date.substring(3, 5);
        let month = months[parseInt(index)-1];
        return (
            <View style={styles.dateTextView}>
                <Text style={styles.dateText}>{month}</Text>
            </View>
        );
    }

    _dateYear(date) {
        let year = date.date.substring(6);
        return (
            <View style={styles.dateTextView}>
                <Text style={styles.dateText}>{year}</Text>
            </View>
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
            setlistData: data,
            // refreshFunc: this.props.navigation.getParam('refreshFunc', null),
        });
    }
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
    parentDisabled: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        opacity: 0.7
    },
    gradientStyle: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        borderRadius: 5,
    },
    date: {
        flexWrap: 'wrap',
        fontWeight: 'bold',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // alignItems: 'center',
        width: '20%',
        borderRightColor: 'black',
        borderRightWidth: 2,
        opacity: 1
    },
    dateTextView: {
        marginLeft: '25%',
    },
    dateText: {
        // marginLeft: '25%',
        fontSize: 18,
        fontWeight: 'bold',
    },
    info: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        // height: '75%',
        // width: '75%',
        opacity: 1
    },
    artistName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 16
    }
});

export default withNavigation(TicketButton);
