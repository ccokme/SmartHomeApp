import React, {Component} from 'react';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from '../Helper';
import {View, Animated, ActivityIndicator} from 'react-native';

// Props:
//  fade: 0, 永不隐藏
//  hide: 打开隐藏，默认不隐藏
//  left: 居中位置
//  top: 顶部位置
//
// <ILoading text="Loading..." fade={3} hide={true} />

export default class ILoading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: this.props.hide,
      opacity: new Animated.Value(1),
    };
  }

  componentDidMount() {
    var _this = this;

    if (_this.props.fade && _this.props.fade != 0) {
      setTimeout(() => {
        _this.fade(_this.props.callback);
      }, _this.props.fade * 1000);
    }
  }

  render() {
    if (this.state.hide) {
      return null;
    } else {
      return (
        <View
          style={{
            position: 'absolute',
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
            top: 0,
            left: 0,
            zIndex: 99,
            backgroundColor: 'transparent',
          }}>
          <Animated.View
            style={{
              position: 'absolute',
              top: this.props.top ? this.props.top : (DEVICE_HEIGHT - 240) / 2,
              left: this.props.left
                ? this.props.left
                : (DEVICE_WIDTH - 80) / 2.0,
              width: 80,
              height: 80,
              backgroundColor: '#222222',
              borderRadius: 10,
              opacity: this.state.opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8],
              }),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator ref="i" size="large" color="#eeeeee" />
          </Animated.View>
        </View>
      );
    }
  }

  show() {
    this.state.opacity.setValue(1);
    this.setState({hide: false});
  }

  hide() {
    this.setState({hide: true});
  }

  fade() {
    var _this = this;

    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300,
    }).start(() => {
      if (_this.props.callback) _this.props.callback();

      _this.hide();
    });
  }
}
