---
title: 记一次dubbo多Ip访问的问题
date: 2018-05-28 13:04:48
type: post
tag:
  - dubbo
---

### 问题现象
我负责的一个项目的测试环境是部署在阿里云的一个外网环境的，dubbo发布的crm可以在部署在该机器上的其他系统访问，
但是本地开发环境下也需要去消费的，因为项目组成员有外注人员远程办公，不可能在本地启动一个crm自己调用。
但是本地开发环境无法消费部署在阿里云环境的crm，即使通过```dubbo.protocol.host```绑定了外网地址，启动的时候
控制台打印如下异常：
<!-- more -->
```java
2018-05-28 09:21:52,047 ERROR [main] [] c.c.c.d.p.ProviderCRM - Fail to start server(url: dubbo://test.haoyiquan.com:33128/com.carzone.crm.api.facade.CompanyCustomerFacade?application=yixiuge-crm-provider&channel.readonly.sent=true&codec=dubbo&default.timeout=20000&dubbo=crm&group=yixiuge-platform-crm&heartbeat=60000&interface=com.carzone.crm.api.facade.CompanyCustomerFacade&methods=update,register,queryById&owner=crm&pid=23287&revision=crm&side=provider&threads=200&timestamp=1527470511816) Failed to bind NettyServer on test.haoyiquan.com/101.132.**.**:33128, cause: Failed to bind to: test.haoyiquan.com/101.132.**.**:33128
com.alibaba.dubbo.rpc.RpcException: Fail to start server(url: dubbo://test.haoyiquan.com:33128/com.carzone.crm.api.facade.CompanyCustomerFacade?application=yixiuge-crm-provider&channel.readonly.sent=true&codec=dubbo&default.timeout=20000&dubbo=crm&group=yixiuge-platform-crm&heartbeat=60000&interface=com.carzone.crm.api.facade.CompanyCustomerFacade&methods=update,register,queryById&owner=crm&pid=23287&revision=crm&side=provider&threads=200&timestamp=1527470511816) Failed to bind NettyServer on test.haoyiquan.com/101.132.**.**:33128, cause: Failed to bind to: test.haoyiquan.com/101.132.**.**:33128
	at com.alibaba.dubbo.rpc.protocol.dubbo.DubboProtocol.createServer(DubboProtocol.java:289) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.rpc.protocol.dubbo.DubboProtocol.openServer(DubboProtocol.java:266) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.rpc.protocol.dubbo.DubboProtocol.export(DubboProtocol.java:253) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.rpc.protocol.ProtocolListenerWrapper.export(ProtocolListenerWrapper.java:56) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper.export(ProtocolFilterWrapper.java:55) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.rpc.Protocol$Adpative.export(Protocol$Adpative.java) ~[na:na]
	at com.alibaba.dubbo.registry.integration.RegistryProtocol.doLocalExport(RegistryProtocol.java:153) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.registry.integration.RegistryProtocol.export(RegistryProtocol.java:107) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.rpc.protocol.ProtocolListenerWrapper.export(ProtocolListenerWrapper.java:54) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper.export(ProtocolFilterWrapper.java:53) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.rpc.Protocol$Adpative.export(Protocol$Adpative.java) ~[na:na]
	at com.alibaba.dubbo.config.ServiceConfig.doExportUrlsFor1Protocol(ServiceConfig.java:485) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.config.ServiceConfig.doExportUrls(ServiceConfig.java:281) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.config.ServiceConfig.doExport(ServiceConfig.java:242) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.config.ServiceConfig.export(ServiceConfig.java:143) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.config.spring.ServiceBean.onApplicationEvent(ServiceBean.java:109) ~[yixiuge-crm.jar:na]
	at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:163) ~[yixiuge-crm.jar:na]
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:136) ~[yixiuge-crm.jar:na]
	at org.springframework.context.support.AbstractApplicationContext.publishEvent(AbstractApplicationContext.java:381) ~[yixiuge-crm.jar:na]
	at org.springframework.context.support.AbstractApplicationContext.publishEvent(AbstractApplicationContext.java:335) ~[yixiuge-crm.jar:na]
	at org.springframework.context.support.AbstractApplicationContext.finishRefresh(AbstractApplicationContext.java:855) ~[yixiuge-crm.jar:na]
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:541) ~[yixiuge-crm.jar:na]
	at org.springframework.context.support.ClassPathXmlApplicationContext.<init>(ClassPathXmlApplicationContext.java:139) ~[yixiuge-crm.jar:na]
	at org.springframework.context.support.ClassPathXmlApplicationContext.<init>(ClassPathXmlApplicationContext.java:93) ~[yixiuge-crm.jar:na]
	at com.alibaba.dubbo.container.spring.SpringContainer.start(SpringContainer.java:50) ~[yixiuge-crm.jar:na]
	at com.carzone.crm.dubbo.provider.ProviderCRM.main(ProviderCRM.java:60) ~[yixiuge-crm.jar:na]

```
意思是不能绑定地址：```101.132.**.**```(为了防止一些不必要的麻烦，ip做脱敏处理)
### 问题解决
通过跟运维同学的交流发现易修哥的测试环境只有内网网卡，外网访问通过转发进行的,
所以在需要以下步骤进行解决。
1. 该机器host绑定内网地址和域名的映射：172.19.86.35 test.haoyiquan.com
2. provider 绑定host:   dubbo.protocol.host=test.haoyiquan.com

但是理论上，服务的CRM服务的访问在内网环境下访问才最安全，不然会产生```拜占庭将军问题```。以下科普来自维基百科。

```
莱斯利·兰波特在其论文[1]中描述了如下问题：
一组拜占庭将军分别各率领一支军队共同围困一座城市。为了简化问题，将各支军队的行动策略限定为进攻或撤离两种。因为部分军队进攻部分军队撤离可能会造成灾难性后果，因此各位将军必须通过投票来达成一致策略，即所有军队一起进攻或所有军队一起撤离。因为各位将军分处城市不同方向，他们只能通过信使互相联系。在投票过程中每位将军都将自己投票给进攻还是撤退的信息通过信使分别通知其他所有将军，这样一来每位将军根据自己的投票和其他所有将军送来的信息就可以知道共同的投票结果而决定行动策略。
系统的问题在于，将军中可能出现叛徒，他们不仅可能向较为糟糕的策略投票，还可能选择性地发送投票信息。假设有9位将军投票，其中1名叛徒。8名忠诚的将军中出现了4人投进攻，4人投撤离的情况。这时候叛徒可能故意给4名投进攻的将领送信表示投票进攻，而给4名投撤离的将领送信表示投撤离。这样一来在4名投进攻的将领看来，投票结果是5人投进攻，从而发起进攻；而在4名投撤离的将军看来则是5人投撤离。这样各支军队的一致协同就遭到了破坏。
由于将军之间需要通过信使通讯，叛变将军可能通过伪造信件来以其他将军的身份发送假投票。而即使在保证所有将军忠诚的情况下，也不能排除信使被敌人截杀，甚至被敌人间谍替换等情况。因此很难通过保证人员可靠性及通讯可靠性来解决问题。
假始那些忠诚（或是没有出错）的将军仍然能通过多数决定来决定他们的战略，便称达到了拜占庭容错。在此，票都会有一个默认值，若消息（票）没有被收到，则使用此默认值来投票。
上述的故事映射到计算机系统里，将军便成了计算机，而信差就是通信系统。虽然上述的问题涉及了电子化的决策支持与信息安全，却没办法单纯的用密码学与数字签名来解决。因为不正常的电压仍可能影响整个加密过程，这不是密码学与数字签名算法在解决的问题。因此计算机就有可能将错误的结果提交去，亦可能导致错误的决策。
```
