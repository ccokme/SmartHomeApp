package com.smarthomeapp;

import android.util.Log;

import androidx.annotation.VisibleForTesting;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import io.grpc.CallOptions;
import io.grpc.Channel;
import io.grpc.ClientCall;
import io.grpc.ClientInterceptor;
import io.grpc.ForwardingClientCall;
import io.grpc.ForwardingClientCallListener;
import io.grpc.Metadata;
import io.grpc.MethodDescriptor;

public class HeaderClientInterceptor implements ClientInterceptor {

    private static final Logger logger = Logger.getLogger(HeaderClientInterceptor.class.getName());

    @VisibleForTesting
    private String SN;
    private String API_KEY;
    private String API_SECRET;
    private ReactContext TX;

    public HeaderClientInterceptor(ReactApplicationContext context, String sn, String api_key, String api_secret) {
        SN = sn;
        TX = context;
        API_KEY = api_key;
        API_SECRET = api_secret;
    }

    @Override
    public <ReqT, RespT> ClientCall<ReqT, RespT> interceptCall(MethodDescriptor<ReqT, RespT> method,
                                                               CallOptions callOptions, Channel next) {
        return new ForwardingClientCall.SimpleForwardingClientCall<ReqT, RespT>(next.newCall(method, callOptions)) {

            @Override
            public void start(ClientCall.Listener<RespT> responseListener, Metadata headers) {
                /* put custom header */
                Metadata.Key<String> k1 =
                        Metadata.Key.of("x-iot-api-key", Metadata.ASCII_STRING_MARSHALLER);
                headers.put(k1, API_KEY);
                Metadata.Key<String> key2 = Metadata.Key.of("x-iot-sn", Metadata.ASCII_STRING_MARSHALLER);
                headers.put(key2, SN);
                Metadata.Key<String> key3 = Metadata.Key.of("x-iot-api-secret", Metadata.ASCII_STRING_MARSHALLER);
                headers.put(key3, API_SECRET);

                Metadata.Key<String> key4 = Metadata.Key.of("User-Agent", Metadata.ASCII_STRING_MARSHALLER);
                headers.put(key4, "PresenAndroid/1.0");

                super.start(new ForwardingClientCallListener.SimpleForwardingClientCallListener<RespT>(responseListener) {
                    @Override
                    public void onHeaders(Metadata headers) {
                        /**
                         * if you don't need receive header from server,
                         * you can use {@link io.grpc.stub.MetadataUtils#attachHeaders}
                         * directly to send header
                         */
                        String passed = headers.get(Metadata.Key.of("x-srv-evt", Metadata.ASCII_STRING_MARSHALLER));
                        if (passed != null) {
                            WritableMap data = Arguments.createMap();
                            data.putString("app_event", "passed");
                            data.putString("status", "ok");
                            TX.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("GRPCEvent", data);
                        }
                        super.onHeaders(headers);
                    }
                }, headers);
            }
        };
    }

}