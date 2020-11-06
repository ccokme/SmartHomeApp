import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavBarView from '../components/NavBarView';
import {Colors, Tme} from '../ThemeStyle';

async function requestFineLocationPermission(callback) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Presen App Camera Permission',
        message:
          'Presen App needs access to your Camera ' +
          'so you can use add Samert Device.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      callback(true);
    } else {
      callback(false);
    }
  } catch (err) {
    callback(err);
  }
}
export default class SmartList extends Component {
  render() {
    return (
      <NavBarView>
        <View
          style={{
            marginTop: 20,
            paddingBottom: 2,
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={this.click.bind(this, 'scan')}
            style={{
              backgroundColor: Tme('cardColor'),
            }}>
            <View
              style={{
                marginHorizontal: 20,
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
                <FontAwesome name="qrcode" size={20} color={Tme('textColor')} />
                <Text style={{marginLeft: 12, color: Tme('cardTextColor')}}>
                  Scan device key
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
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.click.bind(this, 'input')}
          style={{backgroundColor: Tme('cardColor')}}>
          <View
            style={{
              marginHorizontal: 20,
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
              <FontAwesome name="edit" size={20} color={Tme('textColor')} />
              <Text style={{marginLeft: 10, color: Tme('cardTextColor')}}>
                Input device key
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
      </NavBarView>
    );
  }

  click(type) {
    var push = true;
    if (Platform.OS == 'android') {
      if (type == 'scan') {
        requestFineLocationPermission((data) => {
          if (data) {
            push = true;
          }
        });
      }
    }
    if (push) {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'InputDsk',
          passProps: {
            type: type,
          },
          options: {
            topBar: {
              title: {
                text: 'Add Device',
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
const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  row: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f8',
  },
});
