import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';

export default class DeviceTags extends React.Component {
  render() {
    var tags = _.sortBy(this.props.device.device_tags).map(function (v, k) {
      var pair = v
        .split(' - ')
        .map((k) => {
          return Helper.i(k);
        })
        .join(' - ');
      return (
        <View
          key={k}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 5,
            backgroundColor: 'white',
            borderRadius: 100,
            marginRight: 10,
            marginBottom: 8,
          }}>
          <Text
            style={{
              color: '#9497A0',
              fontWeight: '600',
            }}>
            {pair}
          </Text>
        </View>
      );
    });

    return (
      <View style={{marginTop: 30, flexDirection: 'row', flexWrap: 'wrap'}}>
        {tags}
      </View>
    );
  }
}
