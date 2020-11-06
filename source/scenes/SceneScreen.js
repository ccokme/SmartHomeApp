import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Helper, HelperMemo, DEVICE_WIDTH} from '../Helper';
import {Navigation} from 'react-native-navigation';
import {Colors, Tme} from '../ThemeStyle';
import {ActionSheet, Provider} from '@ant-design/react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CardView from '../components/CardView';
import ILoading from '../components/ILoading';

export default class SceneScreen extends Component {
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
      dataSource: [],
      clickRow: '',
      isRefreshing: false,
    };
    this.ai = React.createRef();
    this._keyExtractor = (item, index) => index.toString();
  }

  componentDidMount() {
    var _this = this;
    this.doFetchData();
  }
  onClick() {
    Promise.all([
      MaterialIcons.getImageSource('close', 25, Colors.MainColor),
    ]).then(([close]) => {
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: 'SceneView',
                options: {
                  topBar: {
                    elevation: 0,
                    title: {
                      text: 'Sceme',
                    },
                    leftButtons: [
                      {
                        id: 'close',
                        icon: close,
                      },
                    ],
                  },
                  bottomTabs: {
                    visible: false,
                    drawBehind: true,
                  },
                },
              },
            },
          ],
        },
      });
    });
  }

  render() {
    return (
      <Provider>
        <View
          style={{
            flex: 1,
          }}>
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
              Scenes
            </Text>
            <TouchableOpacity
              onPress={this.onClick.bind(this)}
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
          <View style={{flex: 1, backgroundColor: Tme('bgColor')}}>
            <ILoading ref={this.ai} hide={true} />
            <FlatList
              style={{
                flex: 1,
                paddingHorizontal: 16,
              }}
              ref={(flatList) => (this._flatList = flatList)}
              data={this.state.dataSource}
              extraData={this.state}
              renderItem={this._renderRow.bind(this)}
              numColumns={1}
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
        </View>
      </Provider>
    );
  }

  _renderRow({item, index}) {
    var rowData = item;
    var icon_name = Helper.getSceneIcon(item);

    return (
      <CardView
        withWaveBg={true}
        withWaveBgOnlyOne={item.is_enabled}
        showMenu={this.sheetShow.bind(this, rowData)}
        onChange={this.changeScene.bind(this, rowData)}
        menuColor={item.is_enabled ? '#ffffff' : Colors.MainColor}
        styles={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: DEVICE_WIDTH - 40,
            borderRadius: 8,
            padding: 20,
            marginTop: 20,
            marginBottom: 10,
          },
          item.is_enabled
            ? {
                backgroundColor: Colors.MainColor,
              }
            : {},
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MCIcons
            name={icon_name}
            size={35}
            color={rowData.is_enabled ? '#ffffff' : Tme('cardTextColor')}
            style={{marginRight: 20}}
          />
          <Text
            numberOfLines={2}
            style={[
              {
                color: Tme('cardTextColor'),
              },
              Colors.CardFontStyle,
              rowData.is_enabled ? {color: '#ffffff'} : {},
            ]}>
            {rowData.name}
          </Text>
        </View>
      </CardView>
    );
  }

  sheetShow(rowData) {
    this.setState(
      {
        clickRow: rowData,
      },
      () => {
        var _this = this;
        ActionSheet.showActionSheetWithOptions(
          {
            options: ['Edit', 'Remove', 'Cancel'],
            cancelButtonIndex: 2,
            destructiveButtonIndex: 1,
          },
          (buttonIndex) => {
            _this.SheetClick(buttonIndex);
          },
        );
      },
    );
  }

  SheetClick(index) {
    var rowData = this.state.clickRow;
    var _this = this;
    if (index === 0) {
      this.sceneSetting(rowData);
    }
    if (index == 1) {
      this._remove(rowData);
    }
  }
  _remove(data) {
    var _this = this;
    var re = /^_/;
    if (re.test(data.name)) {
      setTimeout(() => {
        Alert.alert('Default scene can not be removed');
      }, 100);
    } else {
      setTimeout(() => {
        Alert.alert('Are you sure to do this?', '', [
          {
            text: 'Cancel',
            onPress: () => console.log('cancel'),
          },
          {
            text: 'Confirm',
            onPress: () => {
              _this.ai.current.show();
              Helper.sendRequest(
                'post',
                '/scenes/delete',
                {uuid: data.uuid},
                {
                  ensure: () => {
                    _this.ai.current.hide();
                  },
                  success: (data) => {
                    _this.dataRows = [];
                    _this.dataRows = _this.dataRows.concat(data.scenes);
                    _this.setState({
                      showBtn: true,
                      dataSource: _this.dataRows,
                    });
                  },
                },
              );
            },
          },
        ]);
      }, 100);
    }
  }

  sceneSetting(data) {
    var re = /^_/;
    Promise.all([
      MaterialIcons.getImageSource('close', 25, Colors.MainColor),
    ]).then(([close]) => {
      Navigation.showModal({
        stack: {
          children: [
            {
              component: {
                name: 'SceneView',
                passProps: {
                  uuid: data.uuid,
                  name: data.name,
                  system: re.test(data.name),
                },
                options: {
                  topBar: {
                    elevation: 0,
                    title: {
                      text: 'Scene',
                    },
                    leftButtons: [
                      {
                        id: 'close',
                        icon: close,
                      },
                    ],
                  },
                  bottomTabs: {
                    visible: false,
                    drawBehind: true,
                  },
                },
              },
            },
          ],
        },
      });
    });
  }

  changeScene(data) {
    var _this = this;
    setTimeout(() => {
      Alert.alert(data.name, 'Activate this Scene?', [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
        },
        {
          text: 'Confirm',
          onPress: () => {
            _this.ai.current.show();
            Helper.sendRequest(
              'post',
              '/scenes/run',
              {uuid: data.uuid, type: 'scene'},
              {
                ensure: () => {
                  _this.ai.current.hide();
                },
                success: (data) => {
                  _this.dataRows = [];
                  _this.dataRows = _this.dataRows.concat(data.scenes);
                  _this.setState({
                    showBtn: true,
                    dataSource: _this.dataRows,
                  });
                },
              },
            );
          },
        },
      ]);
    }, 100);
  }

  addScene() {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'sceneView',
        options: {
          topBar: {
            elevation: 0,
            title: {
              text: 'Scene',
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

  handleRefresh() {
    this.setState({isRefreshing: true}, () => {
      this.doFetchData();
      this.setState({
        isRefreshing: false,
      });
    });
  }

  doFetchData() {
    var _this = this;
    this.ai.current.show();
    Helper.sendRequest('get', '/scenes', '', {
      success: (data) => {
        _this.dataRows = [];
        _this.dataRows = _this.dataRows.concat(data.scenes);
        _this.setState({
          showBtn: true,
          dataSource: _this.dataRows,
        });
      },
      ensure: () => {
        this.ai.current.hide();
      },
    });
  }
}
