import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Alert} from 'react-native';
import {Colors, Tme} from '../ThemeStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ILoading from '../components/ILoading';
import {Helper, HelperMemo} from '../Helper';
const updated = 'yes';

export default class SettingScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        visible: false,
        noBorder: true,
        elevation: 0,
      },
    };
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{height: HelperMemo.STATUS_BAR_HEIGHT}}></View>
        <View
          style={{
            height: HelperMemo.NAV_BAR_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{color: Colors.MainColor, fontSize: 16, fontWeight: '600'}}>
            Settings
          </Text>
        </View>
        <View
          style={{
            backgroundColor: Tme('bgColor'),
            flex: 1,
          }}>
          <View style={{height: 20}}></View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.click.bind(this, 'restart')}
            style={{backgroundColor: Tme('cardColor')}}>
            <View
              style={{
                marginLeft: 18,
                marginRight: 20,
                flexDirection: 'row',
                paddingVertical: 16,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="md-refresh"
                  size={20}
                  color={Tme('textColor')}
                  style={{marginLeft: 2}}
                />
                <Text style={{marginLeft: 15, color: Tme('cardTextColor')}}>
                  Restart
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color={Tme('textColor')}
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={{height: 2}}></View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.click.bind(this, 'reset')}
            style={{backgroundColor: Tme('cardColor')}}>
            <View
              style={{
                marginLeft: 18,
                marginRight: 20,
                flexDirection: 'row',
                paddingVertical: 16,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons
                  name="settings-backup-restore"
                  size={20}
                  color={Tme('textColor')}
                />
                <Text style={{marginLeft: 11, color: Tme('cardTextColor')}}>
                  Reset
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color={Tme('textColor')}
                />
              </View>
            </View>
          </TouchableOpacity>
          <View style={{height: 2}}></View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.click.bind(this, 'update')}
            style={{backgroundColor: Tme('cardColor')}}>
            <View
              style={{
                marginLeft: 18,
                marginRight: 20,
                flexDirection: 'row',
                paddingVertical: 16,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons
                  name="cloud-download"
                  size={20}
                  color={Tme('textColor')}
                />
                <Text style={{marginLeft: 11, color: Tme('cardTextColor')}}>
                  Upgrade Controller
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color={Tme('textColor')}
                />
              </View>
            </View>
          </TouchableOpacity>
          <ILoading ref="ai" hide={true} />
        </View>
      </View>
    );
  }

  click(name) {
    var url = '';
    var _this = this;
    switch (name) {
      case 'restart':
        url = '/settings/restart';
        _this.restart(url);
        break;
      case 'update':
        _this.update();
        break;
      case 'reset':
        _this.reset();
        break;
      default:
        break;
    }
  }

  restart(url) {
    var _this = this;
    Alert.alert(
      'Restart controller?',
      'Are you sure to restart the controller？',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
        },
        {
          text: 'Confirm',
          onPress: () => {
            this.refs.ai.show();
            Helper.sendRequest('post', url, '', {
              ensure: () => {
                _this.refs.ai.hide();
              },
              success: (data) => {},
            });
          },
        },
      ],
    );
  }

  reset(url) {
    var _this = this;
    Alert.alert(
      'Reset controller?',
      'Reset the controller to factory state, all the data will be purged.\n\nIncluding: devices data, timezone setting, WiFi setting, controller PIN and rooms/scenes/actions/automations etc.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
        },
        {
          text: 'Confirm',
          onPress: () => {
            this.refs.ai.show();
            Helper.sendRequest('post', 'settings/set_factory_default', '', {
              ensure: () => {
                _this.refs.ai.hide();
              },
              success: (data) => {
                Alert.alert(
                  'Your controller has been reset successfully.',
                  'Your controller will be restarted soon, it will take up to 3 minutes to fininsh the rebooting.',
                  [
                    {
                      text: 'Confirm',
                      onPress: () => {},
                    },
                  ],
                );
              },
            });
          },
        },
      ],
    );
  }
  update() {
    var _this = this;
    if (updated === 'yes') {
      _this.refs.ai.show();
      Helper.sendRequest(
        'post',
        '/settings/upgrade',
        {updated: 'yes'},
        {
          ensure: () => {
            _this.refs.ai.hide();
          },
          error: () => {
            Alert.alert('Your controller is up to date!');
          },
          success: (data) => {
            Alert.alert(
              'New version available: ' + data.v,
              'It will take about 5 minutes to finish the update, it depends on your network speed.\n\nContinue to update?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('cancel'),
                },
                {
                  text: 'Confirm',
                  onPress: () => {
                    _this.refs.ai.show();
                    Helper.sendRequest(
                      'post',
                      '/settings/upgrade',
                      {updated: 'no'},
                      {
                        success: (data) => {
                          _this.refs.ai.hide();
                          Alert.alert(
                            'Updating...',
                            "Controller is updating, please don't turn off the power of your controller, it will take about 5 minutes to finish, it depends on your network speed.\n\nController will reboot when the update is completed, and you will get a notification.",
                          );
                        },
                        error: () => {
                          Alert.alert('Your controller is up to date!');
                        },
                      },
                    );
                  },
                },
              ],
            );
          },
        },
      );
    }
  }
}
