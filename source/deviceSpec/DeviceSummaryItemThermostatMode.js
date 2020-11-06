import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import {Colors, Tme} from '../ThemeStyle';
import DeviceControl from '../components/DeviceControl';

export default class DeviceSummaryItemThermostatMode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.spec.value,
      time: this.props.time,
    };
  }

  render() {
    var _this = this;
    var options = _.sortBy(this.props.spec.options, function (n) {
      return n.val;
    }).map(function (option, key) {
      if (_this.state.value == option.val) {
        return (
          <TouchableOpacity
            key={'spec_' + key}
            activeOpacity={0.8}
            onPress={_this.setMode.bind(_this, option.val)}
            style={{
              marginRight: 16,
              paddingVertical: 10,
              paddingHorizontal: 16,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.MainColor,
              borderRadius: 8,
              marginTop: 16,
            }}>
            <Text style={{color: 'white', fontSize: 17}}>
              {Helper.i(option.name)}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            key={'spec_' + key}
            activeOpacity={0.8}
            onPress={_this.setMode.bind(_this, option.val)}
            style={{
              marginRight: 16,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: Colors.MainColor,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
              marginTop: 16,
            }}>
            <Text style={{color: Tme('cardTextColor'), fontSize: 17}}>
              {Helper.i(option.name)}
            </Text>
          </TouchableOpacity>
        );
      }
    });
    return (
      <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
        {options}
      </View>
    );
  }

  setMode(e) {
    var param = e;
    this.setState({
      value: e,
      time: Helper.utc(),
    });
    this.props.parent.setpoint_type = e;
    new DeviceControl({
      spec: this.props.spec,
      param: param,
      sn_id: this.props.device.sn_id,
      runCMD: true,
    }).thermostatMode();
  }
}
