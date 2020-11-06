import AppBoot from './App';
import {Navigation} from 'react-native-navigation';
import {Colors} from './source/ThemeStyle';

Navigation.setDefaultOptions({
  topBar: {
    noBorder: true,
    elevation: 0,
    title: {
      color: Colors.MainColor,
    },
    backButton: {
      color: Colors.MainColor,
      showTitle: false,
    },
    background: {
      color: 'white',
    },
  },
});
AppBoot();
