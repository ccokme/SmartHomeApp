//
//  GRPCManagerAPI.m
//  SmartHomeGRPC
//
//  Created by bll on 2020/9/10.
//

#import "GRPCManagerAPI.h"
#import <GRPCClient/GRPCCall+Tests.h>
//#import "GRPCMessage+JSON.h"

//static NSString * const kGRPCHostAddress = @"localhost:50052";

@implementation GRPCManagerAPI

@synthesize env;
@synthesize host;

- (id)initWithConfig:(NSDictionary *)args {
  self = [super init];
  
  self.env = args[@"env"];
  self.host = args[@"host"];
  NSLog(@"GRPC env: %@, host: %@", self.env, self.host);
  
//  [GRPCCall useInsecureConnectionsForHost:self.host];
  service = [[GRPCService alloc] initWithHost:self.host];
  
  return self;
}

/*
call with callback
- (void)helloWorld:(NSDictionary *)args callback:(RCTResponseSenderBlock)callback {
  void (^handler)(GRPCMsgSimpleRsp *response, NSError *error) = ^(GRPCMsgSimpleRsp *response, NSError *error) {
    // TODO(makdharma): Remove boilerplate by consolidating into one log function.
    if (response) {
      NSString *payloadStr = [[NSString alloc] initWithData:response.payload encoding:NSUTF8StringEncoding];
      NSLog(@"helloworld reply: %@.", payloadStr);
      if (callback) {
        callback(@[[NSNull null], @{@"status": @"ok", @"payload": payloadStr}]);
      }
    } else {
      NSLog(@"helloworld error: %@", error);
      if (callback) {
        callback(@[error, [NSNull null]]);
      }
    }
  };
  
  GRPCMsgPullDataReq *request = [GRPCMsgPullDataReq message];
  request.type = @"223";
  request.data_p = args[@"data"];
  
  [service helloWorldWithRequest:request handler:handler];
}
 */


// 连接管理可以参考这里的讨论:
// https://stackoverflow.com/questions/48944209/bidirectional-grpc-stream-sometimes-stops-processing-responses-after-stopping-an
- (void)connect:(NSDictionary *)args
       delegate:(id<GRPCProtoResponseHandler>)delegate
       callback:(void (^)(GRPCMsgSimpleRsp *reply, NSError *_Nullable error))callback {
  
  if (biConnection) {
    return;
  }
  
  GRPCMutableCallOptions *options = [self buildCallOptions];
  [options setInitialMetadata:@{@"x-iot-sn": args[@"sn"],
                                @"x-iot-api-key": args[@"api_key"],
                                @"x-iot-api-secret": args[@"api_secret"]
  }];
  
  biConnection = [service pullDataWithResponseHandler:delegate callOptions:options];
  [biConnection start];
  
//  [self send:@{@"type": @"t",
//               @"data": @"{\"event\":\"init\",\"queue\":[\"controller\"],\"device_ids\":[]}"}];
  
  if (callback != nil) {
    callback(nil, nil);
  }
}

- (void)send:(NSDictionary *)args {
  if (!biConnection) {
    NSLog(@"send warning: writer is not started");
    return;
  }
  
  GRPCMsgPullDataReq *request = [GRPCMsgPullDataReq message];
  request.data_p = args[@"data"];
  [biConnection writeMessage:request];
}

- (void)close {
  if (!biConnection) {
    return;
  }
  [biConnection finish];
  biConnection = nil;
}

- (GRPCMutableCallOptions *)buildCallOptions {
  GRPCMutableCallOptions *options = [[GRPCMutableCallOptions alloc] init];
  
//  [options setTimeout:30];
  options.userAgentPrefix = @"PresenIOS/1.0";
  
  NSString *certName;
  if ([self.env isEqualToString:@"dev"]) {
    // self-signed SSL for dev
    certName = @"server";
    options.hostNameOverride = @"gcs.presensmarthome.com"; // 和自签证书中的域名匹配
  } else {
    // purchased from comodo, see cloud project
    certName = @"gcs_grpc_client";
//    options.hostNameOverride = @"www.presensmarthome.com";
  }
  
  NSBundle *bundle = [NSBundle bundleForClass:[self class]];
  NSString *certsPath = [bundle pathForResource:certName ofType:@"pem"];
  NSLog(@"load cert path %@", certsPath);
  NSError *error = nil;
  NSString *certs = [NSString stringWithContentsOfFile:certsPath encoding:NSUTF8StringEncoding error:&error];
  if (error != nil) {
    NSLog(@"load cert %@, error: %@", certName, error);
    options.transportType = GRPCTransportTypeInsecure;
  } else {
    NSLog(@"load cert %@ success...", certName);
  
    options.transportType = GRPCTransportTypeChttp2BoringSSL;
    options.PEMRootCertificates = certs;
  }
  
  [options setRetryEnabled:YES];
  return options;
}

@end

