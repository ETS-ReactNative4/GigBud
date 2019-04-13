import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo';

import colors from 'res/colors';

// Gradient Background component
class GradientBackground extends Component {
    render() {
        return (
            <LinearGradient
                colors={[this.props.colors[0], this.props.colors[1]]}
                style={styles.gradientContainer}
                start={[1, 0]}
                end={[0, 1]}>

                {this.props.children}

            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1
    }
});

export default GradientBackground;
