import React, { Component } from 'react';
import { TextInput, Button, Alert, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { withNavigation } from 'react-navigation';

import strings from 'res/strings';
import images from 'res/images';

// Component that is used to search setlist.fm
class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(text) {
        this.setState({value: text});
    }

    handleSubmit(event) {
        if(this.state.value.trim() === '') {
            // raise alert / toast
            Alert.alert(
                'Alert title',
                'Alert msg',
                [
                    {text: 'OK'}
                ]
            )
        } else {
            // search setlist.fm with this.state.value
            this.props.navigation.navigate('Results',
            {
                searchValue: this.state.value
            });
        }
    }

    render() {
        return (
            <View style={styles.parent}>
                <TextInput
                    style={styles.input}
                    placeholder={strings.searchPlaceholder}
                    onChangeText={this.handleChange}
                    onSubmitEditing={this.handleSubmit}
                />
                <Button
                    title=''
                    type='clear'
                    icon={
                        <FontAwesome name='search' size={40} />
                    }/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#9096a0'
    },
    input: {
        marginLeft: '2%',
        color: 'black',
        width: '75%'
    },
    btn: {
        width: '25%'
    }
});

export default withNavigation(SearchInput);
