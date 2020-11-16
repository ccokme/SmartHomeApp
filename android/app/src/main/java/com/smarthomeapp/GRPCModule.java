package com.smarthomeapp;

import android.annotation.SuppressLint;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.Objects;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

import android.util.Log;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;
import javax.net.ssl.KeyManagerFactory;

import io.grpc.Attributes;
import io.grpc.CallCredentials;
import io.grpc.Channel;
import io.grpc.ClientInterceptor;
import io.grpc.ClientInterceptors;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.Metadata;
import io.grpc.MethodDescriptor;
import io.grpc.Status;
import io.grpc.okhttp.OkHttpChannelBuilder;
import io.grpc.stub.AbstractStub;
import io.grpc.stub.MetadataUtils;
import io.grpc.stub.StreamObserver;

import com.google.protobuf.ByteString;
import com.smarthomesdk.grpc.MsgSimpleRsp;
import com.smarthomesdk.grpc.MsgPullDataReq;
import com.smarthomesdk.grpc.ServiceGrpc;
import com.squareup.okhttp.ConnectionSpec;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class GRPCModule extends ReactContextBaseJavaModule {

    private static final String TAG = "GRPCModule";
    private static final String REACT_CLASS = "GRPCModule";


    private ManagedChannel channel;
    private StreamObserver<MsgPullDataReq> requestObserver;
    private ServiceGrpc.ServiceBlockingStub blackstub;
    private ServiceGrpc.ServiceStub asyncStub;
    private String Host;
    private int Port;
    private Timer timer = null;
    private TimerTask timerTask = null;
    private String dev;


    public String getHost() {
        return Host;
    }

    public void setHost(String Host) {
        this.Host = Host;
    }

    public int getProt() {
        return Port;
    }

    public void setPort(int Port) {
        this.Port = Port;
    }

    public GRPCModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public String getName() {
        return REACT_CLASS;
    }

    public ManagedChannel getTrustAllClient() {
        SSLSocketFactory sslSocketFactory = null;
        InputStream inputStream = null;
        try {
            if (dev.equals("dev")) {
                inputStream = getCurrentActivity().getAssets().open("server.pem");
            } else {
                inputStream = getCurrentActivity().getAssets().open("gcs_grpc_client.pem");
            }
            X509TrustManager trustManager = trustManagerForCertificates(inputStream);
            SSLContext sslContext = SSLContext.getInstance("TLS");
            //使用构建出的trustManger初始化SSLContext对象
            sslContext.init(null, new TrustManager[]{trustManager}, null);
            //获得sslSocketFactory对象
            sslSocketFactory = sslContext.getSocketFactory();
        } catch (GeneralSecurityException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return OkHttpChannelBuilder.forAddress(getHost(), getProt())
                .sslSocketFactory(sslSocketFactory)
                .hostnameVerifier(new TrustAllHostnameVerifier())
                .build();
//        } else {
//            return OkHttpChannelBuilder.forAddress(getHost(), getProt())
//                    .connectionSpec(ConnectionSpec.MODERN_TLS)
//                    .hostnameVerifier(new TrustAllHostnameVerifier())
//                    .build();
//        }
    }

    //实现HostnameVerifier接口
    private class TrustAllHostnameVerifier implements HostnameVerifier {
        @Override
        public boolean verify(String hostname, SSLSession session) {
            if (dev.equals("dev")) {
                return true;
            } else {
                String pattern = ".*smarthomesdk.com";
                boolean isMatch = Pattern.matches(pattern, hostname);
                return isMatch;
            }
        }
    }

    private X509TrustManager trustManagerForCertificates(InputStream in)
            throws GeneralSecurityException {
        CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
        //通过证书工厂得到自签证书对象集合
        Collection<? extends Certificate> certificates = certificateFactory.generateCertificates(in);
        if (certificates.isEmpty()) {
            throw new IllegalArgumentException("expected non-empty set of trusted certificates");
        }
        //为证书设置一个keyStore
        char[] password = "password".toCharArray(); // Any password will work.
        KeyStore keyStore = newEmptyKeyStore(password);
        int index = 0;
        //将证书放入keystore中
        for (Certificate certificate : certificates) {
            String certificateAlias = Integer.toString(index++);
            keyStore.setCertificateEntry(certificateAlias, certificate);
        }
        // Use it to build an X509 trust manager.
        //使用包含自签证书信息的keyStore去构建一个X509TrustManager
        KeyManagerFactory keyManagerFactory = KeyManagerFactory.getInstance(
                KeyManagerFactory.getDefaultAlgorithm());
        keyManagerFactory.init(keyStore, password);
        TrustManagerFactory trustManagerFactory = TrustManagerFactory.getInstance(
                TrustManagerFactory.getDefaultAlgorithm());
        trustManagerFactory.init(keyStore);
        TrustManager[] trustManagers = trustManagerFactory.getTrustManagers();
        if (trustManagers.length != 1 || !(trustManagers[0] instanceof X509TrustManager)) {
            throw new IllegalStateException("Unexpected default trust managers:"
                    + Arrays.toString(trustManagers));
        }
        return (X509TrustManager) trustManagers[0];
    }


    @ReactMethod
    public void config(final ReadableMap requestMap, Callback callback) {
        String[] url = requestMap.getString("host").split(":");
        setHost(url[0]);
        setPort(Integer.parseInt(url[1]));
        dev = requestMap.getString("env");

        channel = getTrustAllClient();
//        channel = ManagedChannelBuilder.forAddress(getHost(), getProt()).usePlaintext(true).build();
        callback.invoke("", "ok");
    }
    @ReactMethod
    public void connect(final ReadableMap requestMap) {
        String sn = requestMap.getString("sn");
        String api_key = requestMap.getString("api_key");
        String api_secret = requestMap.getString("api_secret");
        ClientInterceptor interceptor = new HeaderClientInterceptor(getReactApplicationContext(), sn, api_key, api_secret);
        asyncStub = ServiceGrpc.newStub(ClientInterceptors.intercept(channel, interceptor));

        StreamObserver<MsgSimpleRsp> rsp = new StreamObserver<MsgSimpleRsp>() {
            @Override
            public void onNext(MsgSimpleRsp value) {
                sendEvent(getReactApplicationContext(), "GRPCEvent", value);
            }

            @Override
            public void onError(Throwable t) {
                WritableMap event = Arguments.createMap();
                event.putString("app_event", "connection");
                event.putString("status", "closed");
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("GRPCEvent", event);
            }

            @Override
            public void onCompleted() {
                Log.d(TAG, "GRPC 完成");
            }
        };
        Log.d(TAG, "连接PullData");
        requestObserver = asyncStub.pullData(rsp);
    }


    @ReactMethod
    public void send(final ReadableMap requestMap) {
        requestObserver.onNext(MsgPullDataReq.newBuilder().setData(requestMap.getString("data")).build());
    }

    @ReactMethod
    public void close() throws InterruptedException {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }

        if (timerTask != null) {
            timerTask.cancel();
            timerTask = null;
        }
        Log.d(TAG, "我关闭了");

        channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);

    }

    @ReactMethod
    public void startHeartbeat() {
        if (timer == null && timerTask == null) {
            timer = new Timer(true);
            timerTask = new TimerTask() {
                @Override
                public void run() {
                    heartbeat();
                }
            };
            Log.d(TAG, "Header 开始");
            timer.schedule(timerTask, 0, 5000);
        }
    }

    private void sendEvent(ReactContext reactContext, String eventName, MsgSimpleRsp params) {
        WritableMap event = Arguments.createMap();
        WritableMap data = Arguments.createMap();
        event.putString("app_event", "data");
        event.putString("status", "ok");
        String status = String.valueOf(params.getStatus());
        data.putString("status", status);
        data.putString("payload", params.getPayload().toStringUtf8());
        event.putMap("data", data);

        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, event);
    }

    private void heartbeat() {
        requestObserver.onNext(
                MsgPullDataReq.newBuilder().setData("{\"event\":\"heartbeat\"}").build()
        );
    }

    private KeyStore newEmptyKeyStore(char[] password) throws GeneralSecurityException {
        try {
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            InputStream in = null; // By convention, 'null' creates an empty key store.
            keyStore.load(null, password);
            return keyStore;
        } catch (IOException e) {
            throw new AssertionError(e);
        }
    }
}