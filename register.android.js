import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

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
  Navigation.registerComponent("HomeScreen", () => gestureHandlerRootHOC(HomeScreen));
  Navigation.registerComponent("DeviceScreen", () => gestureHandlerRootHOC(DeviceScreen));
  Navigation.registerComponent("SceneScreen", () => gestureHandlerRootHOC(SceneScreen));
  Navigation.registerComponent("SettingScreen", () => gestureHandlerRootHOC(SettingScreen));
  Navigation.registerComponent("DeviceShow", () => gestureHandlerRootHOC(DeviceShow));
  Navigation.registerComponent("AddSuccess", () => gestureHandlerRootHOC(AddSuccess));
  Navigation.registerComponent("SceneView", () => gestureHandlerRootHOC(SceneView));
  Navigation.registerComponent("DeviceSpecSetting", () => gestureHandlerRootHOC(DeviceSpecSetting));
  Navigation.registerComponent("AddDevice", () => gestureHandlerRootHOC(AddDevice));
  Navigation.registerComponent("SmartList", () => gestureHandlerRootHOC(SmartList));
  Navigation.registerComponent("ZigbeeSmart", () => gestureHandlerRootHOC(ZigbeeSmart));
  Navigation.registerComponent("Add433Device", () => gestureHandlerRootHOC(Add433Device));
  Navigation.registerComponent("DeviceList", () => gestureHandlerRootHOC(DeviceList));
  Navigation.registerComponent("DeviceType", () => gestureHandlerRootHOC(DeviceType));
  Navigation.registerComponent("InputDsk", () => gestureHandlerRootHOC(InputDsk));
  Navigation.registerComponent("RemoveDevice", () => gestureHandlerRootHOC(RemoveDevice));
  Navigation.registerComponent("ModalView", () => gestureHandlerRootHOC(ModalView));
}