import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class EmptyView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        {this.props.hide ? null : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
        )}
      </View>
    );
  }
}
