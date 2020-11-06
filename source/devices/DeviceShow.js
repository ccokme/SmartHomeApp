import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import ILoading from '../components/ILoading';
import {Helper, DEVICE_HEIGHT, DEVICE_WIDTH} from '../Helper';
import DeviceType from '../deviceSpec/DeviceType';
import DeviceItemCCSpecs from '../deviceSpec/DeviceItemCCSpecs';
import {Provider, ActionSheet} from '@ant-design/react-native';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import {Colors, Tme} from '../ThemeStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavBarView from '../components/NavBarView';
import DeviceControl from '../components/DeviceControl';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class DeviceShow extends Component {
  static defaultProps = {
    draggableRange: {
      top: DEVICE_HEIGHT,
      bottom: 138,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      isDataLoaded: false,
      device: {},
      show_modal: false,
      changeName: this.props.data ? this.props.data.display_name : '',
      show_view: false,
      modalVisible: false,
      clickRow: '',
      showSheet: false,
      showLoading: false,
      showLoadingError: false,
      isAlive: false,
      showLoadingErrorText: '',
    };

    this.setpoint_type = '';
  }

  componentDidMount() {
    this.doFetchData();
    Navigation.events().bindComponent(this);
  }

  doFetchData() {
    var _this = this;
    _this.refs.ai.show();
    Helper.sendRequest('get', '/devices/' + this.props.data.uuid, '', {
      success: (data) => {
        _this.setState({
          device: data.device,
          isAlive: data.device.is_alive,
          show_view: true,
        });
      },
      ensure: () => {
        _this.refs.ai.hide();
      },
    });
  }

  onFailed(data) {
    this.setState({
      showLoading: false,
      showLoadingError: true,
      showLoadingErrorText: data.message,
    });
  }

  onRetryConnect() {
    this.setState({
      showLoading: false,
      showLoadingError: false,
      showLoadingErrorText: '',
    });
  }

  onClose() {
    if (!this.state.showLoading) {
      this.setState({
        showLoading: true,
        showLoadingError: false,
        showLoadingErrorText: '',
      });
    }
  }

  navigationButtonPressed({buttonId}) {
    var _this = this;
    if (buttonId === 'edit') {
      _this.edit();
    }
    if (buttonId == 'delete') {
      if (this.state.device.dv_type == 'zwave') {
        this.sheetShow();
      } else if (this.state.device.dv_type == 'zigbee') {
        Alert.alert(
          'Remove Device',
          'Are you sure to do this?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                _this.refs.ai.show();
                new DeviceControl({
                  type: 'zigbee',
                  index: _this.state.device.index,
                  long_id: _this.state.device.long_id,
                }).removeDevice();
                Helper.sendRequest(
                  'post',
                  '/devices/delete',
                  {uuid: _this.state.device.uuid},
                  {
                    ensure: () => {
                      _this.refs.ai.hide();
                    },
                    success: (data) => {
                      Navigation.pop(_this.props.componentId);
                    },
                  },
                );
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          'Remove Device',
          'Are you sure to do this?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                var _this = this;
                _this.refs.ai.show();
                Helper.sendRequest(
                  'post',
                  '/devices/delete',
                  {uuid: _this.state.device.uuid},
                  {
                    ensure: () => {
                      _this.refs.ai.hide();
                    },
                    success: (data) => {
                      Navigation.pop(_this.props.componentId);
                    },
                  },
                );
              },
            },
          ],
          {cancelable: false},
        );
      }
    }
  }

  render() {
    const bottom =
      Platform.OS === 'ios'
        ? _.includes(DeviceInfo.getModel(), 'x') ||
          DeviceInfo.getModel() === '11'
          ? 35
          : 0
        : 0;
    if (this.state.show_view) {
      var icon = Helper.getDeviceIcon(this.state.device);
      return (
        <Provider>
          <NavBarView>
            <ILoading ref="ai" hide={true} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                flex: 1,
                paddingBottom: 30,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={this.doFetchData.bind(this)}
                />
              }>
              <View style={{padding: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MCIcons
                    size={24}
                    color={Tme('cardTextColor')}
                    name={icon}
                    style={{marginRight: 8}}
                  />
                  <Text
                    style={[
                      {color: Tme('cardTextColor')},
                      Colors.TitleFontStyle,
                    ]}>
                    {this.state.device.display_name}
                  </Text>
                  {this.state.device.dv_type !== 'camera' ? (
                    this.state.showLoadingError ? (
                      <TouchableOpacity
                        style={{marginLeft: 8}}
                        activeOpacity={0.8}
                        onPress={() => {
                          Alert.alert(this.state.showLoadingErrorText);
                        }}>
                        <Ionicons
                          size={24}
                          color={Tme('textColor')}
                          name="ios-alert"
                        />
                      </TouchableOpacity>
                    ) : (
                      <ActivityIndicator
                        style={{marginLeft: 8}}
                        animating={this.state.showLoading}
                        size="small"
                        color={Tme('textColor')}
                      />
                    )
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: 32}} />
                    <DeviceType device={this.state.device} />
                  </View>
                  {this.state.isAlive ? null : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        Alert.alert(
                          'Hint',
                          "This device is unresponsive, you can try to power cycle it, or turn it on/off, or trigger it to test if it's malfunctional or low battery. If it keeps unresponsive for a long time, you should try to reset it or remove it.",
                        );
                      }}>
                      <Ionicons
                        name="ios-information-circle-outline"
                        size={22}
                        color="#fc577acc"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <DeviceItemCCSpecs
                parent={this}
                componentId={this.props.componentId}
                device={this.state.device}
                from="device"
              />
            </ScrollView>
          </NavBarView>
        </Provider>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: Tme('bgColor'),
          }}>
          <ILoading ref="ai" hide={true} />
        </View>
      );
    }
  }

  sheetShow() {
    var _this = this;
    ActionSheet.showActionSheetWithOptions(
      {
        options: ['Remove as failed device', 'Remove directly', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        _this.SheetClick(buttonIndex);
      },
    );
  }

  SheetClick(index) {
    if (index === 0) {
      this.delete();
    }
    if (index == 1) {
      this.deleteField();
    }
  }

  edit() {
    if (this.state.device.dv_type != 'camera') {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'AddSuccess',
          passProps: {
            uuid: this.state.device['uuid'],
            name: this.state.changeName,
            type: 'edit',
          },
          options: {
            topBar: {
              title: {
                text: 'Change device name',
              },
            },
          },
        },
      });
    } else {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'AddCamera',
          passProps: {
            uuid: this.state.device.uuid,
            video_url: this.state.device.cc_specs[0].video_url,
            screenshot_url: this.state.device.cc_specs[0].screenshot_url,
            name: this.state.device.device_name,
          },
          options: {
            topBar: {
              elevation: 0,
              title: {
                text: 'IP Camera',
              },
            },
            bottomTabs: {
              visible: false,
              drawBehind: true,
            },
          },
        },
      });
    }
  }

  deleteField() {
    var _this = this;
    Alert.alert(
      'Hint',
      'If this device is lost or malfunctional you can remove this device directly. It will appear again if it continues to communicate with your controller',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            _this.refs.ai.show();
            Helper.sendRequest(
              'post',
              '/devices/delete',
              {uuid: this.state.device.uuid},
              {
                ensure: () => {
                  _this.refs.ai.hide();
                },
                success: (data) => {
                  Navigation.pop(this.props.componentId);
                },
              },
            );
          },
        },
      ],
      {cancelable: false},
    );
  }

  delete() {
    var _this = this;
    Alert.alert(
      'Hint',
      'Remove this failed device, this operation may fail if this device is not recognized as a failed device',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            _this.refs.ai.show();
            new DeviceControl({
              index: _this.state.device.index,
              sn_id: this.props.device.sn_id,
            }).removeZwaveFailedDevice();
            _this.refs.ai.hide();
          },
        },
      ],
      {cancelable: false},
    );
  }
}
const styles = StyleSheet.create({
  acount: {
    height: 40,
    paddingLeft: 4,
  },
  accountView: {
    marginTop: 20,
    borderColor: '#d8dbe2',
    borderWidth: 1,
    borderRadius: 3,
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
  },
  panelHeader: {
    height: 50,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
