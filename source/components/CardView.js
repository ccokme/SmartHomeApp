import React, {Component} from 'react';
import {View, TouchableOpacity, ViewPropTypes} from 'react-native';
import {DEVICE_WIDTH} from '../Helper';
import PropTypes from 'prop-types';
import {Colors} from '../ThemeStyle';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const cardWidth = (DEVICE_WIDTH - 52) / 2;
const cardHeight = 120;
const cardRadius = 8;

const colors = [
  {key: 0, value: '#00C6FF'},
  {key: 1, value: '#F4B400'},
  {key: 2, value: '#00BE48'},
  {key: 3, value: '#8D0DFF'},
  {key: 4, value: '#E6491B'},
  {key: 5, value: '#00B4E9'},
  {key: 6, value: '#FF2193'},
];

export default class CardView extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    menuColor: ViewPropTypes.style,
    styles: ViewPropTypes.style,
  };

  constructor(props) {
    super(props);
  }

  render() {
    var hasOnTouch = !!this.props.onChange;

    return (
      <TouchableOpacity
        testID="card_item"
        activeOpacity={hasOnTouch ? 0.8 : 1}
        onPress={hasOnTouch ? this.props.onChange.bind(this) : () => {}}
        style={[
          {
            width: cardWidth,
            height: cardHeight,
            backgroundColor: 'white',
            borderRadius: cardRadius,
          },
          Colors.CardShadowStyle(),
          this.props.styles,
        ]}>
        {this.props.children}
        {this.props.showMenu ? (
          <TouchableOpacity
            testID="card_menu"
            activeOpacity={0.8}
            hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
            onPress={this.props.showMenu}>
            <MCIcons
              name="dots-vertical"
              size={30}
              color={
                this.props.menuColor ? this.props.menuColor : Colors.MainColor
              }
            />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    );
  }

  _renderWaveBg() {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          overflow: 'hidden',
          borderRadius: cardRadius,
        }}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.1)',
            width: cardWidth * 2,
            height: cardWidth * 2,
            borderRadius: cardWidth,
            left: 25,
            bottom: 20,
            zIndex: 1,
          }}
        />
        {this.props.withWaveBgOnlyOne == true ? null : (
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(255,255,255,0.6)',
              width: cardWidth * 2,
              height: cardWidth * 2,
              borderRadius: cardWidth * 0.66,
              right: 15,
              bottom: 30,
              zIndex: 2,
            }}
          />
        )}
      </View>
    );
  }
}
