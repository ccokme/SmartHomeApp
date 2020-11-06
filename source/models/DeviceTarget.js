import {observable, reaction, computed, autorun} from 'mobx';

export class DeviceTarget {
  @observable checked = false;
  @observable node_id = '';
  @observable instance_id = '';
  @observable spec_cc = '';
  @observable spec_name = '';
  @observable spec_value = '';
  @observable params = '';
  @observable desp = '';
  @observable commands = '';
  @observable delay = '0';
  @observable app_url = '';
  @observable sn_id = '';
  @observable target_type = '';
  target_type = '';

  @observable isOn = '';
  type = 'target';
  new = false;

  value = '';
  initialValue = '';

  constructor(props) {
    Object.assign(this, {}, props);
    if (props) {
      if (props.node_id) {
        this.checked = true;
      }
    }
  }
}
