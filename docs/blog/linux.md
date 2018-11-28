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
