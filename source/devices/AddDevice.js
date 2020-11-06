import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {Helper, DEVICE_WIDTH, HelperMemo} from '../Helper';
import {
  NotificationCenter,
  EVENT_GRPC_CONTROLLER_CHANGE,
} from '../NotificationCenter';
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import * as Progress from 'react-native-progress';
import GrpcManager from '../components/GrpcManager';
import {Tag, Provider} from '@ant-design/react-native';
import {Colors, Tme} from '../ThemeStyle';
import ILoading from '../components/ILoading';
import IdleTimerManager from 'react-native-idle-timer';
import DeviceControl from '../components/DeviceControl';
import NavBarView from '../components/NavBarView';
import CardView from '../components/CardView';

export default class AddDevice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 0,
      indeterminate: true,
      timeShow: true,
      inputValue: '',
      inputShow: false,
      textShow: false,
      wait: true,
      csa: '',
      dskText: '',
      countdown: 60,
      countdownShow: true,
    };
    this.key = null;
    this.down = null;
    this.alertd = false;
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
        Alert.alert('', 'Operation timeout, please try again!', [
          {
            text: 'Confirm',
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
            case 'csa':
              _this.setState({
                timeShow: false,
                textShow: true,
                csa: payload.data.csa,
              });
              break;
            case 'dsk':
              _this.setState(
                {
                  timeShow: false,
                  wait: true,
                  inputShow: true,
                  dskText: payload.data.dsk,
                },
                () => {
                  _this.clearCountdown();
                },
              );
              break;
            case 'dsk_invalid':
              _this.refs.ai.hide();
              _this.setState(
                {
                  timeShow: false,
                  wait: true,
                  inputShow: true,
                  inputValue: '',
                },
                () => {
                  Alert.alert('Error', 'Device key is invalid');
                },
              );
              break;
            case 'starting':
              _this.setState(
                {
                  timeShow: true,
                  countdownShow: true,
                  wait: false,
                  indeterminate: false,
                },
                () => {
                  _this.countdown();
                },
              );
              break;
            case 'in_progress':
              _this.refs.ai.hide();
              _this.setState(
                {
                  progress: 0.25,
                  wait: true,
                  countdownShow: false,
                  timeShow: true,
                  inputShow: false,
                  textShow: false,
                },
                () => {
                  _this.clearCountdown();
                },
              );
              break;
            case 'in_progress_1':
              _this.refs.ai.hide();
              _this.setState(
                {
                  progress: 0.5,
                  wait: true,
                  timeShow: true,
                  countdownShow: false,
                  inputShow: false,
                  textShow: false,
                },
                () => {
                  _this.clearCountdown();
                },
              );
              break;
            case 'in_progress_2':
              _this.refs.ai.hide();
              _this.setState(
                {
                  progress: 0.75,
                  wait: true,
                  timeShow: true,
                  countdownShow: false,
                  inputShow: false,
                  textShow: false,
                },
                () => {
                  _this.clearCountdown();
                },
              );
              break;
            case 'device_added':
              _this.refs.ai.hide();
              _this.setState(
                {
                  progress: 1,
                  wait: true,
                  timeShow: true,
                  countdownShow: false,
                  inputShow: false,
                  textShow: false,
                },
                () => {
                  _this.clearCountdown();
                  Alert.alert(
                    'Add Device',
                    'Success',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          Navigation.push(_this.props.componentId, {
                            component: {
                              name: 'AddSuccess',
                              passProps: {
                                uuid: payload.data['devices'][0].index,
                                type: 'new',
                              },
                              options: {
                                popGesture: false,
                                topBar: {
                                  backButton: {
                                    visible: false,
                                  },
                                  title: {
                                    text: '',
                                  },
                                },
                              },
                            },
                          });
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                },
              );
              break;
            case 'failed':
              _this.setState(
                {
                  indeterminate: true,
                  countdownShow: false,
                  progress: 0,
                },
                () => {
                  if (!_this.alertd) {
                    _this.alertd = true;
                    Alert.alert(
                      'Add Device',
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
                },
              );
              break;
            default:
              break;
          }
        }
      },
    );

    IdleTimerManager.setIdleTimerDisabled(true);
  }

  onConnect() {
    new DeviceControl({type: this.props.type}).addDevice();
  }

  componentWillUnmount() {
    if (this.grpcManager) {
      this.grpcManager.unmount();
    }
    if (this.down) {
      clearTimeout(this.down);
      this.down = null;
    }
    new DeviceControl({type: this.props.type}).CmdStop();
    NotificationCenter.removeObserver(this, EVENT_GRPC_CONTROLLER_CHANGE);
    IdleTimerManager.setIdleTimerDisabled(false);
  }

  render() {
    var _this = this;
    return (
      <Provider>
        <NavBarView>
          <KeyboardAvoidingView
            behavior="padding"
            enabled
            style={{
              flex: 1,
              backgroundColor: Tme('bgColor'),
              alignItems: 'center',
            }}>
            <ILoading ref="ai" hide={true} />
            <CardView
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
                  Add Device
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
                      manual to add the device
                    </Text>
                  </View>
                )}
                {this.state.inputShow ? (
                  <View style={{padding: 16}}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: Tme('cardTextColor'),
                      }}>
                      Please input the first five digits of the device key, you
                      can refer to the deivce manual to get the device key
                    </Text>
                  </View>
                ) : null}
              </View>
              <View>
                {this.state.timeShow ? (
                  this.state.countdownShow ? (
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
                  )
                ) : null}
                <View>
                  {this.state.inputShow ? (
                    <View>
                      <View
                        style={[
                          {
                            borderColor: Tme('inputBorderColor'),
                            borderWidth: 1,
                            borderRadius: 16,
                            height: 48,
                          },
                        ]}>
                        <TextInput
                          autoCapitalize="none"
                          placeholder="DSK"
                          keyboardType="number-pad"
                          underlineColorAndroid="transparent"
                          autoCorrect={false}
                          value={this.state.inputValue}
                          maxLength={16}
                          placeholderTextColor={Tme('placeholder')}
                          onChangeText={(inputValue) =>
                            this.setState({inputValue})
                          }
                          style={Colors.TextInputStyle()}
                        />
                      </View>
                      <Tag style={{marginTop: 16}}>{this.state.dskText}</Tag>
                      <View style={{marginTop: 16}}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={{
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: Colors.MainColor,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onPress={this._save.bind(this)}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: '600',
                              color: '#ffffff',
                              width: 120,
                              textAlign: 'center',
                            }}>
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                  {this.state.textShow ? (
                    <View>
                      <Tag>{this.state.csa}</Tag>
                    </View>
                  ) : null}
                </View>
              </View>
              {this.state.inputShow ? null : (
                <View
                  style={{
                    marginTop: 40,
                    alignItems: 'center',
                    marginBottom: 30,
                  }}>
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
              )}
            </CardView>
          </KeyboardAvoidingView>
        </NavBarView>
      </Provider>
    );
  }

  _save() {
    new DeviceControl({
      value: this.state.inputValue,
      dskText: this.state.dskText,
    }).setDsk();
    this.refs.ai.show();
  }

  close() {
    if (this.state.inputShow) {
      this.setState({
        inputShow: false,
        timeShow: true,
      });
    } else {
      Navigation.pop(this.props.componentId);
    }
  }
}
