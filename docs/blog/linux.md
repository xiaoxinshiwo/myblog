---
title: linux常用命令
date: 2018-11-28 14:29:21
type: post
tag:
  - linix
---

1. Linux查看特定端口是否被占用
```
zhangyongxindeMacBook-Pro:~ zhangyongxin$ lsof -i:20880
COMMAND  PID         USER   FD   TYPE            DEVICE SIZE/OFF NODE NAME
java    3673 zhangyongxin   62u  IPv4 0x61742efeec4b819      0t0  TCP 192.168.13.57:50442->192.168.25.1:20880 (SYN_SENT)
java    3673 zhangyongxin   84u  IPv4 0x61742efef825519      0t0  TCP 192.168.13.57:53036->192.168.13.143:20880 (ESTABLISHED)
java    3673 zhangyongxin   93u  IPv4 0x61742efefed5199      0t0  TCP 192.168.13.57:49817->192.168.13.37:20880 (ESTABLISHED)

```
<!-- more -->
2. dubbo接口测试
```
zhangyongxin$ telnet 127.0.0.1 20880
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.

dubbo>
dubbo>ls
com.f6car.passport.api.UserApi
dubbo>invoke com.f6car.passport.api.UserApi.getUser("zhangyx","96e79218965eb72c92a549dd5a330112",1)
{"pkId":"10545406337938898791","passportId":-7900502795168073319,"idWxbUser":null,"isGuideOpen":0,"limitMac":0,"idRole":"122","idEmployee":"10545055917999681777","idWxbRole":null,"password":"96e79218965eb72c92a549dd5a330112","creator":"10545406337938883887","modifier":null,"creationtime":"2017-03-24 17:15:16","idWxbstation":"1162","username":"zhangyx","isDel":0,"idOwnOrg":"10545055917999668908","modifiedtime":"2017-04-01 17:21:44","openid":null,"isAdmin":0,"mobile":"12425435311"}
elapsed: 294 ms.
```
