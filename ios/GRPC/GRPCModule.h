//
//  GRPCModule.h
//  SmartHomeGRPC
//
//  Created by bll on 2020/9/10.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import <ProtoRPC/ProtoRPC.h>

NS_ASSUME_NONNULL_BEGIN

@interface GRPCModule : RCTEventEmitter <RCTBridgeModule, GRPCProtoResponseHandler> {
  NSTimer *heartbeatTimer;
}
  
@end

NS_ASSUME_NONNULL_END
