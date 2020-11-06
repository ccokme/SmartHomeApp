import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  NativeModules,
  findNodeHandle,
  RefreshControl,
} from 'react-native';
import {Helper, HelperMemo} from '../Helper';
import ILoading from '../components/ILoading';
import {Navigation} from 'react-native-navigation';
import {Colors, Tme} from '../ThemeStyle';
import {ActionSheet, Provider} from '@ant-design/react-native';
import DeviceList from './DeviceList';
import _ from 'lodash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Popover} from 'react-native-modal-popover';

export default class DeviceScreen extends Component {
  static options(passProps) {
    return {
      topBar: {
        visible: false,
        noBorder: true,
        elevation: 0,
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      showBtn: false,
      isDataLoaded: false,
      dataSource: [],
      roomDevices: [],
      rooms: [],
      isFlash: false,
      page: 0,
      btn: '',
      checkDevices: [],
      showPopover: false,
      popoverAnchor: {x: 0, y: 0, width: 0, height: 0},
      duration: 300,
      isRefreshing: false,
    };
    this.fatch = true;
    this._keyExtractor = (item, index) => index.toString();
    this.ai = React.createRef();
    this.selectItem = '';
  }

  componentDidMount() {
    var _this = this;
    Navigation.events().bindComponent(this);
    _this.firstFetch = true;
    this.doFetchData();
  }

  componentWillUnmount() {
    if (this.navigationEventListener) {
      this.navigationEventListener.remove();
    }
  }

  navigationButtonPressed({buttonId}) {
    if (buttonId == 'add') {
      this.openPopover();
    }
  }

  handleRefresh() {
    this.setState({isRefreshing: true}, () => {
      this.doFetchData();
      this.setState({
        isRefreshing: false,
      });
    });
  }

  render() {
    var overlay = [];
    var data = [];
    if (_.includes(HelperMemo.sn_tags, 'zwave')) {
      data = [
        {icon: 'hdd-o', key: 'add_device', text: 'Add Device'},
        {icon: 'hdd-o', key: 'remove_device', text: 'Remove Device'},
      ];
    } else {
      data = [{icon: 'hdd-o', key: 'add_device', text: 'Add Device'}];
    }
    _.each(data, (i, index) => {
      overlay.push(
        <TouchableOpacity
          key={index}
          onPress={this.onSelect.bind(this, i.key)}
          style={{
            flexDirection: 'row',
            paddingVertical: 16,
            alignItems: 'center',
            paddingLeft: i.key == 'add_room' ? 18 : 20,
            paddingRight: 20,
            borderBottomWidth: index == 2 ? 0 : 1,
            borderBottomColor: Tme('bgColor'),
          }}>
          {i.key == 'add_room' ? (
            <MCIcons name="floor-plan" size={22} color={Tme('cardTextColor')} />
          ) : (
            <FontAwesome name={i.icon} size={22} color={Tme('cardTextColor')} />
          )}
          <Text
            style={{
              marginLeft: 14,
              fontWeight: '500',
              color: Tme('cardTextColor'),
            }}>
            {i.text}
          </Text>
        </TouchableOpacity>,
      );
    });
    return (
      <Provider>
        <View
          style={[
            {
              flex: 1,
            },
          ]}>
          <View style={{height: HelperMemo.STATUS_BAR_HEIGHT}}></View>
          <View
            style={{
              height: HelperMemo.NAV_BAR_HEIGHT,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              paddingHorizontal: 20,
            }}>
            <Text
              style={{
                color: Colors.MainColor,
                fontSize: 16,
                fontWeight: '600',
              }}>
              Devices
            </Text>
            <TouchableOpacity
              ref={(r) => {
                this.button = r;
              }}
              onLayout={this.setButton.bind(this)}
              onPress={this.openPopover.bind(this)}
              activeOpacity={0.8}
              style={{
                width: 50,
                height: HelperMemo.NAV_BAR_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcons name="add" size={25} color={Colors.MainColor} />
            </TouchableOpacity>
          </View>
          <ILoading ref={this.ai} hide={true} />
          <Popover
            contentStyle={{
              backgroundColor: Tme('cardColor'),
              borderRadius: 8,
            }}
            popoverStyle={{
              ...Platform.select({
                ios: {
                  shadowColor: 'rgba(0,0,0,0.2)',
                },
              }),
            }}
            arrowStyle={{borderTopColor: Tme('cardColor')}}
            visible={this.state.showPopover}
            fromRect={this.state.popoverAnchor}
            duration={this.state.duration}
            onClose={this.closePopover.bind(this)}
            onDismiss={this.onDismiss.bind(this)}
            placement="bottom">
            {overlay}
          </Popover>
          <FlatList
            style={{
              flex: 1,
              paddingHorizontal: 16,
              backgroundColor: Tme('bgColor'),
            }}
            columnWrapperStyle={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            ref={(flatList) => (this._flatList = flatList)}
            data={this.state.dataSource}
            extraData={this.state}
            renderItem={({item}) => (
              <DeviceList item={item} componentId={this.props.componentId} />
            )}
            numColumns={2}
            onEndReachedThreshold={0.1}
            keyExtractor={this._keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this.handleRefresh.bind(this)}
              />
            }
          />
        </View>
      </Provider>
    );
  }
  setButton = (e) => {
    const handle = findNodeHandle(this.button);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({popoverAnchor: {x, y, width, height}});
      });
    }
  };

  openPopover() {
    this.selectItem = null;
    this.setState({duration: 300}, () => {
      this.setState({
        showPopover: true,
      });
    });
  }

  closePopover() {
    this.setState({duration: 0}, () => {
      this.setState({
        showPopover: false,
      });
    });
  }

  onDismiss() {
    if (!this.selectItem) {
      return;
    }
    switch (this.selectItem) {
      case 'add_device':
        this.addDevice();
        break;
      case 'remove_device':
        this.deleteDevice();
        break;
      default:
    }
  }

  onSelect(e) {
    this.selectItem = e;
    this.closePopover();
    setTimeout(() => {
      this.onDismiss();
    }, 500);
  }

  addDevice() {
    Navigation.showOverlay({
      component: {
        name: 'ModalView',
        passProps: {
          title: 'Add Device',
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

  SheetClick(index, type) {
    if (index === 0) {
      if (type === 'delete') {
        Navigation.push('Device', {
          component: {
            name: 'RemoveDevice',
            options: {
              topBar: {
                elevation: 0,
                title: {
                  text: '',
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
    }
  }

  deleteDevice() {
    var _this = this;
    ActionSheet.showActionSheetWithOptions(
      {
        options: ['Z-Wave', 'cancel'],
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        _this.SheetClick(buttonIndex, 'delete');
      },
    );
  }

  doFetchData(showLoading = true) {
    var _this = this;
    if (showLoading) {
      if (this.ai.current) {
        this.ai.current.show();
      }
    }
    Helper.sendRequest('get', '/devices', '', {
      success: (data) => {
        var temp = [];
        _.forEach(data.devices, (v, k) => {
          temp.push({name: v.display_name, uuid: v.uuid, index: v.index});
        });
        _this.setState({
          dataSource: data.devices,
          checkDevices: temp,
        });
      },
      ensure: () => {
        _this.setState({
          showBtn: true,
        });
        _this.fatch = false;
        if (showLoading) {
          if (this.ai.current) {
            this.ai.current.hide();
          }
        }
      },
    });
  }
}
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
