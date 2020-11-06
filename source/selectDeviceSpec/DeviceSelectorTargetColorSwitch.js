import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {Helper, DEVICE_WIDTH, DEVICE_HEIGHT} from '../Helper';
import _ from 'lodash';
import {
  Modal,
} from '@ant-design/react-native';
import {observer} from 'mobx-react';
import CheckBox from 'react-native-check-box';
import {Tme, Colors} from '../ThemeStyle';
import {observable} from 'mobx';
import tinycolor from 'tinycolor2';
import {NotificationCenter, BOTTOM_DRAWER_CLOSE} from '../NotificationCenter';
import Icons from 'react-native-vector-icons/Ionicons';
import ColorData from '../components/ColorData';
import {Navigation} from 'react-native-navigation';
class Tool {
  @observable color = tinycolor('#fffff').toHsl();
}
import DeviceControl from '../components/DeviceControl';

@observer
export default class DeviceSelectorTargetColorSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.tool = new Tool();
    var r = 255;
    var g = 255;
    var b = 255;
    if (this.props.target.spec_value !== '') {
      var rgb = this.props.target.spec_value.split('|');
      if (rgb.length == 3) {
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
      }
    }
    this.state = {
      r: r,
      g: g,
      b: b,
      delay: this.props.target.delay || '0',
      delayValue: this.props.target.delay || '0',
      checked: this.props.target.checked,
    };

    this.color = tinycolor('rgb(' + r + ',' + g + ',' + b + ')').toHsl();
  }

  render() {
    return (
      <View>
        <View
          style={{
            backgroundColor: Tme('cardColor'),
          }}>
          <View style={{padding: 16}}>
            <View style={{marginBottom: 20, marginTop: 16}}>
              <CheckBox
                rightTextStyle={{
                  fontWeight: '300',
                  fontSize: 16,
                  color: Tme('cardTextColor'),
                }}
                onClick={this.onClick.bind(this)}
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
              style={{
                paddingTop: 40,
                paddingBottom: 20,
                paddingHorizontal: 20,
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.settingColor.bind(this)}
                style={[
                  Colors.CardShadowStyle(),
                  {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 12,
                    backgroundColor: Tme('cardColor'),
                    borderRadius: 8,
                    shadowOpacity: 1.0,
                    shadowRadius: 15,
                    shadowColor:
                      'rgb(' +
                      this.state.r +
                      ',' +
                      this.state.g +
                      ',' +
                      this.state.b +
                      ')',
                  },
                ]}>
                <Text
                  style={{
                    color: Tme('cardTextColor'),
                    fontSize: 17,
                    fontWeight: '500',
                  }}>
                  Change Color
                </Text>
              </TouchableOpacity>
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

  settingColor() {
    this.tool.color = tinycolor(
      'rgb(' + this.state.r + ',' + this.state.g + ',' + this.state.b + ')',
    ).toHsl();
    Navigation.showOverlay({
      component: {
        name: 'BottomDrawer',
        passProps: {
          content: this.renderContent(),
        },
        options: {
          layout: {
            componentBackgroundColor: 'transparent',
          },
          overlay: {
            interceptTouchOutside: true,
          },
        },
      },
    });
  }

  renderContent() {
    var rgb = this.state.r + ',' + this.state.g + ',' + this.state.b;
    var html = [];
    _.forEach(_.chunk(ColorData, 3), (value, key) => {
      var temp = [];
      _.forEach(value, (item) => {
        temp.push(
          <TouchableOpacity
            key={item.color}
            activeOpacity={0.8}
            onPress={this.save.bind(this, item.color)}
            style={[
              {
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: 'rgb(' + item.color + ')',
                justifyContent: 'center',
                alignItems: 'center',
              },
              rgb == item.color
                ? {
                    borderWidth: 5,
                    borderColor: Tme('smallTextColor'),
                  }
                : {borderColor: 1, borderColor: Tme('smallTextColor')},
            ]}>
            {rgb == item.color ? (
              <Icons name="ios-checkmark" size={40} color={Tme('textColor')} />
            ) : null}
          </TouchableOpacity>,
        );
      });
      html.push(
        <View
          key={key}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          {temp}
        </View>,
      );
    });
    return html;
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
      this.setState(
        {
          checked: true,
        },
        () => {
          this.save();
        },
      );
    }
  }

  save(color) {
    var value = this.state.r + '|' + this.state.g + '|' + this.state.b;
    var param = Helper.colorSwitchCmdParams(
      this.props.spec.value_hash,
      [this.state.r, this.state.g, this.state.b],
      this.props.spec.dv_type,
    );
    var deviceControl = new DeviceControl({
      spec: this.props.spec,
      color: [this.state.r, this.state.g, this.state.b],
    });
    if (color) {
      var rgb = color.split(',');
      this.setState({
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
        checked: true,
      });

      value = rgb[0] + '|' + rgb[1] + '|' + rgb[2];
      param = Helper.colorSwitchCmdParams(
        this.props.spec.value_hash,
        rgb,
        this.props.spec.dv_type,
      );
      deviceControl = new DeviceControl({spec: this.props.spec, color: rgb});
    }
    deviceControl.colorSwitch((cmd) => {
      this.props.target.commands = cmd;
    });

    this.props.target.node_id = this.props.spec.device_id;
    this.props.target.value_id = this.props.spec.value_id;
    this.props.target.instance_id = this.props.spec.instance_id;
    this.props.target.spec_cc = this.props.spec.cc;
    this.props.target.spec_name = this.props.spec.name;
    this.props.target.spec_value = value;
    this.props.target.params = param;
    this.props.target.desp = param;
    this.props.target.app_url = this.props.spec.app_url;
    this.props.target.delay = this.state.delay;
    this.props.target.checked = true;
    this.props.target.target_type = this.props.spec.dv_type;
    this.props.spec_settings.targets.push(this.props.target);
    if (color) {
      NotificationCenter.dispatchEvent(BOTTOM_DRAWER_CLOSE);
    }
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
