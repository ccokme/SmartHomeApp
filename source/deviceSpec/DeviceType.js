import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {Helper} from '../Helper';

export default class DeviceType extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 14, color: '#9497A0'}}>
          {Helper.getDeviceType(this.props.device.dv_type)}
        </Text>
      </View>
    );
  }
}
