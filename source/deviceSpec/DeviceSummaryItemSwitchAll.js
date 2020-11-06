import React from 'react';
import {Helper} from '../Helper';
import _ from 'lodash';
import {SegmentedControl} from '@ant-design/react-native';
import DeviceControl from '../components/DeviceControl';
import {Colors, Tme} from '../ThemeStyle';

export default class DeviceSummaryItemSwitchAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.spec.value == 'Off' ? 0 : 1,
      time: this.props.time,
    };
  }

  render() {
    return (
      <SegmentedControl
        tintColor={Colors.MainColor}
        fontStyle={{color: Tme('cardTextColor')}}
        activeFontStyle={{color: '#ffffff'}}
        values={['OFF', 'ON']}
        selectedIndex={this.state.value}
        style={{flex: 1, height: 35}}
        onChange={this.switchToggle.bind(this)}
      />
    );
  }

  switchToggle(e) {
    var status = e.nativeEvent.selectedSegmentIndex;
    // if (status == this.props.spec.value) return;

    this.setState({
      value: status,
      time: Helper.utc(),
    });

    // var param = status == "Off" ? "SetOff()" : "SetOn()";
    var param = status == 1 ? 0 : 255;
    new DeviceControl({
      spec: this.props.spec,
      param: param,
      sn_id: this.props.device.sn_id,
      runCMD: true,
    }).switch();
  }
}
