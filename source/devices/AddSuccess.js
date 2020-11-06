import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
import ILoading from '../components/ILoading';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Tme} from '../ThemeStyle';
import {Helper, HelperMemo, DEVICE_HEIGHT, DEVICE_WIDTH} from '../Helper';
import {Navigation} from 'react-native-navigation';
import _ from 'lodash';
import NavBarView from '../components/NavBarView';
import CardView from '../components/CardView';
import * as Progress from 'react-native-progress';

export default class AddSuccess extends Component {
  static options(passProps) {
    return {
      topBar: {
        rightButtons: [
          {
            id: 'save',
            text: 'save',
            color: Colors.MainColor,
          },
        ],
      },
      bottomTabs: {
        visible: false,
        drawBehind: true,
      },
    };
  }
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.type == 'new' ? '' : this.props.name || '',
      indeterminate: true,
    };

    Navigation.events().bindComponent(this);
    this.checkNode = 0;
    this.setTime = null;
  }

  navigationButtonPressed({buttonId}) {
    if (buttonId == 'save') {
      this.changeName();
    }
  }

  componentDidMount() {
    var _this = this;
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (_this.props.type == 'new') {
        return true;
      } else {
        return false;
      }
    });
    if (this.props.type == 'edit') {
      setTimeout(() => {
        this.textInput.focus();
      }, 600);
    } else {
      this.nodeNewCheck();
    }
  }
  componentWillUnmount() {
    this.backHandler.remove();
    if (this.setTime !== null) {
      clearTimeout(this.setTime);
      this.setTime = null;
    }
  }

  nodeNewCheck() {
    var _this = this;
    console.log(this.props.uuid);

    Helper.sendRequest(
      'get',
      'devices/check_node',
      {index: this.props.uuid},
      {
        success: (data) => {
          if (_this.setTime !== null) {
            clearTimeout(_this.setTime);
            _this.setTime = null;
          }
          _this.setState({
            indeterminate: false,
          });
        },
        error: (data) => {
          if (_this.checkNode < 3) {
            _this.checkNode = _this.checkNode + 1;
            _this.setTime = setTimeout(() => {
              _this.nodeNewCheck();
            }, 3000);
          } else {
            Alert.alert('Device is not found');
          }
        },
      },
    );
  }

  render() {
    var html = '';
    if (this.props.type == 'new') {
      if (this.state.indeterminate) {
        html = (
          <View>
            <Progress.Circle
              size={140}
              color={Colors.MainColor}
              progress={0}
              indeterminate={this.state.indeterminate}
              showsText={true}
            />
          </View>
        );
      } else {
        html = (
          <View>
            <View
              style={{
                justifyContent: 'center',
                marginTop: 75,
                marginBottom: 50,
                alignItems: 'center',
                height: 100,
              }}>
              <Ionicons
                name="ios-checkmark-circle"
                size={100}
                color={Colors.MainColor}
              />
              <Text
                style={{
                  fontSize: 17,
                  color: Tme('cardTextColor'),
                  marginTop: 16,
                }}>
                Added successfully!
              </Text>
            </View>
            <View
              style={[
                styles.accountView,
                {borderColor: Tme('inputBorderColor')},
              ]}>
              <TextInput
                ref={(ref) => {
                  this.textInput = ref;
                }}
                clearButtonMode="always"
                placeholderTextColor={Tme('placeholder')}
                style={[Colors.TextInputStyle(), {width: DEVICE_WIDTH - 100}]}
                autoCapitalize="none"
                underlineColorAndroid="transparent"
                placeholder="Device Name"
                value={this.state.name}
                returnKeyType="go"
                onSubmitEditing={this.changeName.bind(this)}
                onChangeText={(name) => {
                  this.setState({name});
                }}
              />
            </View>
          </View>
        );
      }
    }
    return (
      <NavBarView>
        <View style={{alignItems: 'center'}}>
          <ILoading ref="ai" hide={true} />
          <CardView
            withWaveBg={true}
            styles={{
              marginTop: 40,
              width: DEVICE_WIDTH - 40,
              height: HelperMemo.WiNDOW_HEIGHT - 80,
              padding: 20,
              borderRadius: 8,
              alignItems: 'center',
            }}>
            {this.props.type == 'edit' ? (
              <View
                style={[
                  styles.accountView,
                  {borderColor: Tme('inputBorderColor')},
                ]}>
                <TextInput
                  ref={(ref) => {
                    this.textInput = ref;
                  }}
                  clearButtonMode="always"
                  placeholderTextColor={Tme('placeholder')}
                  style={[Colors.TextInputStyle(), {width: DEVICE_WIDTH - 100}]}
                  autoCapitalize="none"
                  underlineColorAndroid="transparent"
                  placeholder="Device Name"
                  value={this.state.name}
                  returnKeyType="go"
                  onSubmitEditing={this.changeName.bind(this)}
                  onChangeText={(name) => {
                    this.setState({name});
                  }}
                />
              </View>
            ) : (
              html
            )}
          </CardView>
        </View>
      </NavBarView>
    );
  }

  changeName() {
    var _this = this;
    if (this.state.name != '') {
      _this.refs.ai.show();
      Helper.sendRequest(
        'post',
        '/devices/change_name',
        {
          name: _this.state.name,
          uuid: _this.props.uuid,
          type: _this.props.type,
        },
        {
          ensure: () => {
            _this.refs.ai.hide();
          },
          success: (data) => {
            Navigation.popToRoot(this.props.componentId);
          },
          error: (data) => {
            if (_.isArray(data)) {
              Alert.alert(_.uniq(data).join('\n'));
            } else {
              Alert.alert(data);
            }
          },
        },
      );
    } else {
      Alert.alert('Hint', 'Device name can not be empty!', [
        {text: 'OK', onPress: () => this.textInput.focus()},
      ]);
    }
  }
}
const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
  accountView: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
  },
});
