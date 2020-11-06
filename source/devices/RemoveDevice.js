import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {Helper, HelperMemo, DEVICE_HEIGHT, DEVICE_WIDTH} from '../Helper';
import {
  NotificationCenter,
  EVENT_GRPC_CONTROLLER_CHANGE,
} from '../NotificationCenter';
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import * as Progress from 'react-native-progress';
import GrpcManager from '../components/GrpcManager';
import {Tme, Colors} from '../ThemeStyle';
import IdleTimerManager from 'react-native-idle-timer';
import {Provider} from '@ant-design/react-native';
import DeviceControl from '../components/DeviceControl';
import NavBarView from '../components/NavBarView';
import CardView from '../components/CardView';

export default class RemoveDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      wait: true,
      indeterminate: true,
      countdown: 60,
      countdownShow: true,
    };

    this.down = null;
    this.alertd = false;
  }

  componentDidMount() {
    var _this = this;

    _this.setState(
      {
        show_view: true,
      },
      () => {
        _this.grpcManager = new GrpcManager({
          onConnect: _this.onConnect.bind(this),
        });
        _this.grpcManager.mount();
      },
    );

    NotificationCenter.addObserver(
      this,
      EVENT_GRPC_CONTROLLER_CHANGE,
      (payload) => {
        var _this = this;
        if (payload.queue == 'controller') {
          switch (payload.data.op_state) {
            case 'starting':
              _this.setState(
                {
                  indeterminate: false,
                  wait: false,
                  countdownShow: true,
                },
                () => {
                  _this.countdown();
                },
              );
              break;
            case 'in_progress':
              _this.setState(
                {
                  wait: true,
                  countdownShow: false,
                  progress: 0.25,
                },
                () => {
                  _this.clearCountdown();
                },
              );
              break;
            case 'removed':
              _this.setState(
                {
                  wait: true,
                  countdownShow: false,
                  progress: 1,
                },
                () => {
                  _this.clearCountdown();
                  Alert.alert(
                    'Remove Device',
                    'Success',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          Navigation.pop(_this.props.componentId);
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                },
              );
              break;
            case 'failed':
              if (!_this.alertd) {
                _this.alertd = true;
                Alert.alert(
                  'Remove Device',
                  'Failed',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        Navigation.pop(_this.props.componentId);
                      },
                    },
                  ],
                  {cancelable: false},
                );
              }
              break;
            default:
              break;
          }
        }
      },
    );

    IdleTimerManager.setIdleTimerDisabled(true);
  }

  countdown() {
    var time = 60;
    this.down = setInterval(() => {
      if (this.state.countdown > 0) {
        this.setState({
          countdown: time--,
        });
      } else {
        this.clearCountdown();
        Alert.alert('', I18n.t('global.time_out'), [
          {
            text: I18n.t('home.confirm'),
            onPress: () => {
              Navigation.pop(this.props.componentId);
            },
          },
        ]);
      }
    }, 1000);
  }

  clearCountdown() {
    if (this.down) {
      clearInterval(this.down);
    }
    this.down = null;
  }

  onConnect() {
    new DeviceControl({type: 'zwave'}).removeDevice();
  }

  componentWillUnmount() {
    if (this.grpcManager) {
      this.grpcManager.unmount();
    }
    if (this.down) {
      clearTimeout(this.down);
      this.down = null;
    }
    new DeviceControl({type: 'zwave'}).CmdStop();
    NotificationCenter.removeObserver(this, EVENT_GRPC_CONTROLLER_CHANGE);
    IdleTimerManager.setIdleTimerDisabled(false);
  }

  render() {
    var _this = this;
    return (
      <Provider>
        <NavBarView>
          <View
            style={{
              flex: 1,
              backgroundColor: Tme('bgColor'),
              alignItems: 'center',
            }}>
            <CardView
              withWaveBg={true}
              styles={{
                marginTop: 40,
                width: DEVICE_WIDTH - 40,
                height: HelperMemo.WiNDOW_HEIGHT - 80,
                padding: 20,
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <View style={{marginTop: 79, marginBottom: 20}}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '600',
                    textAlign: 'center',
                    color: Tme('cardTextColor'),
                  }}>
                  Remove Device
                </Text>
                {this.state.wait ? (
                  <View style={{padding: 16}}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: Tme('cardTextColor'),
                      }}>
                      Please wait
                    </Text>
                  </View>
                ) : (
                  <View style={{padding: 16}}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: Tme('cardTextColor'),
                      }}>
                      Please press buttons on the device following the device
                      manual to remove the device
                    </Text>
                  </View>
                )}
              </View>
              <View>
                {this.state.countdownShow ? (
                  <Progress.Circle
                    size={140}
                    progress={this.state.progress}
                    indeterminate={this.state.indeterminate}
                    showsText={true}
                    color={Colors.MainColor}
                    formatText={(progress) => {
                      return `${_this.state.countdown}`;
                    }}
                  />
                ) : (
                  <Progress.Circle
                    size={140}
                    color={Colors.MainColor}
                    progress={this.state.progress}
                    indeterminate={this.state.indeterminate}
                    showsText={true}
                  />
                )}
              </View>
              <View
                style={{marginTop: 40, alignItems: 'center', marginBottom: 30}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={this.close.bind(this)}
                  style={{
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: Colors.MainColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#ffffff',
                      width: 120,
                      textAlign: 'center',
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </CardView>
          </View>
        </NavBarView>
      </Provider>
    );
  }

  close() {
    Navigation.pop(this.props.componentId);
  }
}
