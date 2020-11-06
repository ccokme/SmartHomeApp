import {observable, action} from 'mobx';

import {DeviceTarget} from './DeviceTarget';
import _ from 'lodash';

export default class Scene {
  @observable scenes = [];
  @observable name = '';
  @observable is_system = false;
  @observable targets = [];
  @observable check_all = [];
  id = '';

  // @observable select = {}

  @observable updateKey = '';

  @action renderTrigger = () => {
    this.updateKey = Math.random();
  };

  constructor(props) {
    Object.assign(this, {}, props);
  }

  @action
  spec_targets(props) {
    if (props) {
      var targets = [];
      _.each(props, (v, k) => {
        targets.push(new DeviceTarget(v));
      });
      this.targets = targets;
    }
  }

  @action
  add_edit_targets(ids) {
    var _this = this;
    _.each(ids, (id, k) => {
      if (_.includes(this.targets, id)) {
        _this.targets.remove(id);
      } else {
        _this.targets.push(id);
      }
    });
  }
}
