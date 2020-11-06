import {NativeModules, NativeEventEmitter} from 'react-native';
import {
  NotificationCenter,
  EVENT_APP_STATE_ACTIVE,
  EVENT_APP_STATE_BACKGROUND,
  EVENT_GRPC_NODE_CHANGE,
  EVENT_GRPC_CONTROLLER_CHANGE,
} from '../NotificationCenter';
import {Portal, Toast} from '@ant-design/react-native';
import AppConfig from '../../AppConfig';

export default class GrpcManager {
  constructor(props) {
    if (props) {
      this.onConnect = props.onConnect;
      this.onRetryConnect = props.onRetryConnect;
      this.onClose = props.onClose;
      this.onFailed = props.onFailed;
    }

    this.host = AppConfig.gcs_grpc;
    this.retryCounter = 0;
    this.toast = null;
    this.timeOut = null;
    this.firstConnect = true;
  }

  connect() {
    NativeModules.GRPCModule.connect({
      sn: AppConfig.sn,
      api_key: AppConfig.api_key,
      api_secret: AppConfig.api_secret,
    });
  }

  close() {
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
    if (this.toast) {
      Portal.remove(this.toast);
    }
    NativeModules.GRPCModule.close();
  }

  send(data) {
    console.log('send:' + data);
    NativeModules.GRPCModule.send(data);
  }

  mount() {
    var _this = this;
    NotificationCenter.addObserver(this, EVENT_APP_STATE_ACTIVE, () => {
      this._doConnect();
    });

    NotificationCenter.addObserver(this, EVENT_APP_STATE_BACKGROUND, () => {
      this.close();
    });

    // event
    var grpcEventEmitter = new NativeEventEmitter(NativeModules.GRPCModule);
    this.grpcSub = grpcEventEmitter.addListener('GRPCEvent', (res) => {
      console.log('GRPCEvent:', JSON.stringify(res));
      switch (res.app_event) {
        case 'passed':
          this.send({
            data: JSON.stringify({
              event: 'init',
              queue: ['controller'],
              device_ids: [],
            }),
          });
          break;
        case 'connection':
          switch (res.status) {
            case 'finished':
              //unary调用成功，这个可以忽略
              break;
            case 'closed':
              // 重新连接
              if (this.onClose) {
                this.onClose();
              }
              this.firstConnect = false;
              this.reconnect();
              break;
          }
          break;
        case 'data':
          if (res.data.status != 1) {
            console.log('error, GRPCEvent data status error:', res.data.status);
            return;
          }
          var payload;
          try {
            payload = JSON.parse(res.data.payload);
          } catch (e) {
            console.log('parse payload error');
            return;
          }
          Portal.remove(this.toast);
          this.retryCounter = 0;
          switch (payload.queue) {
            case 'general':
              // 连接成功
              if (payload.data.op_state == 'connected') {
                // start heartbeat
                NativeModules.GRPCModule.startHeartbeat();
                if (this.firstConnect) {
                  if (this.onConnect) {
                    this.firstConnect = false;
                    this.onConnect();
                  }
                } else {
                  if (this.onRetryConnect) {
                    this.onRetryConnect();
                  }
                }
                console.log('app start heartbeat');
              }
              break;
            case 'devices':
              NotificationCenter.dispatchEvent(EVENT_GRPC_NODE_CHANGE, payload);
              break;
            case 'controller':
              NotificationCenter.dispatchEvent(
                EVENT_GRPC_CONTROLLER_CHANGE,
                payload,
              );
              break;
            default:
              break;
          }
      }
    });
    console.log(_this.host);
    this._doConnect();
  }

  _doConnect() {
    NativeModules.GRPCModule.config(
      {
        env: AppConfig.is_connect_prd ? 'prd' : 'dev',
        host: this.host,
      },
      (error, rsp) => {
        this.connect();
      },
    );
  }

  unmount() {
    this.close();
    NotificationCenter.removeObserver(this, EVENT_APP_STATE_ACTIVE);
    NotificationCenter.removeObserver(this, EVENT_APP_STATE_BACKGROUND);
    this.grpcSub.remove();
  }

  reconnect() {
    if (this.retryCounter < 4) {
      if (!this.onFailed) {
        Portal.remove(this.toast);
        this.toast = Toast.loading(
          'Connect failed, trying to reconnect...',
          10000,
        );
      }
      this.retryCounter++;
      this.timeOut = setTimeout(() => {
        this._doConnect();
      }, 10000);
    } else {
      if (this.onFailed) {
        this.onFailed({message: 'Connect failed, please refresh to try again'});
      } else {
        Portal.remove(this.toast);
        this.toast = Toast.fail(
          'Connect failed, please refresh to try again',
          10000,
        );
      }
    }
  }
}
