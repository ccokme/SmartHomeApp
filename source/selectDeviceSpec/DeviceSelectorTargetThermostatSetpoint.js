import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import { Helper } from "../Helper"
import _ from "lodash"
import { Slider, Modal, Popover } from "@ant-design/react-native";
import CheckBox from 'react-native-check-box'
import { Tme, Colors } from "../ThemeStyle"
import DeviceControl from "../components/DeviceControl";

export default class DeviceSelectorTargetThermostatSetpoint extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValue: 0,
      delay: this.props.target.delay || "0",
      delayValue: this.props.target.delay || "0",
      modalVisible: false,
      checked: this.props.target.checked,
      min: 0,
      max: 99
    };
  }

  componentDidMount() {
    this.setState({
      initialValue: Helper.temperatureScale(this.props.target.spec_value !== "" ? parseInt(this.props.target.spec_value) || 0 : parseInt(this.props.spec.value) || 0, this.props.spec.unit_index, false),
      max: "C" == "F" ? (this.props.spec.max * 1.8 + 32) : this.props.spec.max,
      min: "C" == "C" ? 0 : 32,
    })
  }


  render() {
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
            <View style={{ marginTop: 8 }}>
              <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 8, marginTop: 20, flexDirection: "row" }}>
                <Text style={{ fontSize: 22, fontWeight: "500", color: Tme("cardTextColor") }}>{this.state.initialValue}</Text>
                <Text style={{ fontSize: 22, fontWeight: "500", color: Tme("cardTextColor") }}> °C</Text>
              </View>
              <Slider
                min={this.state.min}
                max={this.state.max}
                step={1}
                minimumTrackTintColor={Colors.MainColor}
                value={this.state.initialValue}
                onChange={this.handleSliderChange.bind(this)}
                onAfterChange={this.handleSliderChange.bind(this)} />
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: "500", color: Tme("cardTextColor") }}>{this.state.min} °C</Text>
                <Text style={{ fontWeight: "500", color: Tme("cardTextColor") }}>{this.state.max} °C</Text>
              </View>
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

  handleSliderChange(e) {
    this.setState({
      initialValue: e
    }, () => {
      this.save()
    })
  }
  save() {
    this.setState({
      checked: true
    })
    var params = Helper.temperatureScale(this.state.initialValue, this.props.spec.unit_index, true)
    this.props.target.node_id = this.props.spec.device_id;
    this.props.target.value_id = this.props.spec.value_id;
    this.props.target.instance_id = this.props.spec.instance_id;
    this.props.target.spec_cc = this.props.spec.cc;
    this.props.target.spec_name = this.props.spec.name;
    this.props.target.spec_value = params;
    this.props.target.params = params;
    this.props.target.desp = params + (this.props.spec.scale_string || "");

    console.log(this.props.spec_settings.setpoint_type)
    var deviceControl = new DeviceControl({ spec: this.props.spec, param: params, device: this.props.device, setpoint_type: this.props.spec_settings.setpoint_type })
    deviceControl.thermostatSetpoint((cmd) => {
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