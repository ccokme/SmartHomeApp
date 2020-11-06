import React from 'react';
import {Text, View} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import {SegmentedControl} from '@ant-design/react-native';
import DeviceControl from '../components/DeviceControl';
import {Colors, Tme} from '../ThemeStyle';

export default class DeviceSummanyItemTemperatureUnit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: parseInt(this.props.spec.value) || 0,
      time: this.props.time,
    };
  }

  render() {
    return (
      <View>
        <SegmentedControl
          tintColor={Colors.MainColor}
          fontStyle={{color: Tme('cardTextColor')}}
          activeFontStyle={{color: '#ffffff'}}
          values={['°C', '°F']}
          selectedIndex={this.state.value}
          style={{flex: 1, height: 35}}
          onChange={this.handleRadioChange.bind(this)}
        />
      </View>
    );
  }

  handleRadioChange(e) {
    var status = e.nativeEvent.selectedSegmentIndex;
    this.setState({
      value: status,
      time: Helper.utc(),
    });
    var param = status;
    new DeviceControl({
      spec: this.props.spec,
      param: param,
      sn_id: this.props.device.sn_id,
      runCMD: true,
    }).switch();
  }
}
