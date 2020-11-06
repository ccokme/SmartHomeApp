//
//  GRPCModule.m
//  SmartHomeGRPC
//
//  Created by bll on 2020/9/10.
//

#import "GRPCModule.h"
#import "GRPCManagerAPI.h"
//#import "GRPCMessage+JSON.h"

static GRPCManagerAPI *grpcAPIIns;

static NSString * const kGRPCEventName = @"GRPCEvent";

@implementation GRPCModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"GRPCEvent"];
}

// 初始化设置和实例
RCT_EXPORT_METHOD(config:(NSDictionary *)args callback:(RCTResponseSenderBlock)callback) {
//  static dispatch_once_t onceToken;
//  dispatch_once(&onceToken, ^{
  if (grpcAPIIns != nil) {
    grpcAPIIns = nil;
  }
  grpcAPIIns = [[GRPCManagerAPI alloc] initWithConfig:args];
//  });
  
  callback(@[[NSNull null], @{@"status": @"ok"}]);
}

// 建立连接
RCT_EXPORT_METHOD(connect:(NSDictionary *)args) {
  [grpcAPIIns connect:args delegate:self callback:^(GRPCMsgSimpleRsp * _Nonnull reply, NSError * _Nullable error) {
    //连接是否成功在回调中拿不到，所以这里没有实际意义
  }];
}

// 发送消息
RCT_EXPORT_METHOD(send:(NSDictionary *)args) {
  [grpcAPIIns send:args];
}

// 连接建立后，开始发送heartbeat
RCT_EXPORT_METHOD(startHeartbeat) {
  if (!heartbeatTimer) {
    heartbeatTimer = [NSTimer timerWithTimeInterval:5.0f target:self selector:@selector(heartbeat) userInfo:nil repeats:YES];
    [[NSRunLoop mainRunLoop] addTimer:heartbeatTimer forMode:NSRunLoopCommonModes];
  }
  
  // test closing connection
//  NSTimer *t2 = [NSTimer timerWithTimeInterval:20.0f target:self selector:@selector(close) userInfo:nil repeats:NO];
//  [[NSRunLoop mainRunLoop] addTimer:t2 forMode:NSRunLoopCommonModes];
}

// 主动断开连接
RCT_EXPORT_METHOD(close) {
  if (heartbeatTimer) {
    [heartbeatTimer invalidate];
    heartbeatTimer = nil;
  }
  
  [grpcAPIIns close];
}

- (void) heartbeat {
  [grpcAPIIns send:@{@"data": @"{\"event\":\"heartbeat\"}"}];
}


#pragma mark Protocols of gRPC

- (dispatch_queue_t)dispatchQueue {
//  return dispatch_get_main_queue();
  return dispatch_queue_create("com.presen.grpcqueue", DISPATCH_QUEUE_SERIAL);
}

// 这个每次调用都会被触发，包括
//  1. unary调用成功后开始处理数据前(didReceiveProtoMessage之前)
//  2. stream第一次传递数据成功后开始处理数据前(didReceiveProtoMessage之前)，之后每次传递数据不会调用
-(void)didReceiveInitialMetadata:(NSDictionary *)initialMetadata {
  NSLog(@"RPC received initial metadata: %@.", initialMetadata);
  if ([initialMetadata[@"x-srv-evt"] isEqualToString:@"passed"]) {
    [self sendEventWithName:kGRPCEventName body:@{@"app_event": @"passed",
                                                  @"status": @"ok"}];
  }
}

- (void)didReceiveProtoMessage:(GPBMessage *)message {
  GRPCMsgSimpleRsp *response = (GRPCMsgSimpleRsp *)message;
  if (response) {
    NSString *str =[[NSString alloc] initWithData:response.payload encoding:NSUTF8StringEncoding];
    NSLog(@"RPC received data: %@.", str);
    [self sendEventWithName:kGRPCEventName body:@{@"app_event": @"data",
                                                  @"status": @"ok",
                                                  @"data": @{
                                                      @"status": @(response.status),
                                                      @"payload": str}}];
  }
}

- (void)didCloseWithTrailingMetadata:(NSDictionary *)trailingMetadata error:(NSError *)error {
  if (!error) {
    // 这种情况发生在unary调用成功后
    NSLog(@"RPC close with sending finished: %@", trailingMetadata);
    [self sendEventWithName:kGRPCEventName body:@{@"app_event": @"connection",
                                                  @"status": @"finished"}];
  } else {
    // unary连接异常、streaming连接异常的情况、或者手工断开连接
    // TODO, 需要测试下网络断开的情况是否也会触发
    NSLog(@"RPC error: %@", error);
    [self close];
    
    [self sendEventWithName:kGRPCEventName body:@{@"app_event": @"connection",
                                                  @"status": @"closed",
                                                  @"error": error.description}];
  }
}


@end

