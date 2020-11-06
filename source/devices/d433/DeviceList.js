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
import {Helper, DEVICE_WIDTH} from '../../Helper';
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import {NotificationCenter, D433_SELECT_DEVICE} from '../../NotificationCenter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavBarView from '../../components/NavBarView';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this._flatList = null;
    this._keyExtractor = (item, index) => index.toString();

    this.state = {
      startLearn: true,
      detected: [],
      devices: [],
    };
  }

  componentDidMount() {
    this.pollData();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  pollData() {
    var _this = this;
    Helper.sendRequest(
      'get',
      '/ftt/detected_devices',
      {startLearn: _this.state.startLearn},
      {
        success: (data) => {
          _this.setState({
            startLearn: false,
            detected: data,
            devices: data.devices,
          });
        },
      },
    );

    this.timer = setTimeout(() => {
      _this.pollData();
    }, 1000);
  }

  render() {
    return (
      <NavBarView>
        <View style={{padding: 16, flexDirection: 'row'}}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              marginRight: 8,
              color: Tme('cardTextColor'),
            }}>
            Detecting device...
          </Text>
          <ActivityIndicator size="small" color={Colors.MainColor} />
        </View>
        <FlatList
          style={{
            flex: 1,
          }}
          ref={(flatList) => (this._flatList = flatList)}
          data={this.state.devices}
          extraData={this.state}
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
            <Text style={{color: Tme('cardTextColor')}}>
              {item.index.replace(/^\-\d/, '') + '-' + item.protocol}
            </Text>
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
    var _this = this;
    var dev = _.find(_this.state.detected.devices, (v) => {
      return item.index === v.index;
    });
    var prot = _.find(_this.state.detected.protocols, (v) => {
      return v.protocol === dev.protocol;
    });
    NotificationCenter.dispatchEvent(D433_SELECT_DEVICE, {
      prot: prot,
      device: item.index,
      detected: this.state.detected,
    });
    Navigation.pop(this.props.componentId);
  }
}
