import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import {Slider, SegmentedControl, Popover} from '@ant-design/react-native';
import {Colors, Tme} from '../ThemeStyle';
import DeviceControl from '../components/DeviceControl';

export default class DeviceSummaryItemDimmer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValue: this.parseInitValue(),
      value: this.parseValueByRealValue(this.props.spec.real_value),
      time: this.props.time,
    };
  }

  parseInitValue() {
    if (this.props.spec.dv_type == 'zigbee') {
      return parseInt((99 / 255) * this.props.spec.value);
    } else {
      return parseInt(this.props.spec.real_value);
    }
  }
  parseValueByRealValue(real_value) {
    if (this.props.spec.dv_type == 'zwave') {
      var v = parseInt(real_value);
      if (v == NaN || v == 0) {
        return 0;
      } else if (v >= 99) {
        return 2;
      } else {
        return 1;
      }
    }
  }

  render() {
    return (
      <View>
        {this.props.spec.dv_type == 'zigbee' ? null : (
          <SegmentedControl
            tintColor={Colors.MainColor}
            fontStyle={{color: Tme('cardTextColor')}}
            activeFontStyle={{color: '#ffffff'}}
            values={['OFF', 'ON', 'FULL']}
            selectedIndex={this.state.value}
            style={{flex: 1, height: 35}}
            onChange={this.handleThreeBtnChange.bind(this)}
          />
        )}
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
      value: this.parseValueByRealValue(e),
      time: Helper.utc(),
    });
  }

  parseParam(param) {
    if (this.props.spec.dv_type == 'zigbee') {
      return parseInt((255 / 99) * param);
    } else {
      return param;
    }
  }

  handleThreeBtnChange(e) {
    var status = e.nativeEvent.selectedSegmentIndex;
    this.setState({
      value: status,
      time: Helper.utc(),
    });
    var param = status == 0 ? 0 : 255;
    if (status == '2') {
      param = 99;
      this.setState({
        initialValue: 99,
      });
    } else if (status == '0') {
      this.setState({
        initialValue: 0,
      });
    }
    var deviceControl = new DeviceControl({
      spec: this.props.spec,
      param: param,
      runCMD: true,
    });
    deviceControl.dimmer();
  }
}
