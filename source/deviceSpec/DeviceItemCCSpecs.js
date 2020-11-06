import React from 'react';
import {Text, View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import DeviceSummaryItemDimmer from './DeviceSummaryItemDimmer';
import DeviceSummaryItemSwitch from './DeviceSummaryItemSwitch';
import DeviceSummaryItemSwitchAll from './DeviceSummaryItemSwitchAll';
import DeviceSummaryItemThermostatMode from './DeviceSummaryItemThermostatMode';
import DeviceSummaryItemThermostatSetpoint from './DeviceSummaryItemThermostatSetpoint';
import DeviceSummaryItemDoorLock from './DeviceSummaryItemDoorLock';
import DeviceSummaryItemColorSwith from './DeviceSummanyItemColorSwith';
import DeviceSummanyItemColorTemperature from './DeviceSummanyItemColorTemperature';
import DeviceSummanyItemTemperatureUnit from './DeviceSummanyItemTemperatureUnit';
import {Colors, Tme, GetStyle} from '../ThemeStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class DeviceItemCCSpecs extends React.Component {
  render() {
    var content = '',
      _this = this;
    if (!_.isEmpty(this.props.device)) {
      var content = this.props.device.cc_specs.map(function (spec, key) {
        if (Helper.specNameEqual(spec.name, 'generalpurpose')) {
          return (
            <View
              key={'spec_' + spec.value_id}
              style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={GetStyle('specNameText')}>
                  {Helper.i(spec.name)}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={[{textAlign: 'center'}]}>
                    {Helper.formatAllTime(spec.u_t)}
                  </Text>
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={20}
                    color={Tme('textColor')}
                  />
                </View>
              </View>
            </View>
          );
        } else {
          switch (spec.name) {
            case 'Battery':
              var text_css = '';
              var view_css = '';
              if (spec.value >= 70) {
                text_css = {
                  color: '#00d18a',
                };
                view_css = {
                  backgroundColor: 'rgba(0, 209, 138, 0.2)',
                };
              } else if (50 < spec.value > 30) {
                text_css = {
                  color: '#5eaaff',
                };
                view_css = {
                  backgroundColor: 'rgba(94, 170, 255, 0.2)',
                };
              } else {
                text_css = {
                  color: Colors.MainColor,
                };
                view_css = {
                  backgroundColor: 'rgba(252, 87, 122, 0.2)',
                };
              }
              var valueText;
              if (_this.props.device.dv_type == 'zigbee') {
                valueText = spec.value + spec.scale;
              } else if (_this.props.device.dv_type == 'zwave') {
                valueText = spec.battery_charge_text;
              } else {
                valueText = Helper.i(spec.battery_charge_text);
              }
              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i(spec.name)}
                    </Text>
                    <View
                      style={[
                        {
                          borderRadius: 4,
                          padding: 8,
                        },
                        view_css,
                      ]}>
                      <Text
                        style={[
                          {fontWeight: '500', textAlign: 'center'},
                          text_css,
                        ]}>
                        {valueText}
                      </Text>
                    </View>
                  </View>
                </View>
              );
              break;
            case 'Switch':
              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      marginBottom: 16,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i('Switch')}
                    </Text>
                  </View>
                  <View>
                    <DeviceSummaryItemSwitch
                      key={Math.random()}
                      spec={spec}
                      device={_this.props.device}
                      time={_this.props.device.last_received_update_time}
                    />
                  </View>
                </View>
              );
              break;
            case 'SwitchAll':
              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      marginBottom: 16,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i('SwitchAll')}
                    </Text>
                  </View>
                  <View>
                    <DeviceSummaryItemSwitchAll
                      key={Math.random()}
                      spec={spec}
                      device={_this.props.device}
                      time={_this.props.device.last_received_update_time}
                    />
                  </View>
                </View>
              );
              break;
            case 'Dimmer':
            case 'Motor':
              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      marginBottom: 16,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i(spec.name)}
                    </Text>
                  </View>
                  <View>
                    <DeviceSummaryItemDimmer
                      key={Math.random()}
                      spec={spec}
                      device={_this.props.device}
                      time={_this.props.device.last_received_update_time}
                    />
                  </View>
                </View>
              );
              break;
            case 'ColorTemperature':
              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      marginBottom: 16,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i(spec.name)}
                    </Text>
                  </View>
                  <View>
                    <DeviceSummanyItemColorTemperature
                      key={Math.random()}
                      spec={spec}
                      device={_this.props.device}
                      time={_this.props.device.last_received_update_time}
                    />
                  </View>
                </View>
              );
              break;
            case 'ThermostatMode':
              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      marginBottom: 16,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i(spec.name)}
                    </Text>
                  </View>
                  <View>
                    <DeviceSummaryItemThermostatMode
                      key={Math.random()}
                      parent={_this.props.parent}
                      device={_this.props.device}
                      spec={spec}
                      time={_this.props.device.last_received_update_time}
                    />
                  </View>
                </View>
              );
              break;
            case 'CoolingSetpoint':
            case 'HeatingSetpoint':
            case 'ThermostatSetpoint':
              var mode = _.find(_this.props.device.cc_specs, function (o) {
                return o['name'] == 'ThermostatMode';
              });
              var show = false;
              if (mode) {
                var modes = _.groupBy(mode['options'], 'val');
                if (spec.name == 'HeatingSetpoint') {
                  if (modes[4]) {
                    show = true;
                  }
                }
                if (spec.name == 'CoolingSetpoint') {
                  if (modes[3]) {
                    show = true;
                  }
                }
              }
              if (spec.name == 'ThermostatSetpoint') {
                show = true;
              }
              if (show) {
                return (
                  <View
                    key={'spec_' + spec.value_id}
                    style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                    <View
                      style={{
                        marginBottom: 16,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={GetStyle('specNameText')}>
                        {Helper.i(spec.name)}
                      </Text>
                    </View>
                    <View>
                      <DeviceSummaryItemThermostatSetpoint
                        key={Math.random()}
                        parent={_this.props.parent}
                        device={_this.props.device}
                        spec={spec}
                        device={_this.props.device}
                        time={_this.props.device.last_received_update_time}
                      />
                    </View>
                  </View>
                );
              } else {
                return null;
              }
              break;
            case 'TemperatureUnit':
              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      marginBottom: 16,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i(spec.name)}
                    </Text>
                  </View>
                  <View>
                    <DeviceSummanyItemTemperatureUnit
                      key={Math.random()}
                      spec={spec}
                      device={_this.props.device}
                      time={_this.props.device.last_received_update_time}
                    />
                  </View>
                </View>
              );
              break;
            case 'DoorLock':
              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      marginBottom: 16,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i(spec.name)}
                    </Text>
                  </View>
                  <View>
                    <DeviceSummaryItemDoorLock
                      key={Math.random()}
                      spec={spec}
                      device={_this.props.device}
                      time={spec.u_t}
                    />
                  </View>
                </View>
              );
              break;
            case 'ColorSwitch':
              if (spec.dv_type == 'zigbee') {
                return (
                  <View
                    key={'spec_' + spec.value_id}
                    style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                    <View
                      style={{
                        marginBottom: 16,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={GetStyle('specNameText')}>
                        {Helper.i(spec.name)}
                      </Text>
                    </View>
                    <DeviceSummaryItemColorSwith
                      key={'spec_' + Math.random().toString()}
                      parent={_this.props.parent}
                      spec={spec}
                      device={_this.props.device}
                      time={spec.u_t}
                    />
                  </View>
                );
              } else {
                var temp = [];
                _.each(spec.options, (v, k) => {
                  temp.push(v.val);
                });
                if (_.intersection(temp, [2, 3, 4]).length == 3) {
                  return (
                    <View
                      key={'spec_' + spec.value_id}
                      style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                      <View
                        style={{
                          marginBottom: 16,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={GetStyle('specNameText')}>
                          {Helper.i(spec.name)}
                        </Text>
                      </View>
                      <DeviceSummaryItemColorSwith
                        key={'spec_' + Math.random().toString()}
                        parent={_this.props.parent}
                        spec={spec}
                        device={_this.props.device}
                        time={spec.u_t}
                      />
                    </View>
                  );
                } else {
                  return null;
                }
              }
              break;
            default:
              var text_css, view_css;
              if (Helper.showSpecValue(spec.value).toString() === 'No') {
                text_css = {
                  color: '#00d18a',
                };
                view_css = {
                  backgroundColor: 'rgba(0, 209, 138, 0.2)',
                };
              } else if (
                Helper.showSpecValue(spec.value).toString() === 'Yes'
              ) {
                text_css = {
                  color: Colors.MainColor,
                };
                view_css = {
                  backgroundColor: 'rgba(252, 87, 122, 0.2)',
                };
              } else {
                text_css = {
                  color: '#5eaaff',
                };
                view_css = {
                  backgroundColor: 'rgba(94, 170, 255, 0.2)',
                };
              }

              var con = (
                <View
                  style={[
                    {
                      borderRadius: 4,
                      padding: 8,
                    },
                    view_css,
                  ]}>
                  <Text
                    style={[
                      {fontWeight: '500', textAlign: 'center'},
                      text_css,
                    ]}>
                    {_this.value_scale(spec)}
                  </Text>
                </View>
              );

              return (
                <View
                  key={'spec_' + spec.value_id}
                  style={[GetStyle('spec'), Colors.CardShadowStyle()]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={GetStyle('specNameText')}>
                      {Helper.i(spec.name)}
                    </Text>
                    {con}
                  </View>
                </View>
              );
          }
        }
      });
    } else {
      content = null;
    }

    return <View style={{paddingHorizontal: 20}}>{content}</View>;
  }
  value_scale(spec) {
    var value = '';
    if (spec.name.toUpperCase() == 'TEMPERATURE') {
      var unit_index = spec.unit_index;
      if (spec.unit_index !== 0 || 1) {
        switch (spec.scale) {
          case '°C':
            unit_index = 0;
            break;
          case '°F':
            unit_index = 1;
            break;
          default:
            unit_index = '';
            break;
        }
      }
      value = Helper.temperatureScale(spec.value, unit_index, false) + ' °C';
    } else {
      value =
        Helper.i(Helper.showSpecValue(spec.value).toString()) +
        ' ' +
        (spec.scale || '');
    }
    return value;
  }
}
