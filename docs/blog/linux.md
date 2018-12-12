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
3. 通过应用找占用的端口
```
1. 查找进程的pid
[root@F6-test-web1 ~]# ps -aux | grep passport
root     17408  0.5  2.5 4770388 828124 ?      Sl   10:02   4:13 java -Xms1g -Xmx1g -Xmn512m -server -jar -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -Dspring.profiles.active=local-test /home/opt/f6-passport-8076/passport.jar
root     26856  0.0  0.0 112708   972 pts/2    S+   22:00   0:00 grep --color=auto passport
2. 通过pid查找占用的端口
[root@F6-test-web1 ~]# netstat -anop | grep 17408
tcp        0      0 0.0.0.0:5005            0.0.0.0:*               LISTEN      17408/java           off (0.00/0/0)
tcp6       0      0 :::8076                 :::*                    LISTEN      17408/java           off (0.00/0/0)
tcp6       0      0 :::20882                :::*                    LISTEN      17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.12.201:34474    ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.52:3609      ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.12.201:57270    ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:56870    192.168.13.128:20888    ESTABLISHED 17408/java           keepalive (7085.21/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.88:56353     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.128:37646    ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.83:65162     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.104:4902     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:42924    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.20:57388     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:42922    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       0      0 192.168.12.214:42932    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       0      0 192.168.12.214:42918    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       0      0 192.168.12.214:41424    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (40.09/0/0)
tcp6       0      0 192.168.12.214:49650    192.168.12.246:2181     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.11:62229     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:42928    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       1      0 192.168.12.214:47134    192.168.12.204:3306     CLOSE_WAIT  17408/java           keepalive (2596.00/0/0)
tcp6       0      0 192.168.12.214:34814    192.168.12.201:20881    ESTABLISHED 17408/java           keepalive (5840.03/0/0)
tcp6       0      0 192.168.12.214:42920    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       0      0 192.168.12.214:42930    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.53:58247     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:42916    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.150:59528    ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.84:3761      ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:42926    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (335.01/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.81:52423     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.97:63576     ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.128:54372    ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:55108    192.168.12.203:6379     ESTABLISHED 17408/java           keepalive (7117.98/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.12.201:44086    ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.13.101:49545    ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:20882    192.168.12.201:43894    ESTABLISHED 17408/java           off (0.00/0/0)
tcp6       0      0 192.168.12.214:57984    192.168.12.204:3306     ESTABLISHED 17408/java           keepalive (4824.22/0/0)
unix  2      [ ]         STREAM     CONNECTED     17871559 17408/java
unix  2      [ ]         STREAM     CONNECTED     17874627 17408/java
```
通过上述命令可以看到占用的端口为：
```
tcp6       0      0 :::8076                 :::*                    LISTEN      17408/java           off (0.00/0/0)
tcp6       0      0 :::20882                :::*                    LISTEN      17408/java           off (0.00/0/0)
```
