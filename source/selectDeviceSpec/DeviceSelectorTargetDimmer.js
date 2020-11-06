import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import I18n from '../I18n';
import {
  Slider,
  SegmentedControl,
  Modal,
} from '@ant-design/react-native';
import {observer} from 'mobx-react';
import CheckBox from 'react-native-check-box';
import {Tme, Colors} from '../ThemeStyle';
import DeviceControl from '../components/DeviceControl';

@observer
export default class DeviceSelectorTargetDimmer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      initialValue: 0,
      delay: this.props.target.delay || '0',
      delayValue: this.props.target.delay || '0',
      modalVisible: false,
      checked: this.props.target.checked,
      runParam: 0,
    };
  }

  componentDidMount() {
    var params = parseInt(this.props.target.params);

    var value, initialValue, runParam;
    if (this.props.spec.dv_type == 'zwave') {
      if (isNaN(params) || params == 0) {
        value = 0;
        runParam = initialValue = 0;
      } else if (params == 255) {
        value = 1;
        runParam = initialValue = 0;
      } else if (params == 99) {
        value = 2;
        runParam = initialValue = 99;
      } else if (params > 0 && params < 99) {
        value = 1;
        runParam = initialValue = params;
      }
    } else {
      if (isNaN(params)) {
        value = 1;
        initialValue = 0;
      } else {
        initialValue = parseInt((99 / 255) * params);
        runParam = params;
      }
    }
    this.setState({
      value: value,
      initialValue: initialValue,
      runParam: runParam,
    });
  }

  render() {
    return (
      <View style={{paddingHorizontal: 8}}>
        <View
          style={{
            backgroundColor: Tme('cardColor'),
            borderRadius: 4,
          }}>
          <View style={{padding: 10}}>
            <View style={{marginBottom: 20, marginTop: 16}}>
              <CheckBox
                rightTextStyle={{
                  fontWeight: '300',
                  fontSize: 16,
                  color: Tme('cardTextColor'),
                }}
                onClick={() => this.onClick()}
                rightText={Helper.i(this.props.spec.name)}
                isChecked={this.state.checked}
                checkedImage={
                  <Image
                    source={require('../../img/checkbox-checked.png')}
                    style={{width: 17, height: 17}}
                  />
                }
                unCheckedImage={
                  <Image
                    source={require('../../img/Checkbox.png')}
                    style={{width: 17, height: 17}}
                  />
                }
              />
            </View>
            {this.props.spec.dv_type == 'zigbee' ? null : (
              <View style={{height: 40}}>
                <SegmentedControl
                  tintColor={Colors.MainColor}
                  fontStyle={{color: Tme('CardTextColor')}}
                  activeFontStyle={{color: '#ffffff'}}
                  values={[
                    I18n.t('spec.off_b'),
                    I18n.t('spec.on_b'),
                    I18n.t('spec.full'),
                  ]}
                  selectedIndex={this.state.value}
                  style={{flex: 1, height: 35}}
                  onChange={this.switch_change.bind(this)}
                />
              </View>
            )}
            <View style={{marginTop: 8}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                  marginTop: 20,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '500',
                    color: Tme('cardTextColor'),
                  }}>
                  {this.state.initialValue}
                </Text>
              </View>
              <Slider
                min={0}
                max={99}
                step={1}
                minimumTrackTintColor={Colors.MainColor}
                value={this.state.initialValue}
                onChange={this.slider_change.bind(this, 'change')}
                onAfterChange={this.slider_change.bind(this, 'after')}
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontWeight: '500', color: Tme('cardTextColor')}}>
                  0
                </Text>
                <Text style={{fontWeight: '500', color: Tme('cardTextColor')}}>
                  99
                </Text>
              </View>
            </View>
            <View style={{marginTop: 16}}>
              <Text
                style={{
                  fontWeight: '300',
                  fontSize: 14,
                  color: Tme('cardTextColor'),
                }}>
                Delay(s)
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.delay.bind(this)}
                style={[
                  styles.accountView,
                  {borderColor: Tme('inputBorderColor')},
                ]}>
                <Text
                  style={{
                    lineHeight: 40,
                    height: 40,
                    marginLeft: 6,
                    color: Tme('placeholder'),
                    marginRight: 6,
                  }}>
                  {this.state.delay}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Modal
          title="Delay"
          transparent
          onClose={this.closeModal.bind(this)}
          visible={this.state.modalVisible}
          footer={[
            {text: 'Cancel', onPress: () => console.log('cancel')},
            {
              text: 'Confirm',
              onPress: () => {
                var value = this.state.delayValue;
                if (this.state.delayValue == '') {
                  value = 0;
                }
                this.setState(
                  {
                    delay: value,
                  },
                  () => {
                    this.save();
                  },
                );
              },
            },
          ]}
          style={{
            bottom: 100,
            backgroundColor: Tme('bgColor'),
          }}>
          <View
            style={{
              padding: 3,
              borderColor: Tme('inputBorderColor'),
              borderWidth: 1,
              borderRadius: 3,
              marginTop: 8,
            }}>
            <TextInput
              autoFocus={true}
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              autoCorrect={false}
              keyboardType="number-pad"
              returnKeyType="go"
              value={
                this.state.delayValue == '0'
                  ? ''
                  : this.state.delayValue.toString()
              }
              onChangeText={(name) =>
                this.setState({
                  delayValue: name,
                })
              }
              placeholderTextColor={Tme('placeholder')}
              style={Colors.TextInputStyle()}
            />
          </View>
        </Modal>
      </View>
    );
  }

  closeModal() {
    this.setState({
      modalVisible: false,
    });
  }
  delay() {
    this.setState({
      modalVisible: true,
    });
  }

  parseParam(param) {
    if (this.props.spec.dv_type == 'zigbee') {
      return parseInt((255 / 99) * param);
    } else {
      return param;
    }
  }

  slider_change(type, e) {
    var value;
    if (e === 0) {
      value = 0;
    } else if (e === 99) {
      value = 2;
    } else {
      value = 1;
    }
    var param = this.parseParam(e);
    this.setState(
      {
        value: value,
        initialValue: e,
        runParam: param,
      },
      () => {
        if (type == 'after') {
          this.save();
        }
      },
    );
  }

  switch_change(e) {
    var value = e.nativeEvent.selectedSegmentIndex;
    var initialValue = this.state.initialValue;
    if (value == 2) {
      initialValue = 99;
    } else if (value == 0) {
      initialValue = 0;
    }
    this.setState(
      {
        value: value,
        initialValue: initialValue,
        runParam: initialValue,
      },
      () => {
        this.save();
      },
    );
  }

  onClick() {
    if (this.state.checked == true) {
      this.setState(
        {
          checked: false,
        },
        () => {
          this.props.target.checked = false;
        },
      );
    } else {
      this.save();
    }
  }

  save() {
    var desp, param, status;
    if (this.state.value == 0) {
      param = 0;
      desp = 'Off';
      status = 'Off';
    } else if (this.state.value == 1) {
      status = 'On';
      param = 255;
      desp = 'On';
    } else if (this.state.value == 2) {
      param = 99;
      desp = 'On';
      status = 'Full';
    }

    if (this.state.runParam > 0) {
      param = this.state.runParam;
      if (this.props.spec.dv_type == 'zwave') {
        desp = this.state.runParam + '%';
      } else {
        desp = parseInt((100 / 255) * this.state.runParam) + '%';
      }
      status = 'On';
    }
    this.setState({
      checked: true,
    });

    var deviceControl = new DeviceControl({
      spec: this.props.spec,
      param: param,
    });

    deviceControl.dimmer((cmd) => {
      this.props.target.commands = cmd;
    });
    this.props.target.node_id = this.props.spec.device_id;
    this.props.target.value_id = this.props.spec.value_id;
    this.props.target.instance_id = this.props.spec.instance_id;
    this.props.target.spec_cc = this.props.spec.cc;
    this.props.target.spec_name = this.props.spec.name;
    this.props.target.spec_value = status;
    this.props.target.params = param;
    this.props.target.desp = desp;
    this.props.target.app_url = this.props.spec.app_url;
    this.props.target.delay = this.state.delay;
    this.props.target.checked = true;
    this.props.target.target_type = this.props.spec.dv_type;
    this.props.spec_settings.targets.push(this.props.target);
  }
}
const styles = StyleSheet.create({
  accountView: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 16,
    marginBottom: 20,
  },
});
