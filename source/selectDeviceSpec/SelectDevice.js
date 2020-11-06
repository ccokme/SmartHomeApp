import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import _ from "lodash";
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { NotificationCenter, EVENT_SCENE_KEY } from "../NotificationCenter"
import { List, Picker, Toast, Provider } from "@ant-design/react-native"
import { Navigation } from 'react-native-navigation';
import { Tme, Colors } from "../ThemeStyle"
import Icons from "react-native-vector-icons/Ionicons";
import EmptyView from "../components/EmptyView";

@observer
export default class SelectDevice extends React.Component {

  constructor(props) {
    super(props);

    this._keyExtractor = (item, index) => index.toString();
    this.state = {
      key: "",
      options: [],
      current_room_id: "",
      room_name: "",
      devices: this.deviceInit(this.props.device.devices),
      value: []
    }
    // this.spec_settings = new SelectTargets()
  }

  componentDidMount() {
    var _this = this
    NotificationCenter.addObserver(this, EVENT_SCENE_KEY, (data) => {
      if (data["type"] == "target") {
        _this.props.spec_settings.targets = data.data
      } else if (data["type"] == "condition") {
        _this.props.spec_settings.conditions = data.data
      } else {
        _this.props.spec_settings.device_ids = data.device_ids
      }

      this.setState({
        key: Math.random()
      })
    })

    var rooms = [];
    _.each(this.props.rooms, (cc, index) => {
      rooms.push({ "label": cc.name, "value": cc.id })
    })

    this.setState({
      options: rooms,
    })
  }

  componentWillUnmount() {
    NotificationCenter.removeObserver(EVENT_SCENE_KEY);
  }

  deviceInit(devices) {
    var temp = []
    if (this.props.type == "target") {
      _.forEach(devices, (v, k) => {
        if (_.find(v.cc_specs, function (o) { return (o.spec_type !== 1) })) {
          if (_.find(v.cc_specs, function (x) { return x.name == "DoorLock" })) {
            console.log(v.cc_specs)
          } else {
            temp.push(v)
          }
        }
      })
    } else if (this.props.type == "notify") {
      temp = devices
    } else {
      _.forEach(devices, (v, k) => {
        if (v.dv_type !== "camera" && v.index !== -999) {
          temp.push(v)
        }
      })
    }
    return temp
  }


  render() {
    return (
      <View style={{ backgroundColor: Tme("bgColor") }}>
        <Text style={{ display: "none" }}>{this.state.key}</Text>
        <FlatList
          ref={(flatList) => this._flatList = flatList}
          style={{ backgroundColor: Tme("cardColor"), marginTop: 20, }}
          data={this.state.devices}
          extraData={this.state}
          renderItem={this._renderRow.bind(this)}
          ItemSeparatorComponent={this.line.bind(this)}
          numColumns={1}
          ListEmptyComponent={() => <EmptyView />}
          onEndReachedThreshold={0.1}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }

  line() {
    return (<View style={{
      height: 1,
      backgroundColor: Tme("inputBorderColor"),
      marginLeft: 16
    }}>
    </View>)
  }

  onChange(value) {
    var devices = this.deviceInit(this.props.device.devices)
    if (_.isEmpty(value)) {
      this.setState({ devices: devices, room_name: "", value: "" });
    } else {
      var current_room_id = value[0]
      this.setState({
        value: value,
        current_room_id: current_room_id,
        room_name: _.find(this.state.options, (v) => {
          return v["value"] == current_room_id;
        })["label"]
      }, () => {
        if (current_room_id && current_room_id.length > 0) {
          var room = _.find(this.props.rooms, (v) => {
            return v.id == current_room_id;
          });
          this.setState({
            devices: _.filter(this.props.device.devices, (v) => {
              return room.device_ids.indexOf(v.uuid) != -1
            })
          });
        } else {
          this.setState({ devices: devices, room_name: "" });
        }
      })
    }
  }

  _renderRow({ item, index }) {
    var _this = this;
    var check = false;
    var show = true;

    if (this.props.type === "target") {
      var targets = []

      if (item.dv_type == "camera") {
        if (_.isEmpty(item.cc_specs[0].screenshot_url)) {
          show = false;
          return;
        }
      }

      _.each(this.props.spec_settings.targets, (v, key) => {
        targets.push("spec_" + v.value_id)
      })

      _.each(item.cc_specs, (cc, index) => {
        if (cc.spec_type !== 1) {
          if (_.includes(targets, "spec_" + cc.value_id)) {
            check = true
            show = true
            return
          }
          show = true
        }
      })
    } else if (this.props.type === "notify") {
      var ids = []
      _.each(this.props.spec_settings.device_ids, (v, k) => {
        if (v.split("_")[1] == item.index) {
          check = true
          show = true
          return
        }
      })
      show = true
    } else {
      var conditions = []
      if (item.index == -999) {
        show = false
        return
      }
      if (item.dv_type == "camera") {
        show = false
        return
      }
      _.each(this.props.spec_settings.conditions, (v, key) => {
        conditions.push("spec_" + v.value_id)
      })
      _.each(item.cc_specs, (cc, index) => {
        if (_.includes(conditions, "spec_" + cc.value_id)) {
          check = true
          show = true
          return
        }
      })
      show = true
    }
    if (show) {
      return (
        <TouchableOpacity
          activeOpacity={1.0}
          style={{
            backgroundColor: Tme("cardColor"),
            flex: 1,
            flexDirection: "row"
          }}
          onPress={this.deviceShow.bind(this, item)}>
          <View style={{
            flex: 1,
            paddingHorizontal: 20
          }}>
            <View style={{
              justifyContent: "space-between", alignItems: "center", flexDirection: "row",
              paddingVertical: 20,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 17, color: Tme("cardTextColor"), }}>{item.display_name}</Text>
                {check ? <Icons name="ios-checkmark-circle-outline" size={20} color={Colors.MainColor} style={{ marginLeft: 8 }} /> : null}
              </View>
              <View>
                <Icons name="ios-arrow-forward" size={24} color={Tme("textColor")} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null
    }
  }

  deviceShow(rowData) {
    var push = true
    if (this.props.type == "target") {
      var spec_type = _.find(rowData.cc_specs, function (cc) { return cc.spec_type == 2; })
      if (!spec_type) {
        push = false
        return
      }
      _.forEach(rowData.cc_specs, (v, k) => {
        if (this.props.product == "action" && (v.device_id == -999)) {
          push = false
          return
        }
      })
    } else if (this.props.type == "condition") {
      _.forEach(rowData.cc_specs, (v, k) => {
        if (v.name == "Battery" && v.battery_type == "Main Powered") {
          push = false
          return
        }

        if (v.name == "Camera") {
          push = false
          return
        }
      })
    }
    if (push) {
      Navigation.push(this.props.componentId, {
        component: {
          name: "DeviceSpecSetting",
          passProps: {
            device: toJS(rowData),
            type: this.props.type,
            spec_settings: this.props.spec_settings,
          },
          options: {
            topBar: {
              elevation: 0,
              title: {
                text: "",
              }
            },
            bottomTabs: {
              visible: false,
              drawBehind: true,
            }
          }
        }
      })
    } else {
      Toast.info("This attribute doesn't support this!", 1, undefined, false);
    }
  }

}