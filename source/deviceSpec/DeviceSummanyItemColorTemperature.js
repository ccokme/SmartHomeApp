import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import {Slider, Popover} from '@ant-design/react-native';
import {Colors, Tme} from '../ThemeStyle';
import DeviceControl from '../components/DeviceControl';

const Item = Popover.Item;
export default class DeviceSummanyItemColorTemperature extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValue: this.parseInitValue(),
      value: this.props.spec.value ? this.props.spec.value : 0,
      time: this.props.time,
    };
  }

  parseInitValue() {
    if (this.props.spec.dv_type == 'zigbee') {
      return parseInt((this.props.spec.value ? this.props.spec.value : 0) / 10);
    } else {
      return parseInt(this.props.spec.value);
    }
  }

  render() {
    return (
      <View>
        <View style={{marginTop: 8}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '500',
                color: Tme('cardTextColor'),
              }}>
              {this.state.initialValue}
            </Text>
          </View>
          <Slider
            min={0}
            max={99}
            step={1}
            minimumTrackTintColor={Colors.MainColor}
            value={this.state.initialValue}
            onChange={this.handleSliderChange.bind(this)}
            onAfterChange={this.sliderDidChange.bind(this)}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: Tme('cardTextColor')}}>0</Text>
            <Text style={{color: Tme('cardTextColor')}}>99</Text>
          </View>
        </View>
      </View>
    );
  }

  sliderDidChange(e) {
    this.handleSliderChange(e);
    var param = this.parseParam(e);
    console.log('dimmer params:' + param);
    var deviceControl = new DeviceControl({
      spec: this.props.spec,
      param: param,
      runCMD: true,
    });
    deviceControl.dimmer();
  }

  handleSliderChange(e) {
    this.setState({
      initialValue: e,
      value: e,
      time: Helper.utc(),
    });
  }

  parseParam(param) {
    if (this.props.spec.dv_type == 'zigbee') {
      return parseInt(param * 10);
    } else {
      return param;
    }
  }
}
