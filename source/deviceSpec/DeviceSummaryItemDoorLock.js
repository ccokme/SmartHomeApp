import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Helper } from "../Helper"
import _ from "lodash"
import { SegmentedControl, Modal } from "@ant-design/react-native";
import DeviceControl from "../components/DeviceControl";
import { Colors, Tme } from "../ThemeStyle";

export default class DeviceSummaryItemDoorLock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.spec.value == "Unlock" ? 1 : 0,
      time: this.props.time,
      modalVisible: false,
      password: "",
      param: 0
    };
  }

  render() {
    const footerButtons = [
      { text: "Confirm", onPress: () => this.click.bind(this) },
    ];
    return (
      <View>
        <SegmentedControl
          tintColor={Colors.MainColor}
          fontStyle={{ color: Tme("cardTextColor") }}
          activeFontStyle={{ color: "#ffffff" }}
          values={["LOCK", "UNLOCK"]}
          selectedIndex={this.state.value}
          style={{ flex: 1, height: 35 }}
          onChange={this.handleRadioChange.bind(this)}
        />
        <Modal
          title="Value"
          transparent
          onClose={this.closeModal.bind(this)}
          visible={this.state.modalVisible}
          footer={footerButtons}
          style={{
            bottom: 100,
            backgroundColor: Tme("bgColor")
          }}
        >
          <View style={[styles.accountView, { borderColor: Tme("inputBorderColor"), }]}>
            <TextInput
              autoFocus={true}
              autoCapitalize="none"
              underlineColorAndroid="transparent"
              autoCorrect={false}
              keyboardType="number-pad"
              returnKeyType="go"
              value={this.state.password}
              onChangeText={(password) => this.setState({ password })}
              placeholderTextColor={Tme("placeholder")}
              style={Colors.TextInputStyle()}
            />
          </View>
        </Modal>
      </View>
    );
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  // click() {
  //   var params = this.state.param
  //   params[1] = this.state.password
  //   this.setState({
  //     param: params
  //   })
  // }


  handleRadioChange(e) {
    var status = e.nativeEvent.selectedSegmentIndex;

    this.setState({
      value: status,
      time: Helper.utc()
    });
    var param = status == 1 ? 0 : 255;
    new DeviceControl({ spec: this.props.spec, param: param, sn_id: this.props.device.sn_id, runCMD: true }).doorlock()
  }
}
const styles = StyleSheet.create({
  accountView: {
    marginTop: 20,
    borderColor: "#d8dbe2",
    borderWidth: 1,
    borderRadius: 3,
  },
});
