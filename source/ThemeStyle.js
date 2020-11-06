import {Platform} from 'react-native';

const Colors = {
  MainColor: '#fc577a',
  GoldenColor: '#C49225',
  BlueColor: '#4da1ff',
};

const ThemeStyle = {
  getColor: (key) => {
    if (Platform.OS === 'android') {
      return ThemeStyle['L' + key];
    } else {
      return ThemeStyle['L' + key];
    }
  },

  DdeviceBg: '#2b323a',
  LdeviceBg: '#f6f9fa',

  // DbgColor: "#141D24",
  DbgColor: 'rgb(12,12,12)',
  LbgColor: 'rgb(247,248,250)',
  DtextColor: 'rgba(255,255,255, 0.6)',
  LtextColor: '#9497A0',
  // DcardColor: "#000",
  DcardColor: 'rgb(29,29,29)', //"#141D24",
  LcardColor: '#FFFFFF',
  DcardTextColor: 'rgba(255,255,255, 0.86)',
  LcardTextColor: '#323c47',
  DsmallTextColor: 'rgba(255, 255, 255, 0.6)',
  LsmallTextColor: '#7f8fa4',
  DmodeColor: 'rgba(20, 29, 36, 0.6)',
  LmodeColor: 'rgba(255,255,255, 0.86)',
  DnavTextColor: 'rgba(255,255,255, 0.86)',
  LnavTextColor: '#323c47', //Colors.MainColor,
  DinputBorderColor: '#2b2b2d',
  LinputBorderColor: '#EFEFEF',
  Dplaceholder: 'rgba(255,255,255, 0.6)',
  Lplaceholder: '#949595',
  DtextTitleColor: '#7f8fa4',
  LtextTitleColor: '#7f8fa4',
  DbottomSheetBg: '#000',
  LbottomSheetBg: '#fff',

  // DtabInactiveTextColor: "#8a8a8a",
  DtabInactiveTextColor: '#FAA2B4',
  // LtabInactiveTextColor: "#9497A0",
  LtabInactiveTextColor: '#FAA2B4',
  DtabActiveTextColor: '#FFFFFF',
  LtabActiveTextColor: '#FFFFFF',

  DgradientEndColor: 'transparent',
  LgradientEndColor: 'rgba(255,255,255,0)',

  DtopTextColor: '#fff',
  LtopTextColor: '#fff',
};

Colors.CardFontStyle = {
  fontSize: 19,
  fontWeight: '500',
};

Colors.ShadowColor = () => {
  return 'rgba(0,0,0,0.2)';
};

// only light mode has shadow
Colors.CardShadowStyle = () => {
  return {
    shadowOffset: {width: 0, height: 0},
    shadowColor: Colors.ShadowColor(),
    shadowOpacity: 0.4,
    shadowRadius: 10,
  };
};

Colors.RoomTitleFontStyle = {
  fontWeight: '500',
  fontSize: 26,
};

Colors.TextInputStyle = () => {
  return {
    height: 40,
    marginLeft: 6,
    marginRight: 6,
    color: ThemeStyle.getColor('cardTextColor'),
  };
};

const getStyle = (name) => {
  const styles = {
    spec: {
      backgroundColor: ThemeStyle.getColor('cardColor'),
      borderRadius: 8,
      marginBottom: 20,
      padding: 20,
    },
    specNameText: {
      fontWeight: '500',
      fontSize: 17,
      color: ThemeStyle.getColor('cardTextColor'),
    },
  };
  return styles[name];
};

const DeviceIcons = {
  icons: [
    {icon: 'light-switch', reg: /switch/i},
    {icon: 'video-outline', reg: /camera/i},
    {icon: 'lamp', reg: /dimmer/i},
    {icon: 'thermostat', reg: /thermostat/i},
    {icon: 'thermometer', reg: /temperature/i},
    {icon: 'water-outline', reg: /water/i},
    {icon: 'door', reg: /door/i},
    {icon: 'window-maximize', reg: /window/i},
    {icon: 'water', reg: /water/i},
    {icon: 'water', reg: /flood/i},
    {icon: 'bell-alert', reg: /alarm/i},
    {icon: 'contactless-payment-circle-outline', reg: /motion/i},
    {icon: 'battery', reg: /battery/i},
  ],
  defaultIcon: 'album',
};

module.exports = {
  Tme: ThemeStyle.getColor,
  GetStyle: getStyle,
  Colors: Colors,

  DeviceIcons: DeviceIcons,
};
