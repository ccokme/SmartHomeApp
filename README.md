# README

## Getting Started

When you get a developer account from us, alongside you will get your **Client ID**, **Client Secret**, and **Scopes**:

- Client ID and Client Secret: used for API authentication, you need to specify them when calling APIs.
- Scopes: a comma separated string, used to decide which APIs you can access to, for instance, scopes: device,scece

## Run

Change AppConfig.js file, and then:

```shell
$yarn install
$npx pod-install
$yarn run ios # yarn run android
```