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
import _ from "lodash";
import DeviceType from "../deviceSpec/DeviceType";
import { Helper } from "../Helper";
import { NotificationCenter, EVENT_SCENE_KEY } from "../NotificationCenter"
import CheckBox from 'react-native-check-box'
import { Navigation } from 'react-native-navigation';
import { Tme } from "../ThemeStyle"
import NavBarView from "../components/NavBarView";
import AppConfig from "../../AppConfig";

@observer
export default class DeviceSpec extends React.Component {
  static options(passProps) {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'save',
            text: "Next",
            color: Tme("topTextColor")
          }
        ]
      }
    };
  }

  constructor(props) {
    super(props)
    this.device_ids = this.props.spec_settings.device_ids
  }


  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }


  componentWillUnmount() {
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId == "save") {
      NotificationCenter.dispatchEvent(EVENT_SCENE_KEY, { device_ids: this.device_ids });
      setTimeout(() => {
        Navigation.pop(this.props.componentId)
      }, 500)
    }
  }



  render() {
    var self = this;
    var specRows = [];
    _.each(self.props.device.cc_specs, function (spec, k) {

      c = self.genSpec(spec, k);
      if (c) {
        specRows.push(c);
      }
    });


    return (
      <NavBarView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={component => this._scrollView = component}
          style={{
            flex: 1,
            backgroundColor: Tme("bgColor")
          }}>
          <View style={{
            height: 150
          }}>
            <View style={{ padding: 20 }}>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16
              }}>
                <Text style={{ fontSize: 16, color: "white", fontWeight: "600" }}>
                  {this.props.device.display_name}
                </Text>
              </View>
              <DeviceType device={this.props.device} />
            </View>
          </View>

          <View style={{
            backgroundColor: Tme("bgColor")
          }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
              {specRows}
            </View>
          </View>
        </ScrollView>
      </NavBarView>
    )
  }

  genSpec(spec, k) {
    var value = "spec_" + spec.value_id;
    var _this = this;
    var length = this.props.device.cc_specs.length - 1
    return (
      <CheckBox
        key={k}
        rightTextStyle={{ fontSize: 17, padding: 5, color: Tme("cardTextColor") }}
        style={[k == length ? {} : { borderBottomColor: Tme("inputBorderColor"), borderBottomWidth: 1 }, { paddingTop: 8, paddingBottom: 8, }]}
        onClick={() => _this.onClick(value)}
        rightText={Helper.i(spec.name)}
        isChecked={_.includes(_this.props.spec_settings.device_ids, value)}
        checkedImage={<Image source={require("../../img/checkbox2-checked.png")}
          style={{ width: 18, height: 18, marginLeft: 20 }} />}
        unCheckedImage={<Image source={require("../../img/checkbox2.png")}
          style={{ width: 18, height: 18, marginLeft: 20 }} />}
      />
    );
  }


  onClick(ids) {
    if (_.includes(this.props.spec_settings.device_ids, ids)) {
      this.device_ids.remove(ids)
    } else {
      this.device_ids.push(ids)
    }

    // this.props.spec_settings.add_edit_targets(ids)
  }

}