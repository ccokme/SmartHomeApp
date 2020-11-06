import _ from 'lodash';

const NotificationCenter = {
  _events: [],

  addObserver: function (object, eventName, callback) {
    if (callback == null) {
      console.error('NotificationCenter: need callback');
      return;
    }

    this._events.push([object, eventName, callback]);
  },

  removeObserver: function (object, eventName) {
    this._events = _.reject(this._events, (event) => {
      if (event[0] == object && event[1] === eventName) {
        return true;
      }
    });
  },

  dispatchEvent: function (eventName, argsObj) {
    _.each(this._events, (event) => {
      if (event[1] === eventName) {
        event[2](argsObj);
      }
    });
  },
};

module.exports = {
  NotificationCenter: NotificationCenter,
  EVENT_APP_STATE_ACTIVE: 1,
  EVENT_APP_STATE_BACKGROUND: 2,
  EVENT_GRPC_NODE_CHANGE: 3,
  EVENT_GRPC_CONTROLLER_CHANGE: 4,
  DISMISS_OVERLAY: 5,
  BOTTOM_DRAWER_CLOSE: 6,
  D433_SELECT_DEVICE: 7,
  D433_SELECT_TYPE: 8,
  EVENT_SCENE: 9,
  EVENT_SCENE_KEY: 10,
};
