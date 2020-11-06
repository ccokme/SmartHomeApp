import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Tme, Colors} from '../../ThemeStyle';
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import {NotificationCenter, D433_SELECT_TYPE} from '../../NotificationCenter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavBarView from '../../components/NavBarView';

export default class DeviceType extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this._flatList = null;
    this._keyExtractor = (item, index) => index.toString();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <NavBarView>
        <FlatList
          style={{
            flex: 1,
            paddingTop: 20,
          }}
          ref={(flatList) => (this._flatList = flatList)}
          data={this.props.types}
          renderItem={this._renderRow.bind(this)}
          numColumns={1}
          onEndReachedThreshold={0.1}
          keyExtractor={this._keyExtractor}
        />
      </NavBarView>
    );
  }
  _renderRow({item, index}) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.click.bind(this, item)}
        style={{backgroundColor: Tme('cardColor')}}>
        <View
          style={{
            marginLeft: 18,
            marginRight: 20,
            flexDirection: 'row',
            paddingVertical: 16,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: Tme('cardTextColor')}}>{item.label}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={Tme('textColor')}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  click(item) {
    NotificationCenter.dispatchEvent(D433_SELECT_TYPE, item.value);
    Navigation.pop(this.props.componentId);
  }
}
