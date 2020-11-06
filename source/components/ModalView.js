import React, {Component} from 'react';
import {Navigation} from 'react-native-navigation';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  StyleSheet,
} from 'react-native';
import {HelperMemo, DEVICE_WIDTH, DEVICE_HEIGHT} from '../Helper';
import {Colors, Tme} from '../ThemeStyle';
import Animated, {Easing} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
import {NotificationCenter, DISMISS_OVERLAY} from '../NotificationCenter';

const viewWidth = DEVICE_WIDTH - 40;
const viewHeight = DEVICE_HEIGHT * 0.66;
const viewBorderRadius = 8;

class ModalView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgColor: new Animated.Value(0),
      poupMarginTop: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Keyboard.dismiss();

    Animated.timing(this.state.bgColor, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start();
    Animated.timing(this.state.poupMarginTop, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start();

    NotificationCenter.addObserver(this, DISMISS_OVERLAY, () => {
      this.close();
    });
  }

  componentWillUnmount() {
    NotificationCenter.removeObserver(this, DISMISS_OVERLAY);
  }

  render() {
    var tag = HelperMemo.sn_tags;
    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: Animated.color(
            0,
            0,
            0,
            this.state.bgColor.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7],
            }),
          ),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => this.close()}></TouchableOpacity>
        </View>
        <Animated.View
          style={{
            width: viewWidth,
            backgroundColor: 'rgb(247,248,250)',
            borderRadius: viewBorderRadius,
            marginTop: this.state.poupMarginTop.interpolate({
              inputRange: [0, 1],
              outputRange: [-2 * DEVICE_HEIGHT, 0],
            }),
          }}>
          <View
            style={{
              width: viewWidth,
              height: 44,
              backgroundColor: Colors.MainColor,
              alignItems: 'center',
              justifyContent: 'center',
              borderTopLeftRadius: viewBorderRadius,
              borderTopRightRadius: viewBorderRadius,
              flexDirection: 'row',
            }}>
            <Text style={{color: '#ffffff', fontSize: 16}}>
              {this.props.title}
            </Text>
            <TouchableOpacity
              hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
              style={{position: 'absolute', right: 16}}
              activeOpacity={0.8}
              onPress={() => this.close()}>
              <MaterialIcons
                name="close"
                size={22}
                color="#ffffff"
                style={{textAlign: 'right'}}
              />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive">
            <View
              style={{
                borderBottomLeftRadius: viewBorderRadius,
                borderBottomRightRadius: viewBorderRadius,
              }}>
              <View style={{backgroundColor: Tme('cardColor')}}>
                {_.includes(tag, 'zwave') ? (
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.MainColor,
                        padding: 20,
                      }}>
                      Z-Wave
                    </Text>
                    <TouchableOpacity
                      onPress={this.addClick.bind(this, 'zwave')}
                      activeOpacity={0.8}
                      style={styles.addRow}>
                      <Text style={{fontSize: 16, color: Tme('cardTextColor')}}>
                        Z-Wave
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={20}
                        color={Tme('textColor')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.addClick.bind(this, 'zwave_smart')}
                      activeOpacity={0.8}
                      style={styles.addRow}>
                      <Text style={{fontSize: 16, color: Tme('cardTextColor')}}>
                        Z-Wave Smart Start
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={20}
                        color={Tme('textColor')}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
                {_.includes(tag, 'zigbee') ? (
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.MainColor,
                        padding: 20,
                      }}>
                      Zigbee
                    </Text>
                    <TouchableOpacity
                      onPress={this.addClick.bind(this, 'zigbee')}
                      activeOpacity={0.8}
                      style={styles.addRow}>
                      <Text style={{fontSize: 16, color: Tme('cardTextColor')}}>
                        Zigbee
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={20}
                        color={Tme('textColor')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.addClick.bind(this, 'zigbee_smart')}
                      activeOpacity={0.8}
                      style={styles.addRow}>
                      <Text style={{fontSize: 16, color: Tme('cardTextColor')}}>
                        Zigbee Secure
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={20}
                        color={Tme('textColor')}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
                {_.includes(tag, '433') ? (
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.MainColor,
                        padding: 20,
                      }}>
                      433M
                    </Text>
                    <TouchableOpacity
                      onPress={this.addClick.bind(this, '433')}
                      activeOpacity={0.8}
                      style={styles.addRow}>
                      <Text style={{fontSize: 16, color: Tme('cardTextColor')}}>
                        433M
                      </Text>
                      <MaterialIcons
                        name="keyboard-arrow-right"
                        size={20}
                        color={Tme('textColor')}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    );
  }

  addClick(type) {
    NotificationCenter.dispatchEvent(DISMISS_OVERLAY);
    var title, screen;
    switch (type) {
      case 'zwave':
        screen = 'AddDevice';
        title = '';
        break;
      case 'zigbee':
        screen = 'AddDevice';
        title = '';
        break;
      case 'zwave_smart':
        screen = 'SmartList';
        title = 'Smart Start';
        break;
      case 'zigbee_smart':
        screen = 'ZigbeeSmart';
        title = '';
        break;
      case '433':
        screen = 'Add433Device';
        title = 'Add 433M device';
        break;
    }

    Navigation.push('Device', {
      component: {
        name: screen,
        passProps: {
          type: type,
        },
        options: {
          topBar: {
            title: {
              text: title,
            },
          },
          bottomTabs: {
            visible: false,
            drawBehind: true,
          },
        },
      },
    });
  }
  close() {
    Navigation.dismissOverlay(this.props.componentId);
  }
}

const ShowModalView = (props) => {
  Navigation.showOverlay({
    component: {
      name: 'ModalView',
      passProps: {
        title: props.title,
        content: props.content,
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
};
const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    marginTop: HelperMemo.NAV_BAR_HEIGHT,
  },
  addRow: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#EFEFEF',
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
module.exports = {
  ShowModalView: ShowModalView,
  ModalView: ModalView,
};
