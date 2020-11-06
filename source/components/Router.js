import {Navigation} from 'react-native-navigation';
import {Colors} from '../ThemeStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

var Router = {
  push: function (componentId, passProps, screen, options) {
    Navigation.push(componentId, {
      component: {
        name: screen,
        passProps: passProps,
        ...options,
      },
    });
  },
  pushDeviceShow: function (componentId, passProps) {
    Promise.all([
      MaterialIcons.getImageSource('edit', 24, '#fff'),
      MaterialIcons.getImageSource('delete', 24, '#fff'),
    ]).then(([edit, re]) => {
      var btns = {
        rightButtons: [
          {
            id: 'delete',
            icon: re,
          },
          {
            id: 'edit',
            icon: edit,
          },
        ],
        backButton: {
          color: '#ffffff',
          showTitle: false,
        },
      };
      this.push(componentId, passProps, 'DeviceShow', {
        options: {
          topBar: {
            background: {
              color: Colors.MainColor,
            },
            title: {
              text: '',
            },
            ...btns,
          },
          bottomTabs: {
            visible: false,
            drawBehind: true,
          },
        },
      });
    });
  },
};

module.exports = {
  Router: Router,
};
