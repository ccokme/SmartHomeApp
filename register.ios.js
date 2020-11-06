import { Navigation } from 'react-native-navigation';
import HomeScreen from './source/home/HomeScreen';
import DeviceScreen from './source/devices/DeviceScreen';
import SceneScreen from './source/scenes/SceneScreen';
import SettingScreen from './source/settings/SettingScreen';
import DeviceShow from './source/devices/DeviceShow';
import AddSuccess from './source/devices/AddSuccess';
import SceneView from './source/scenes/SceneView';
import DeviceSpecSetting from "./source/selectDeviceSpec/DeviceSpecSetting";
import AddDevice from "./source/devices/AddDevice";
import SmartList from "./source/devices/SmartList";
import ZigbeeSmart from "./source/devices/ZigbeeSmart";
import Add433Device from "./source/devices/Add433Device";
import DeviceList from "./source/devices/d433/DeviceList";
import DeviceType from "./source/devices/d433/DeviceType";
import InputDsk from "./source/devices/InputDsk"
import RemoveDevice from "./source/devices/RemoveDevice";
import { ModalView } from "./source/components/ModalView";

export function registerScreens() {
  Navigation.registerComponent("HomeScreen", () => HomeScreen);
  Navigation.registerComponent("DeviceScreen", () => DeviceScreen);
  Navigation.registerComponent("SceneScreen", () => SceneScreen);
  Navigation.registerComponent("SettingScreen", () => SettingScreen);
  Navigation.registerComponent("DeviceShow", () => DeviceShow);
  Navigation.registerComponent("AddSuccess", () => AddSuccess);
  Navigation.registerComponent("SceneView", () => SceneView);
  Navigation.registerComponent("DeviceSpecSetting", () => DeviceSpecSetting);
  Navigation.registerComponent("AddDevice", () => AddDevice);
  Navigation.registerComponent("SmartList", () => SmartList);
  Navigation.registerComponent("ZigbeeSmart", () => ZigbeeSmart);
  Navigation.registerComponent("Add433Device", () => Add433Device);
  Navigation.registerComponent("DeviceList", () => DeviceList);
  Navigation.registerComponent("DeviceType", () => DeviceType);
  Navigation.registerComponent("RemoveDevice", () => RemoveDevice);
  Navigation.registerComponent("InputDsk", () => InputDsk);
  Navigation.registerComponent("ModalView", () => ModalView);
}