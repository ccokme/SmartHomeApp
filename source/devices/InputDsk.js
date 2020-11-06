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
import {CameraKitCameraScreen} from 'react-native-camera-kit';
import ILoading from '../components/ILoading';
import IdleTimerManager from 'react-native-idle-timer';
import {Provider} from '@ant-design/react-native';
import DeviceControl from '../components/DeviceControl';
import CardView from '../components/CardView';
import NavBarView from '../components/NavBarView';

export default class InputDsk extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dsk: '',
      indeterminate: true,
      progress: 0,
      timeShow: false,
      inputShow: this.props.type == 'input',
      scanShow: this.props.type == 'scan',
      wait: true,
    };
    this.rq = true;
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
            case 'set_pl_success':
              _this.setState({
                wait: false,
                indeterminate: false,
              });
              break;
            case 'set_pl_failed':
              _this.setState(
                {
                  indeterminate: true,
                  progress: 0,
                },
                () => {
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
                },
              );
              break;
            case 'in_progress_ss':
              _this.setState({
                progress: 0.2,
              });
              break;
            case 'in_progress':
              _this.setState({
                progress: 0.4,
              });
              break;
            case 'in_progress_1':
              _this.setState({
                progress: 0.6,
              });
              break;
            case 'in_progress_2':
              _this.setState({
                progress: 0.8,
              });
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
            <ILoading ref="ai" hide={true} />
            {this.state.scanShow ? (
              <CameraKitCameraScreen
                scanBarcode={true}
                showFrame={true}
                laserColor={'blue'}
                frameColor={Colors.MainColor}
                onReadCode={(event) => this.readCode(event)}
                hideControls={false}
                colorForScannerFrame={'red'} //(default white) optional, change colot of the scanner frame
              />
            ) : (
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
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{marginTop: 79}}>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: '600',
                        textAlign: 'center',
                        color: Tme('cardTextColor'),
                      }}>
                      Smart Start
                    </Text>
                  </View>
                  {this.state.timeShow ? (
                    <View style={{marginTop: 16}}>
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
                      ) : null}
                      <Progress.Circle
                        size={140}
                        color={Colors.MainColor}
                        progress={this.state.progress}
                        indeterminate={this.state.indeterminate}
                        showsText={true}
                      />
                    </View>
                  ) : null}
                  {this.state.inputShow ? (
                    <View>
                      <View style={{padding: 16}}>
                        <Text
                          style={{fontSize: 14, color: Tme('cardTextColor')}}>
                          Please input the full device key, which should be 40
                          digits, you can refer to the deivce manual to get the
                          device key
                        </Text>
                      </View>
                      <View
                        style={{
                          padding: 16,
                        }}>
                        <Text
                          style={{
                            marginBottom: 16,
                            fontSize: 16,
                            fontWeight: '600',
                          }}>
                          DSK
                        </Text>
                        <View
                          style={[
                            styles.accountView,
                            {borderColor: Tme('inputBorderColor')},
                          ]}>
                          <TextInput
                            returnKeyType="go"
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            underlineColorAndroid="transparent"
                            autoCorrect={false}
                            value={this.state.dsk}
                            multiline={true}
                            numberOfLines={2}
                            maxLength={40}
                            onChangeText={(dsk) => this.setState({dsk})}
                            onSubmitEditing={this._save.bind(this)}
                            style={Colors.TextInputStyle()}
                          />
                        </View>
                      </View>
                      <View style={{marginTop: 20, alignItems: 'center'}}>
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
            )}
          </KeyboardAvoidingView>
        </NavBarView>
      </Provider>
    );
  }

  readCode(event) {
    var _this = this;
    if (this.rq) {
      _this.rq = false;
      Helper.sendRequest(
        'post',
        '/controllers/smart_add',
        {code: event.nativeEvent.codeStringValue},
        {
          success: (data) => {
            this.setState({
              scanShow: false,
              timeShow: true,
            });
          },
          ensure: () => {},
        },
      );
    }
  }

  close() {
    Navigation.pop(this.props.componentId);
  }

  _save() {
    var value = '';
    if (this.state.dsk) {
      if (/^\d{40}$/.test(this.state.dsk)) {
        var temp = this.state.dsk;
        var dsk = temp.replace(/(.{5})/g, '$1-');
        value = dsk.substring(0, dsk.length - 1);
      } else {
        Alert.alert('The device key must be 40 digits');
        return;
      }
    } else {
      Alert.alert('The device key must be 40 digits');
      return;
    }

    if (value !== '') {
      new DeviceControl({value: value}).setPl();
      this.setState({
        inputShow: false,
        timeShow: true,
      });
    }
  }

  Xreplace(str, length) {
    var re = new RegExp('\\d{1, ' + length + '}', 'g');
    var ma = str.match(re);
    return ma.join('-');
  }

  grpcLink() {
    var _this = this;
    _this.grpcManager = new GrpcManager();
    _this.grpcManager.mount();
  }
}
const styles = StyleSheet.create({
  accountView: {
    borderWidth: 1,
    borderRadius: 16,
    height: 66,
  },
});
