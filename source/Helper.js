import axios from 'axios';
import {Alert, Dimensions, Platform} from 'react-native';
import AppConfig from '../AppConfig';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import {DeviceIcons} from './ThemeStyle';
import I18n from './I18n';
const TRANS_MISSING = 'missing';

var Helper = {
  sendRequest(method, path, params, callbacks) {
    var config = {
      url: path,
      method: method,
      timeout: 10000,
      responseType: 'json',
      responseEncoding: 'utf8',
      baseURL: AppConfig.api,
      headers: {
        X_IOT_API_KEY: AppConfig.api_key,
        X_IOT_API_SECRET: AppConfig.api_secret,
        X_IOT_SN: AppConfig.sn,
        X_IOT_SCOPES: AppConfig.scopes,
      },
    };
    if (method == 'get') {
      config['params'] = params;
    } else {
      config['data'] = params;
    }
    axios(config)
      .then(function (response) {
        if (response.data.status == 'error') {
          Alert.alert('Error', _.flatten(response.data.errors).join('\n'));
        } else {
          callbacks.success(response.data.data);
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log('error_data: ' + error.response.data);
          console.log('error_status: ' + error.response.status);
          console.log('error_headers: ' + error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          if (callbacks.error) {
            callbacks.error(error.message);
          } else {
            Alert.alert('Error', error.message);
          }
        }
      })
      .then(function () {
        if (callbacks.ensure) {
          callbacks.ensure();
        }
      });
  },
  getDeviceIcon(device) {
    var icon;
    var specs = _.cloneDeep(device.cc_specs);
    var battery = _.remove(specs, (v, _) => {
      return v.name == 'Battery';
    });
    for (var spec of specs) {
      if (icon) break;
      for (var v of DeviceIcons.icons) {
        if (v.reg.test(spec.name)) {
          icon = v.icon;
          break;
        }
      }
    }

    if (!icon) {
      if (battery.length > 0) {
        icon = 'battery';
      } else {
        icon = DeviceIcons.defaultIcon;
      }
    }
    return icon;
  },

  getSceneIcon(scene) {
    var icon;
    switch (scene.name.toLowerCase()) {
      case 'home':
        icon = 'home-variant-outline';
        break;
      case 'sleep':
        icon = 'power-sleep';
        break;
      case 'away':
        icon = 'car-sports';
        break;
      case 'vacation':
        icon = 'biathlon';
        break;
      default:
        icon = 'album';
        break;
    }
    return icon;
  },
  getOneSwitchSpec(device) {
    var temp = [];
    _.forEach(device.cc_specs, (v, k) => {
      if (v.name == 'Switch' || v.name == 'Dimmer' || v.name == 'Motor') {
        temp.push(v);
      }
    });

    if (temp.length == 1) {
      return temp[0];
    } else {
      return null;
    }
  },
  specNameEqual(a, b) {
    return this.specNameNormalized(a) === this.specNameNormalized(b);
  },
  specNameNormalized(name) {
    var re = /[\-_\s]/g;
    return name.toString().toLowerCase().replace(re, '');
  },
  i: function (key) {
    var okey = key;
    if (!key) {
      return '';
    }

    key = key.toString();

    if (/^[A-Z\s\d\-\_]*$/.test(key)) {
      key = key.toLowerCase();
    }

    if (/^\d/.test(key)) {
      return key;
    } else {
      key = key
        .replace(/^\s*/g, '')
        .replace(/\s*$/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/(\-|\/|\s)/g, '_')
        .replace(/(.)([A-Z])/g, '$1_$2')
        .replace(/\_{2,}/g, '_')
        .toLowerCase();
      if (['yes', 'no', 'on', 'off'].indexOf(key) !== -1) {
        key = key + '_b';
      }

      var res = I18n.t('spec.' + key);

      if (res.indexOf(TRANS_MISSING) == 1) return okey;
      else return res;
    }
  },
  getDeviceType(dv_type) {
    switch (dv_type) {
      case '433':
        return '433M';
      case 'zwave':
        return 'Z-WAVE';
      case 'zigbee':
        return 'Zigbee';
      default:
        return dv_type;
    }
  },

  utc: function () {
    var date = new Date();
    var y = date.getUTCFullYear();
    var m = date.getUTCMonth();
    var d = date.getUTCDate();
    var h = date.getUTCHours();
    var M = date.getUTCMinutes();
    var s = date.getUTCSeconds();
    return Date.UTC(y, m, d, h, M, s) / 1000;
  },

  runCMD: function (cmd, callbacks) {
    var config = {
      url: '/controllers//cmd',
      method: 'post',
      timeout: 10000,
      responseType: 'json',
      responseEncoding: 'utf8',
      baseURL: AppConfig.api,
      headers: {
        X_IOT_API_KEY: AppConfig.api_key,
        X_IOT_API_SECRET: AppConfig.api_secret,
        X_IOT_SN: AppConfig.sn,
        X_IOT_SCOPES: AppConfig.scopes,
      },
      data: {commands: cmd},
    };
    callbacks = callbacks || {};
    axios(config)
      .then(function (response) {
        if (response.data.status == 'error') {
          Alert.alert('Hint', _.flatten(response.data.errors).join('\n'));
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          Alert.alert('Error', error.message);
        }
      });
  },
  showSpecValue: function (spec_value) {
    var val;

    switch (typeof spec_value) {
      case 'number':
        val = spec_value;
        break;
      case 'undefined':
        val = 'N/A';
        break;
      case 'object': // null
        val = '';
        break;
      default:
        val = spec_value;
    }
    return val;
  },

  colorSwitchCmdParams: function (spec_hash, rgb, type) {
    if (type == 'zwave') {
      var res = [];
      _.each(spec_hash, function (v, k) {
        switch (k.toString()) {
          case '2':
            res.push('2=' + rgb[0]);
            break;
          case '3':
            res.push('3=' + rgb[1]);
            break;
          case '4':
            res.push('4=' + rgb[2]);
            break;
          default:
            res.push(k + '=0');
            break;
        }
      });
      return res.join('|');
    } else if (type == 'zigbee') {
      var xyy = new ColorXyy(rgb);
      console.log(xyy.to_zigbee_color());
      return xyy.to_zigbee_color();
    }
  },

  colorSwitchGetRgb: function (spec_hash) {
    var res = [];
    _.each(spec_hash, function (v, k) {
      switch (k.toString()) {
        case '2':
          res.push(v);
          break;
        case '3':
          res.push(v);
          break;
        case '4':
          res.push(v);
          break;
        default:
          break;
      }
    });
    if (res.length == 3) {
      return res;
    } else {
      return false;
    }
  },
  temperatureScale: function (value, spec_unit_index, is_decode) {
    var data = value;
    var user_scale = memo.user_data.user.scale;
    if (spec_unit_index == 0) {
      if (user_scale == 'F') {
        if (is_decode) {
          data = (parseInt(value) - 32) / 1.8;
        } else {
          data = parseInt(value) * 1.8 + 32;
        }
      }
    } else if (spec_unit_index == 1) {
      if (user_scale == 'C') {
        if (is_decode) {
          data = parseInt(value) * 1.8 + 32;
        } else {
          data = (parseInt(value) - 32) / 1.8;
        }
      }
    }
    return parseInt(data);
  },
};

function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}
function getStatusBarHeight(safe) {
  return isIphoneX() ? 44 : 30;
}
var status_bar = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
var bottom_bar = Platform.OS == 'ios' ? (DeviceInfo.hasNotch() ? 34 : 0) : 0;

var memo = {
  STATUS_BAR_HEIGHT: status_bar,
  NAV_BAR_HEIGHT: Platform.OS == 'ios' ? 56 : 56,
  DASHBOARD_SN_ID: '_dashboard_',
  BOTTOM_BAR_HEIGHT: bottom_bar,
  WiNDOW_HEIGHT:
    Dimensions.get('window').height -
    (Platform.OS == 'ios' ? status_bar + 44 + bottom_bar : 56),
};
module.exports = {
  Helper: Helper,
  DEVICE_WIDTH: Dimensions.get('window').width,
  DEVICE_HEIGHT: Dimensions.get('window').height,
  HelperMemo: memo,
};
