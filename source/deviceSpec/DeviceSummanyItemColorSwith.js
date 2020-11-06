import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Helper} from '../Helper';
import _ from 'lodash';
import {Colors, Tme} from '../ThemeStyle';
import tinycolor from 'tinycolor2';
import Icons from 'react-native-vector-icons/Ionicons';
import ColorData from '../components/ColorData';
import {Navigation} from 'react-native-navigation';
import {NotificationCenter, BOTTOM_DRAWER_CLOSE} from '../NotificationCenter';
import DeviceControl from '../components/DeviceControl';

class Tool {
  color = tinycolor('rgb(0,0,0)').toHsl();
}

export default class DeviceSummaryItemColorSwith extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      r: '0',
      g: '0',
      b: '0',
    };
  }
  tool = new Tool();
  componentDidMount() {
    var rgb = Helper.colorSwitchGetRgb(this.props.spec.value_hash);
    this.setState(
      {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
      },
      () => {
        this.tool.color = tinycolor(
          'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')',
        ).toHsl();
      },
    );
  }

  render() {
    return (
      <View style={{paddingTop: 20, paddingBottom: 20, paddingHorizontal: 20}}>
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
            style={{color: Tme('textColor'), fontSize: 17, fontWeight: '500'}}>
            Change color
          </Text>
        </TouchableOpacity>
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

  save(color) {
    var rgb = color.split(',');
    this.setState({
      r: rgb[0],
      g: rgb[1],
      b: rgb[2],
    });
    var deviceControl = new DeviceControl({
      spec: this.props.spec,
      color: rgb,
      runCMD: true,
    });
    deviceControl.colorSwitch();
    NotificationCenter.dispatchEvent(BOTTOM_DRAWER_CLOSE);
  }
}
