import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView, Button} from 'react-native';
import _ from 'lodash';
import {Helper, HelperMemo, DEVICE_WIDTH} from '../Helper';
import {Popover} from '@ant-design/react-native';
import {Colors, Tme} from '../ThemeStyle';

export default class HomeScreen extends Component {
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
      data: [],
    };
  }

  componentDidMount() {
    this.doFetchData();
  }

  doFetchData() {
    var _this = this;
    Helper.sendRequest('get', '/controllers', '', {
      success: (data) => {
        _this.setState({
          data: data.controllers,
        });
        HelperMemo.sn_tags = data.controllers[0].tags.splice(',');
      },
    });
  }

  render() {
    var html = [];
    _.each(this.state.data, (v, k) => {
      html.push(
        <View
          key={k}
          style={{
            padding: 20,
            marginBottom: 10,
            marginTop: 20,
            flex: 1,
            backgroundColor: Tme('cardColor'),
          }}>
          <Text style={styles.text}>id: {v.id}</Text>
          <Text style={styles.text}>sn: {v.sn}</Text>
          <Text style={styles.text}>version: {v.ctl_version}</Text>
          <Text style={styles.text}>tags: {v.tags.join(',')}</Text>
          <Text style={styles.text}>isOnline: {v.is_online}</Text>
          <Text style={styles.text}>isOnline: {v.is_online}</Text>
          <Text style={styles.text}>Timezone: {v.timezone}</Text>
          <Text style={styles.text}>dcName: {v.dc_name}</Text>
          <Text style={styles.text}>
            dcConfig: {JSON.stringify(v.dc_config)}
          </Text>
        </View>,
      );
    });

    return (
      <View style={{flex: 1}}>
        <View style={{height: HelperMemo.STATUS_BAR_HEIGHT}} />
        <View
          style={{
            height: HelperMemo.NAV_BAR_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{color: Colors.MainColor, fontSize: 16, fontWeight: '600'}}>
            Home
          </Text>
        </View>
        <ScrollView
          style={{
            backgroundColor: Tme('bgColor'),
            flex: 1,
            paddingHorizontal: 20,
          }}>
          <Button
            accessible={true}
            title="Learn More"
            color="#841584"
            testID="learn_more"
            accessibilityLabel="Learn more about this purple button"
          />
          {html}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  row: {
    backgroundColor: Colors.MainColor,
    padding: 20,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 30,
  },
});
