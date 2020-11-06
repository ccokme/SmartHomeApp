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
import {Slider, SegmentedControl, Modal} from '@ant-design/react-native';
import CheckBox from 'react-native-check-box';
import {Tme, Colors} from '../ThemeStyle';
import DeviceControl from '../components/DeviceControl';

export default class DeviceSelectorTargetDoorLock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.spec.value == 'unlock' ? 1 : 0,
      delay: this.props.target.delay || '0',
      delayValue: this.props.target.delay || '0',
      modalVisible: false,
      checked: this.props.target.checked,
    };
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
            <View style={{height: 40}}>
              <SegmentedControl
                tintColor={Colors.MainColor}
                fontStyle={{color: Tme('CardTextColor')}}
                activeFontStyle={{color: '#ffffff'}}
                values={[I18n.t('spec.lock'), I18n.t('spec.unlock')]}
                selectedIndex={this.state.value}
                style={{flex: 1, height: 35}}
                onChange={this.handleRadioChange.bind(this)}
              />
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

  handleRadioChange(e) {
    var status = e.nativeEvent.selectedSegmentIndex;
    this.setState(
      {
        value: status,
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
    var value = this.state.value;
    var param, status;
    if (value == 0) {
      status = 'lock';
      param = 255;
    } else {
      status = 'unlock';
      param = 0;
    }

    this.setState({
      checked: false,
    });
    var deviceControl = new DeviceControl({
      spec: this.props.spec,
      param: param,
    });

    deviceControl.switch((cmd) => {
      this.props.target.commands = cmd;
    });
    this.props.target.node_id = this.props.spec.device_id;
    this.props.target.value_id = this.props.spec.value_id;
    this.props.target.instance_id = this.props.spec.instance_id;
    this.props.target.spec_cc = this.props.spec.cc;
    this.props.target.spec_name = this.props.spec.name;
    this.props.target.app_url = this.props.spec.app_url;
    this.props.target.spec_value = status;
    this.props.target.params = param;
    this.props.target.desp = status;
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
