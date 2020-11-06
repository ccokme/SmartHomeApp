import AppConfigDev from "./AppConfig.dev"

const AppConfig = {
  api: '',
  api_key: '',
  api_secret: '',
  gcs_grpc: '',
  sn: '',
  scopes: '',
  is_connect_prd: false,
};
if (__DEV__) {
  Object.assign(AppConfig, AppConfigDev)
}

module.exports = AppConfig;
