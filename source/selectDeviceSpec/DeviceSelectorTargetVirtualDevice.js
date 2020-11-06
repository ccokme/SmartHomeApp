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
import {Modal, SegmentedControl} from '@ant-design/react-native';
import CheckBox from 'react-native-check-box';
import {Tme, Colors} from '../ThemeStyle';

export default class DeviceSelectorTargetVirtualDevice extends React.Component {
  constructor(props) {
    super(props);

    var initialValue = 0;
    if (this.props.target.target_type == 'manual') {
      initialValue = 1;
    }

    this.state = {
      value: this.props.target.app_url || '',
      initialValue: initialValue,
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
            <View
              style={[
                styles.accountView,
                {borderColor: Tme('inputBorderColor')},
              ]}>
              <TextInput
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                autoCorrect={false}
                placeholderTextColor={Tme('placeholder')}
                style={Colors.TextInputStyle()}
                value={this.state.value}
                onChangeText={(value) => {
                  this.setState({value: value}, () => {
                    this.save();
                  });
                }}
              />
            </View>
            <View style={{height: 40}}>
              <SegmentedControl
                tintColor={Colors.MainColor}
                fontStyle={{color: Tme('CardTextColor')}}
                activeFontStyle={{color: '#ffffff'}}
                values={['Auto', 'Manual']}
                selectedIndex={this.state.initialValue}
                style={{flex: 1, height: 35}}
                onChange={this.switch_change.bind(this)}
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
                    color: Tme('placeholder'),
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

  switch_change(e) {
    this.setState(
      {
        initialValue: e.nativeEvent.selectedSegmentIndex,
      },
      () => {
        this.save();
      },
    );
  }

  save() {
    var param = 'auto';
    if (this.state.initialValue == 1) {
      param = 'manual';
    }
    this.setState({
      checked: true,
    });
    this.props.target.node_id = this.props.spec.device_id;
    this.props.target.value_id = this.props.spec.value_id;
    this.props.target.instance_id = this.props.spec.instance_id;
    this.props.target.spec_name = this.props.spec.name;
    this.props.target.app_url = this.state.value;
    this.props.target.target_type = param;
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
    marginBottom: 20,
    marginTop: 16,
  },
});
