import React, {Component} from 'react';
import {HelperMemo} from '../Helper';
import {View} from 'react-native';
import {Colors, Tme} from '../ThemeStyle';

export default class NavBarView extends Component {
  constructor(props) {
    super(props);
  }
  navH = HelperMemo.NAV_BAR_HEIGHT + HelperMemo.STATUS_BAR_HEIGHT + 14;
  render() {
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: Tme('bgColor'),
          },
        ]}>
        {this.props.children}
      </View>
    );
  }
}
