import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import { Helper } from "../Helper"
import _ from "lodash"
import { Slider, SegmentedControl, Modal } from "@ant-design/react-native";
import CheckBox from 'react-native-check-box'
import { Tme, Colors } from "../ThemeStyle"
import DeviceControl from "../components/DeviceControl";

export default class DeviceSelectorTargetThermostatMode extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      value: this.props.target.params,
      time: this.props.time,
      delay: this.props.target.delay || "0",
      delayValue: this.props.target.delay || "0",
      modalVisible: false,
      checked: this.props.target.checked
    };
    this.props.spec_settings.setpoint_type = this.props.target.params
  }


  render() {
    var _this = this;
    var options = _.sortBy(this.props.spec.options, function (n) { return n.val }).map(function (option, key) {
      if (_this.state.value == option.val) {
        return (
          <TouchableOpacity
            key={key}
            activeOpacity={0.8}
            onPress={_this.setMode.bind(_this, option.val)}
            style={{
              marginRight: 16,
              paddingVertical: 10,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.MainColor,
              borderRadius: 8,
              marginTop: 16
            }}>
            <Text style={{ color: "white", fontSize: 17 }}>{Helper.i(option.name)}</Text>
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity
            key={key}
            activeOpacity={0.8}
            onPress={_this.setMode.bind(_this, option.val)}
            style={{
              marginRight: 16,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: Tme("smallTextColor"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              marginTop: 16
            }}>
            <Text style={{ color: Tme("cardTextColor"), fontSize: 17 }}>{Helper.i(option.name)}</Text>
          </TouchableOpacity>
        )
      }
    });
    return (
      <View style={{ paddingHorizontal: 8 }}>
        <View style={{
          backgroundColor: Tme("cardColor"),
          borderRadius: 4,
        }}>
          <View style={{ padding: 10 }}>
            <View style={{ marginBottom: 20, marginTop: 16 }}>
              <CheckBox
                rightTextStyle={{ fontWeight: "300", fontSize: 16, color: Tme("cardTextColor") }}
                onClick={() => this.onClick()}
                rightText={Helper.i(this.props.spec.name)}
                isChecked={this.state.checked}
                checkedImage={<Image source={require("../../img/checkbox2-checked.png")}
                  style={{ width: 17, height: 17, }} />}
                unCheckedImage={<Image source={require("../../img/checkbox2.png")}
                  style={{ width: 17, height: 17 }} />}
              />
            </View>
            <View style={{ flexDirection: "row", flex: 1, flexWrap: 'wrap', }}>
              {options}
            </View>
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontWeight: "300", fontSize: 14, color: Tme("cardTextColor") }} >Delay(s)</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={this.delay.bind(this)}
                style={[styles.accountView, { borderColor: Tme("inputBorderColor") }]}>
                <Text
                  style={{
                    lineHeight: 40,
                    height: 40,
                    marginLeft: 6,
                    marginRight: 6,
                    color: Tme("placeholder"),
                  }}>{this.state.delay}</Text>
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
            { text: "Cancel", onPress: () => console.log('cancel') },
            {
              text: "Confirm", onPress: () => {
                var value = this.state.delayValue
                if (this.state.delayValue == "") {
                  value = 0
                }
                this.setState({
                  delay: value
                }, () => {
                  this.save()
                })
              }
            },
          ]}
          style={{
            bottom: 100,
            backgroundColor: Tme("bgColor")
          }}
        >
          <View style={{
            padding: 3,
            borderColor: Tme("inputBorderColor"),
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
              value={this.state.delayValue == "0" ? "" : (this.state.delayValue).toString()}
              onChangeText={(name) => this.setState({
                delayValue: name
              })}
              placeholderTextColor={Tme("placeholder")}
              style={Colors.TextInputStyle()}
            />
          </View>
        </Modal>
      </View>
    );
  }

  onClick() {
    if (this.state.checked == true) {
      this.setState({
        checked: false
      }, () => {
        this.props.target.checked = false
      })
    } else {
      this.save()
    }
  }

  closeModal() {
    this.setState({
      modalVisible: false
    })
  }
  delay() {
    this.setState({
      modalVisible: true
    })
  }
  setMode(e) {
    var status = e;
    this.setState({
      value: status,
    }, () => {
      this.save()
    });

  }

  save() {
    this.setState({
      checked: true
    })

    var status = this.state.value

    this.props.spec_settings.setpoint_type = status

    this.props.target.spec_value = status
    this.props.target.params = status;
    this.props.target.node_id = this.props.spec.device_id;
    this.props.target.value_id = this.props.spec.value_id;
    this.props.target.instance_id = this.props.spec.instance_id;
    this.props.target.spec_cc = this.props.spec.cc;
    this.props.target.spec_name = this.props.spec.name;
    this.props.target.desp = this.props.target.spec_value
    var deviceControl = new DeviceControl({ spec: this.props.spec, param: status })
    deviceControl.thermostatMode((cmd) => {
      this.props.target.commands = cmd;
    });
    this.props.target.delay = this.state.delay
    this.props.target.checked = true
    this.props.target.target_type = this.props.spec.dv_type;
    this.props.spec_settings.targets.push(this.props.target)
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
