import React from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {
  observer
} from "mobx-react"
import {
  DeviceTarget
} from "../models/DeviceTarget";
import DeviceSelectorTargetDimmer from "./DeviceSelectorTargetDimmer"
import DeviceSelectorTargetDoorLock from "./DeviceSelectorTargetDoorLock"
import DeviceSelectorTargetSwitch from "./DeviceSelectorTargetSwitch"
import DeviceSelectorTargetSwitchAll from "./DeviceSelectorTargetSwitchAll"
import DeviceSelectorTargetThermostatMode from "./DeviceSelectorTargetThermostatMode"
import DeviceSelectorTargetThermostatSetpoint from "./DeviceSelectorTargetThermostatSetpoint"
import DeviceSelectorTargetVirtualDevice from "./DeviceSelectorTargetVirtualDevice";
import DeviceSelectorTargetColorSwitch from "./DeviceSelectorTargetColorSwitch";
import _ from "lodash";
import DeviceType from "../deviceSpec/DeviceType";
import { observable } from 'mobx';
import { NotificationCenter, EVENT_SCENE_KEY } from "../NotificationCenter"
import { Navigation } from 'react-native-navigation';
import { Tme, Colors, } from "../ThemeStyle";
import { Provider } from "@ant-design/react-native"
import NavBarView from "../components/NavBarView";

class viewSpec {
  @observable targets = []
  @observable conditions = []
  @observable setpoint_type = ""
}

@observer
export default class DeviceSpecSetting extends React.Component {
  static options(passProps) {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'save',
            text: "Next",
            color: Colors.MainColor
          }
        ]
      }
    };
  }

  constructor(props) {
    super(props)
    this.view_spec = new viewSpec()
  }

  componentDidMount() {
    Navigation.events().bindComponent(this);
  }
  navigationButtonPressed({ buttonId }) {
    if (buttonId == "save") {
      this.save();
      Navigation.pop(this.props.componentId)
    } else if (buttonId == "buttonOne") {

    }
  }
  render() {
    var self = this;
    var rows = []
    var specRows = [];
    if (self.props.type == "target") {
      _.each(self.props.device.cc_specs, function (spec, k) {
        var target = new DeviceTarget({
          new: true,
        });
        _.each(self.props.spec_settings.targets, (v, key) => {
          if (spec.value_id == v.value_id) {
            target = v
          }
        })

        self.view_spec.targets.push(target)
        c = self.genTargetSpec(spec, k, self.props.spec_settings, target);
        if (c) {
          specRows.push(c);
        }
      });
    }

    return (
      <Provider>
        <NavBarView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={component => this._scrollView = component}
            onScroll={this._onScroll.bind(this)}
            style={{
              flex: 1,
              backgroundColor: Tme("bgColor"),
              paddingTop: 20
            }}>

            <View style={{ paddingHorizontal: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <Text style={[{ color: Tme("cardTextColor") }, Colors.RoomTitleFontStyle]}>
                  {this.props.device.display_name}
                </Text>
              </View>
              <DeviceType device={this.props.device} />
            </View>
            {specRows}
          </ScrollView>
        </NavBarView>
      </Provider>
    )
  }

  _onScroll() {
    Keyboard.dismiss()
  }

  save() {
    var _this = this;
    var data = []
    if (this.props.type === "condition") {
      var checked = []
      data = this.props.spec_settings.conditions.toJS()
      _.forEach(_.uniq(this.view_spec.conditions), function (v, k) {
        if (v.node_id != "") {
          checked.push(v)
        }
      })

      if (checked.length > 0) {
        _.remove(data, function (t) {
          return (t.node_id == checked[0].node_id)
        })
      }
      var conditions = _.groupBy(checked, "checked")["true"]

      _.forEach(conditions, (v, k) => {
        if (_.indexOf(data, v) == -1 && v.checked) {
          data.push(v)
        }
      })

    } else {
      var checked = []
      data = this.props.spec_settings.targets.toJS()
      _.forEach(_.uniq(this.view_spec.targets), function (v, k) {
        if (v.node_id != "") {
          checked.push(v)
        }
      })
      if (checked.length > 0) {
        _.remove(data, function (t) {
          return (t.node_id == checked[0].node_id)
        })
      }
      var targets = _.groupBy(checked, "checked")["true"]
      _.forEach(targets, (v, k) => {
        if (_.indexOf(data, v) == -1 && v.checked) {
          data.push(v)
        }
      })

    }
    // this.props.spec_settings.add_edit_targets(data)
    NotificationCenter.dispatchEvent(EVENT_SCENE_KEY, { type: this.props.type, data: data });
  }

  genTargetSpec(spec, k, spec_settings, target) {
    if (spec.spec_type === 1) {
      return
    }
    if (this.props.product == "scene" && spec.name == "Camera") {
      return
    }
    if (this.props.product == "action" && (spec.name == "Camera" || spec.device_id == "-999")) {
      return
    }
    var valueDOM = "";
    switch (spec.name) {
      case "Switch":
        valueDOM = <DeviceSelectorTargetSwitch spec_settings={this.view_spec} spec={spec} target={target} />;
        break;
      case "SwitchAll":
        valueDOM = <DeviceSelectorTargetSwitchAll spec_settings={this.view_spec} spec={spec} target={target} />;
        break;
      case "Dimmer":
      case "Motor":
        valueDOM = <DeviceSelectorTargetDimmer spec_settings={this.view_spec} spec={spec} target={target} />;
        break;
      case "ThermostatMode":
        valueDOM = <DeviceSelectorTargetThermostatMode spec_settings={this.view_spec} spec={spec} target={target} />;
        break;
      case "ThermostatSetpoint":
        valueDOM = <DeviceSelectorTargetThermostatSetpoint device={this.props.device} spec_settings={this.view_spec} spec={spec} target={target} />;
        break;
      case "DoorLock":
        valueDOM = <DeviceSelectorTargetDoorLock spec_settings={this.view_spec} spec={spec} target={target} />;
        break;
      case "ColorSwitch":
        var temp = []
        _.each(spec.options, (v, k) => {
          temp.push(v.val)
        })
        if (_.intersection(temp, [2, 3, 4]).length == 3) {
          valueDOM = <DeviceSelectorTargetColorSwitch parent={this} spec_settings={this.view_spec} spec={spec} target={target} />;
        } else {
          valueDOM = null
        }
        break;
      default:
        if (spec.device_id == -999) {
          valueDOM = <DeviceSelectorTargetVirtualDevice spec_settings={this.view_spec} spec={spec} target={target} />
        } else {
          valueDOM = null;
        }
        break;
    }

    return (
      <View style={[Colors.CardShadowStyle(), { marginTop: 20 }]} key={"spec_" + spec.value_id}>
        <View style={{
          backgroundColor: Tme("cardColor")
        }}>
          {valueDOM}
        </View>
      </View>
    );
  }

}