import React from 'react';
import {Text, View} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import {Slider} from '@ant-design/react-native';
import {Colors, Tme} from '../ThemeStyle';
import DeviceControl from '../components/DeviceControl';

export default class DeviceSummaryItemThermostatSetpoint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValue: this.props.spec.value,
      time: this.props.time,
      max: this.props.spec.max == 0 ? 30 : this.props.spec.max,
      min: this.props.spec.min,
    };
  }

  componentDidMount() {
    var max = this.props.spec.max == 0 ? 30 : this.props.spec.max;

    this.setState({
      initialValue: Helper.temperatureScale(
        this.props.spec.value || 0,
        this.props.spec.unit_index,
        false,
      ),
      max: 'C' == 'F' ? max * 1.8 + 32 : max,
      min: 'C' == 'C' ? 0 : 32,
    });
  }

  render() {
    return (
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
            {this.state.initialValue} °C
          </Text>
        </View>
        <Slider
          min={this.state.min}
          max={this.state.max}
          step={1}
          minimumTrackTintColor={Colors.MainColor}
          value={parseInt(this.state.initialValue)}
          onChange={this.handleSliderChange.bind(this)}
          onAfterChange={this.onAfterChange.bind(this)}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{color: Tme('cardTextColor')}}>{this.state.min} °C</Text>
          <Text style={{color: Tme('cardTextColor')}}>{this.state.max} °C</Text>
        </View>
      </View>
    );
  }

  handleSliderChange(e) {
    this.setState({
      initialValue: e,
      time: Helper.utc(),
    });
  }

  onAfterChange(e) {
    this.handleSliderChange(e);
    var param = Helper.temperatureScale(e, this.props.spec.unit_index, true);
    console.log(this.props.parent.setpoint_type);
    new DeviceControl({
      spec: this.props.spec,
      param: param,
      sn_id: this.props.device.sn_id,
      setpoint_type: this.props.parent.setpoint_type,
      runCMD: true,
    }).thermostatSetpoint();
  }
}
