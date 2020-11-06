import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Alert,
  TextInput,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Helper, DEVICE_WIDTH, DEVICE_HEIGHT} from '../Helper';
import {
  NotificationCenter,
  EVENT_GRPC_CONTROLLER_CHANGE,
} from '../NotificationCenter';
import {Navigation} from 'react-native-navigation';
import {Tme, Colors} from '../ThemeStyle';
import * as Progress from 'react-native-progress';
import GrpcManager from '../components/GrpcManager';
import ILoading from '../components/ILoading';
import IdleTimerManager from 'react-native-idle-timer';
import {Provider} from '@ant-design/react-native';
import CardView from '../components/CardView';
import _ from 'lodash';
import NavBarView from '../components/NavBarView';
import DeviceControl from '../components/DeviceControl';
import AppConfig from '../../AppConfig';

export default class ZigbeeSmart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      installKey: '',
      addressKey: '',
      indeterminate: true,
      progress: 0,
      timeShow: false,
      inputShow: true,
      wait: true,
      countdown: 60,
    };
    this.rq = true;
  }

  countdown() {
    var time = 60;
    this.down = setInterval(() => {
      if (this.state.countdown > 0) {
        this.setState({
          countdown: time--,
        });
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
    this.grpcLink();

    IdleTimerManager.setIdleTimerDisabled(true);
    var _this = this;

    NotificationCenter.addObserver(
      this,
      EVENT_GRPC_CONTROLLER_CHANGE,
      (payload) => {
        if (payload.queue == 'controller') {
          switch (payload.data.op_state) {
            case 'starting':
              _this.setState(
                {
                  timeShow: true,
                  wait: false,
                  indeterminate: false,
                },
                () => {
                  _this.countdown();
                },
              );
              break;
            case 'link_key':
              if (
                payload.data.error == 0 &&
                !_.isEmpty(payload.data.link_key)
              ) {
                new DeviceControl({
                  addressKey: _this.state.addressKey,
                  link_key: payload.data.link_key,
                }).addDeviceWithLinkKey();
              } else {
                Alert.alert('Hint', 'key is error');
                _this.setState({
                  timeShow: false,
                  inputShow: true,
                  wait: true,
                });
              }
              break;
            case 'device_added':
              _this.setState(
                {
                  progress: 1,
                },
                () => {
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
            default:
              break;
          }
        }
      },
    );
  }

  componentWillUnmount() {
    IdleTimerManager.setIdleTimerDisabled(false);
    if (this.grpcManager) {
      this.grpcManager.unmount();
    }
    if (this.down) {
      clearTimeout(this.down);
      this.down = null;
    }
    NotificationCenter.removeObserver(this, EVENT_GRPC_CONTROLLER_CHANGE);
  }

  render() {
    return (
      <Provider>
        <NavBarView>
          <KeyboardAvoidingView
            behavior="padding"
            enabled
            style={{
              flex: 1,
              backgroundColor: Tme('bgColor'),
            }}>
            <CardView
              showMenu={false}
              styles={[
                {
                  width: DEVICE_WIDTH - 40,
                  height: DEVICE_HEIGHT - 169,
                  margin: 20,
                  marginBottom: 20,
                  borderRadius: 8,
                },
              ]}>
              <ILoading ref="ai" hide={true} />
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View style={{marginTop: 79}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      textAlign: 'center',
                      color: Tme('cardTextColor'),
                    }}>
                    Zigbee Secure
                  </Text>
                </View>
                {this.state.timeShow ? (
                  <View style={{marginTop: 16, alignItems: 'center'}}>
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
                          Please press buttons on the device following the
                          device manual to add the device
                        </Text>
                      </View>
                    )}
                    <Progress.Circle
                      size={140}
                      progress={this.state.progress}
                      indeterminate={this.state.indeterminate}
                      showsText={true}
                      color={Colors.MainColor}
                      formatText={(progress) => {
                        return `${this.state.countdown}`;
                      }}
                    />
                  </View>
                ) : null}
                {this.state.inputShow ? (
                  <View>
                    <View style={{padding: 16}}>
                      <Text style={{fontSize: 14, color: Tme('cardTextColor')}}>
                        Please input the device EUI64 address and the Install
                        Code, both of them should be printed on your device's
                        instruction manual. EUI64 addres has 16 characters and
                        Install Code is 36.
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: 16,
                      }}>
                      <Text
                        style={{
                          color: Tme('cardTextColor'),
                          marginBottom: 16,
                          fontSize: 16,
                          fontWeight: '600',
                        }}>
                        EUI64
                      </Text>
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
                          underlineColorAndroid="transparent"
                          autoCorrect={false}
                          autoCapitalize="characters"
                          value={this.state.addressKey}
                          maxLength={16}
                          onChangeText={(addressKey) =>
                            this.setState({addressKey})
                          }
                          style={Colors.TextInputStyle()}
                        />
                      </View>
                      <Text
                        style={{
                          color: Tme('cardTextColor'),
                          marginBottom: 16,
                          marginTop: 16,
                          fontSize: 16,
                          fontWeight: '600',
                        }}>
                        Install Code
                      </Text>
                      <View
                        style={[
                          styles.account_view,
                          {borderColor: Tme('inputBorderColor')},
                        ]}>
                        <TextInput
                          autoCapitalize="none"
                          underlineColorAndroid="transparent"
                          autoCorrect={false}
                          autoCapitalize="characters"
                          value={this.state.installKey}
                          multiline={true}
                          numberOfLines={2}
                          maxLength={36}
                          onChangeText={(installKey) =>
                            this.setState({installKey})
                          }
                          style={Colors.TextInputStyle()}
                        />
                      </View>
                    </View>
                    <View
                      style={{
                        marginTop: 20,
                        paddingHorizontal: 16,
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={this._save.bind(this)}
                        style={{
                          width: 120,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: Colors.MainColor,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#ffffff',
                            textAlign: 'center',
                          }}>
                          Save
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
            </CardView>
          </KeyboardAvoidingView>
        </NavBarView>
      </Provider>
    );
  }

  close() {
    Navigation.pop(this.props.componentId);
  }

  _save() {
    var errors = [];
    var _this = this;
    if (this.state.addressKey.length !== 16) {
      errors.push('mac key error');
    }
    if (this.state.installKey.length !== 36) {
      errors.push('install key error');
    }
    if (errors.length > 0) {
      Alert.alert(errors.join('\n'));
    } else {
      this.refs.ai.show();
      Helper.sendRequest(
        'post',
        '/controllers/zigbee_decode',
        {install_code: this.state.installKey, eui64: this.state.addressKey},
        {
          ensure: () => {
            _this.refs.ai.hide();
          },
          cloud: true,
          success: (data) => {
            _this.setState({
              timeShow: true,
              inputShow: false,
            });
          },
          error: (data) => {
            Alert.alert('install key error');
          },
        },
      );
    }
  }

  grpcLink() {
    var _this = this;
    _this.grpcManager = new GrpcManager();
    _this.grpcManager.mount();
  }
}
const styles = StyleSheet.create({
  account_view: {
    borderWidth: 1,
    borderRadius: 16,
    height: 66,
  },
});
