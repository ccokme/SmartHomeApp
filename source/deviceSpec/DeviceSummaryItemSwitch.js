import React from 'react';
import {Text, View} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import {SegmentedControl} from '@ant-design/react-native';
import DeviceControl from '../components/DeviceControl';
import {Colors, Tme} from '../ThemeStyle';

export default class DeviceSummaryItemSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.spec.value == 'Off' ? 0 : 1,
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
          values={['OFF', 'ON']}
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
    var param = status == 1 ? 255 : 0;
    new DeviceControl({
      spec: this.props.spec,
      param: param,
      sn_id: this.props.device.sn_id,
      runCMD: true,
    }).switch();
  }
}
