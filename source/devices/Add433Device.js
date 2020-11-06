import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Tme, Colors } from "../ThemeStyle";
import { Helper, DEVICE_WIDTH } from "../Helper";
import _ from "lodash";
import { Navigation } from 'react-native-navigation';
import {
  NotificationCenter,
  D433_SELECT_DEVICE,
  D433_SELECT_TYPE,
} from "../NotificationCenter"
import NavBarView from "../components/NavBarView";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import DeviceControl from "../components/DeviceControl";

export default class Add433Device extends Component {
  static options(passProps) {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'save',
            text: "Save",
            color: Colors.MainColor
          }
        ]
      }
    };
  }
  constructor(props) {
    super(props);

    this.timer = null;

    this.state = {
      currentSelectedDevice: null,
      currentSelectedNodeType: null,
      currentDeviceProtocol: null,

      detected: null,
      selectedDevices: [],
    }
  }

  componentDidMount() {
    var _this = this;
    NotificationCenter.addObserver(this, D433_SELECT_DEVICE, (data) => {
      _this.setState({
        currentDeviceProtocol: data.prot,
        currentSelectedDevice: data.device,
        detected: data.detected
      })
    })
    NotificationCenter.addObserver(this, D433_SELECT_TYPE, (type) => {
      _this.setState({
        currentSelectedNodeType: type,
      })
    })
    Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    NotificationCenter.removeObserver(this, D433_SELECT_DEVICE)
    NotificationCenter.removeObserver(this, D433_SELECT_TYPE)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId == "save") {
      var _this = this;
      var data = []
      if (!this.state.currentSelectedDevice) {
        Alert.alert("Please select device")
      }

      if (!this.state.currentSelectedNodeType) {
        Alert.alert("Please select the device type for this device")
      } else {
        data.push({
          index: this.state.currentSelectedDevice,
          node_type: this.state.currentSelectedNodeType,
        })
        Helper.sendRequest("post", "/partner/ftt/add_device", {
          selectedDevices: data,
          port_id: this.state.detected.port.port_id,
        }, {
          success: (data) => {
            new DeviceControl({ param: _this.state.detected.port.port_id, successCb: false }).endLearn()
            Navigation.pop(this.props.componentId)
          }
        })
      }
    }
  }

  render() {
    return (
      <NavBarView>
        <View style={{ height: 20 }}></View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.click.bind(this, "device")}
          style={{ backgroundColor: Tme("cardColor"), }}>
          <View style={{
            marginLeft: 18,
            marginRight: 20,
            flexDirection: "row",
            paddingVertical: 16,
            justifyContent: "space-between",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: Tme("cardTextColor") }}>Devices</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: Tme("cardTextColor") }}>{this.state.currentSelectedDevice}</Text>
              <MaterialIcons name="keyboard-arrow-right" size={20} color={Tme("textColor")} />
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ height: 2 }}></View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.click.bind(this, "type")}
          style={{ backgroundColor: Tme("cardColor"), }}>
          <View style={{
            marginLeft: 18,
            marginRight: 20,
            flexDirection: "row",
            paddingVertical: 16,
            justifyContent: "space-between",
          }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: Tme("cardTextColor") }}>Type</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: Tme("cardTextColor") }}>{this.state.currentSelectedNodeType}</Text>
              <MaterialIcons name="keyboard-arrow-right" size={20} color={Tme("textColor")} />
            </View>
          </View>
        </TouchableOpacity>
      </NavBarView>
    )
  }

  click(type) {
    if (type === "device") {
      Navigation.push(this.props.componentId, {
        component: {
          name: "DeviceList",
          options: {
            animations: {
              push: {
                animate: true,
              }
            },
            topBar: {
              elevation: 0,
              title: {
                text: "Device",
              },
            },
            bottomTabs: {
              visible: false,
              animate: true,
              drawBehind: true
            }
          }
        }
      })
    } else {
      if (this.state.currentDeviceProtocol) {
        var opts = []
        this.state.currentDeviceProtocol.node_types.map((v, k) => {
          opts.push({ label: v, value: v })
        });
        Navigation.push(this.props.componentId, {
          component: {
            name: "DeviceType",
            passProps: {
              types: opts
            },
            options: {
              animations: {
                push: {
                  animate: true,
                }
              },
              topBar: {
                elevation: 0,
                title: {
                  text: "Please select the device type for this device",
                },
              },
              bottomTabs: {
                visible: false,
                animate: true,
                drawBehind: true
              }
            }
          }
        })
      } else {
        Alert.alert("Please select one device at least!")
      }
    }
  }
}