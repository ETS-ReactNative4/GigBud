import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

// Button that adds/removes playlist tracks from a playlist
class PlaylistTrack extends Component {
    constructor(props) {
        super(props);
        this.state = {disabled: this.props.disabled, toggle: this.props.disabled}
        console.log(this.state.toggle);
    }
    render() {
        return (
            <TouchableOpacity
                activeOpacity={this.state.disabled ? 1 : 0.5}
                disabled={this.state.disabled}
                onPress={() => this.setState({toggle: !this.state.toggle})}
                style={this.state.toggle ? styles.parentDisabled : styles.parent}>
                <Text style={styles.text}>{this.props.track}</Text>
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    parent: {
        opacity: 1
    },
    parentDisabled: {
        opacity: 0.5
    },
    text: {
        fontWeight: 'bold'
    }
});

export default PlaylistTrack;
