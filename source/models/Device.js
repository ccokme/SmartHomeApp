import {observable} from 'mobx';

export default class Device {
  @observable devices = [];
  @observable select_devices = [];

  // @observable select = {}

  constructor(props) {
    Object.assign(this, {}, props);
  }
}
