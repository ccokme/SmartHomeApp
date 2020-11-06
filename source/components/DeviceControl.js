import {Helper} from '../Helper';
import _ from 'lodash';

export default class DeviceControl {
  constructor(props) {
    this.props = props;
  }

  endLearn(callback) {
    var cmd = {
      type: '433',
      cmd: 'cmd',
      params1: this.props.param + ',end learn',
    };
    if (callback) {
      callback(cmd);
    } else {
      this.runCMD([cmd]);
    }
  }
  /**
   * props : {
   * spec: spec,
   * param: param,
   * successCb: boolean
   * }
   */
  switch(callback) {
    var cmd = this.cmd();
    if (callback) {
      callback(cmd);
    }
  }
  dimmer(callback) {
    var cmd = this.cmd();
    if (callback) {
      callback(cmd);
    }
  }

  thermostatMode(callback) {
    var cmd = this.cmd();
    if (callback) {
      callback(cmd);
    }
  }

  thermostatSetpoint(callback) {
    var cmd = this.cmd('thermostat_setpoint');
    if (callback) {
      callback(cmd);
    }
  }

  doorlock(callback) {
    var cmd = this.cmd();
    if (callback) {
      callback(cmd);
    }
  }

  /**
   * props: {
   * spec: spec,
   * color: color,
   * }
   */
  colorSwitch(callback) {
    this.props.param = Helper.colorSwitchCmdParams(
      this.props.spec.value_hash,
      this.props.color,
      this.props.spec.dv_type,
    );
    var cmd = this.cmd();
    if (callback) {
      callback(cmd);
    }
  }

  addDevice() {
    this.runCMD([{type: this.props.type, cmd: 'add_device'}]);
  }

  addDeviceWithLinkKey() {
    this.runCMD([
      {
        type: 'zigbee',
        cmd: 'add_device_with_link_key',
        params1: `${this.props.addressKey},${this.props.link_key}`,
      },
    ]);
  }
  removeDevice() {
    var params1 = '';
    if (this.props.type == 'zigbee') {
      params1 = `${this.props.index},${this.props.long_id}`;
    }
    this.runCMD([
      {type: this.props.type, cmd: 'remove_device', params1: params1},
    ]);
  }

  CmdStop() {
    this.runCMD([{type: this.props.type, cmd: 'stop'}]);
  }

  setDsk() {
    this.runCMD([
      {
        type: 'zwave',
        cmd: 'set_dsk',
        params1: `${this.props.value}${this.props.dskText}`,
      },
    ]);
  }

  setPl() {
    this.runCMD([{type: 'zwave', cmd: 'set_pl', params1: this.props.value_id}]);
  }

  removeZwaveFailedDevice() {
    this.runCMD([
      {type: 'zwave', cmd: 'remove_failed_device', params1: this.props.index},
    ]);
  }

  cmd(type = '') {
    var spec = this.props.spec;
    var param = this.props.param;
    var cmd = '';
    var params1 = '';
    var params2 = '';
    var type1 = '';
    if (spec.dv_type == 'zwave') {
      type1 = 'zwave';
      cmd = 'device_control';
      params1 = `${spec.device_id},${spec.instance_id},${spec.cc},${spec.value_id},${param}`;
      if (type == 'thermostat_setpoint') {
        var setpoint_type = spec.setpoint_type;
        if (this.props.setpoint_type) {
          setpoint_type = this.props.setpoint_type;
        }
        params1 = params1 + '|' + setpoint_type + '|' + spec.unit_index;
      }
    } else if (spec.dv_type == 'zigbee') {
      type1 = 'zigbee';
      cmd = 'zcl';
      switch (spec.name.toLowerCase()) {
        case 'switch':
          if (param == 0) {
            param = 'off';
          } else {
            param = 'on';
          }
          params1 = 'on-off,' + param;
          break;
        case 'dimmer':
          params1 = `level-control,mv-to-level,${param},30`;
          break;
        case 'colorswitch':
          params1 = `color-control,movetocolor,${param[0]},${param[1]},3`;
          break;
        case 'colortemperature':
          params1 = `color-control,movetocolortemp,${param},3`;
          break;
        case 'heatingsetpoint':
          cmd = 'thermostat_setpoint';
          params1 = `heating,${param}`;
          break;
        case 'coolingsetpoint':
          cmd = 'thermostat_setpoint';
          params1 = `cooling,${param}`;
          break;
        case 'temperatureunit':
          cmd = 'temperature_display_mode';
          params1 = `${param}`;
          break;
        case 'thermostatmode':
          cmd = 'thermostat_mode';
          params1 = `${param}`;
          break;
        case 'doorlock':
          if (param == 255) {
            params1 = `lock,lock,{}`;
          } else {
            params1 = `lock,unlock,{}`;
          }
          break;
        case 'windowcovering':
          switch (param) {
            case 'down':
              params1 = 'window-covering down';
              break;
            case 'up':
              params1 = 'window-covering up';
              break;
            case 'stop':
              params1 = 'window-covering stop';
              break;
            default:
              params1 = `window-covering go-to-lift-percent ${param}`;
              break;
          }
          break;
        default:
          break;
      }
      params2 = `${spec.long_id},${spec.instance_id}`;
    }
    var temp = {
      type: type1,
      cmd: cmd,
      params1: params1,
      params2: params2,
    };
    console.log(temp);
    if (this.props.runCMD) {
      this.runCMD([temp]);
    } else {
      return [temp];
    }
  }

  runCMD(cmd) {
    if (this.props.successCb == false) {
      Helper.runCMD(cmd, this.props.sn_id, {successCb: false});
    } else {
      Helper.runCMD(cmd, this.props.sn_id);
    }
  }
}
