import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, Tme} from './source/ThemeStyle';
import {registerScreens} from './register';
import {Navigation} from 'react-native-navigation';

registerScreens();
const AppBoot = () => {
  Promise.all([
    MCIcons.getImageSource('home', 28, '#9497A0'),
    FontAwesome.getImageSource('hdd-o', 28, '#9497A0'),
    MCIcons.getImageSource('home-automation', 28, '#9497A0'),
    FontAwesome.getImageSource('cog', 28, '#9497A0'),
  ]).then((sources) => {
    Navigation.setRoot({
      root: {
        bottomTabs: {
          children: [
            {
              stack: {
                id: 'Home',
                children: [
                  {
                    component: {
                      name: 'HomeScreen',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: 'Home',
                    icon: sources[0],
                    selectedIcon: sources[0],
                    selectedIconColor: Colors.MainColor,
                    selectedTextColor: Colors.MainColor,
                    textColor: '#9497A0',
                    selectedFontSize: 12,
                    testID: 'HOME',
                    fontWeight: 'medium',
                  },
                },
              },
            },
            {
              stack: {
                id: 'Device',
                children: [
                  {
                    component: {
                      name: 'DeviceScreen',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: 'Devices',
                    icon: sources[1],
                    selectedIcon: sources[1],
                    selectedIconColor: Colors.MainColor,
                    selectedTextColor: Colors.MainColor,
                    selectedFontSize: 12,
                    textColor: '#9497A0',
                    testID: 'DEVICE',
                    fontWeight: 'medium',
                  },
                },
              },
            },
            {
              stack: {
                id: 'Scene',
                children: [
                  {
                    component: {
                      name: 'SceneScreen',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: 'Scene',
                    icon: sources[2],
                    selectedIcon: sources[2],
                    selectedIconColor: Colors.MainColor,
                    selectedTextColor: Colors.MainColor,
                    selectedFontSize: 12,
                    textColor: '#9497A0',
                    testID: 'SCENE',
                    fontWeight: 'medium',
                  },
                },
              },
            },
            {
              stack: {
                id: 'Setting',
                children: [
                  {
                    component: {
                      name: 'SettingScreen',
                    },
                  },
                ],
                options: {
                  bottomTab: {
                    text: 'Settings',
                    icon: sources[3],
                    selectedIcon: sources[3],
                    selectedIconColor: Colors.MainColor,
                    selectedTextColor: Colors.MainColor,
                    selectedFontSize: 12,
                    textColor: '#9497A0',
                    testID: 'SETTING',
                    fontWeight: 'medium',
                  },
                },
              },
            },
          ],
          options: {
            bottomTabs: {
              animate: true,
              titleDisplayMode: 'alwaysShow',
              backgroundColor: Tme('bgColor'),
            },
            layout: {
              backgroundColor: Tme('bgColor'),
              orientation: ['portrait'],
            },
          },
        },
      },
    });
  });
};
module.exports = AppBoot;
