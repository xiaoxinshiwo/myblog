---
title: docker 入门
date: 2018-06-07 15:03:29
type: post
tag:
  - docker
---

## docker practice

为了保持内容为最新，建议每次阅读前先 pull 最新镜像
```
$ docker pull dockerpracticecn/docker_practice

$ docker run -it --rm -d --name dockerPractice -p  4000:80  dockerpracticecn/docker_practice
```
之后打开浏览器，在地址栏输入 ```127.0.0.1:4000``` 即可开始阅读。
<!-- more -->
## docker 常用命令

```
# 获取mysql5.7版本的镜像
docker pull mysql:5.7.22
# 启动一个 容器内3306映射本机3309的名为mysql 5.7.22的容器,不加版本则是运行latest
docker run -it --rm -d -p 3306:3306 --name mysql -v ~/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456  mysql:5.7.22
# 启动redis,使用默认配置
docker run -it --rm -d -p 6379:6379 --name redis -v  ~/docker/redis:/var/lib/redis redis redis-server
# 启动一个zookeeper
docker run -it --rm -d -p 2181:2181 --name zookeeper -v  ~/docker/zookeeper:/data  zookeeper
# 启动tomcat
docker run -it -d --rm -p 8888:8080 --name tomcat7 -v ~/docker/tomcat7:/usr/local/tomcat/webapps/docker tomcat:7.0.88-jre8
# 罗列所有的容器，包含已经停止的
docker ps -a
# 停止一个容器 24ed9f74fa99为容器id，支持短id 如：24ed
docker stop 24ed9f74fa99
# 罗列镜像
docker images / 或者 docker image ls
# 罗列容器
docker container ls
# 删除镜像
docker image rm mysql
# 删除容器
docker rm containerId
# 启动名为mysql的容器
docker start mysql
# 进入名为mysql的容器
docker exec -it mysql bash
```
## 制作启动命令

在实际开发中，开发者往往需要在本地启动```mysql/redis/zookeeper/elasticsearch/activemq```等
下面的命令启动了mysql/redis/zookeeper三个应用，这样就可以一键启动了。
```
 #runDevToolKit.sh
 # 启动mysql
 echo 'run mysql...'
 docker run -it --rm -d -p 3306:3306 --name mysql -v ~/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456  mysql:5.7.22
 # 启动启动redis
 echo 'run redis...'
 docker run -it --rm -d -p 6379:6379 --name redis -v  ~/docker/redis:/var/lib/redis redis redis-server
 # 启动启动zookeeper
 echo 'run zookeeper...'
 docker run -it --rm -d -p 2181:2181 --name zookeeper -v  ~/docker/zookeeper:/data  zookeeper
 # 查看所有运行的容器
 echo 'The running containers are...'
 docker ps -a

```
```
# stopDevToolKit.sh
# 停止所有容器
echo 'stop all containers...'
docker stop mysql
docker stop redis
docker stop zookeeper
```
## 制作容器
0. 准备文件
```
创建空文件件(否则会出现build-context-for-docker-image-very-large问题) docker-build  see:https://stackoverflow.com/questions/26600769/build-context-for-docker-image-very-large
往docker-build中添加文件：jre-8u171-linux-x64.tar.gz apache-tomcat-8.5.3.zip

```
1.  编写Dockerfile
```
FROM ubuntu

MAINTAINER created from zhangyognxin@f6car.com
#把java与tomcat添加到容器中 tar.gz 会自动解压
ADD jre-8u171-linux-x64.tar.gz /usr/local/
ADD apache-tomcat-8.5.3.tar.gz /usr/local/

#配置java与tomcat环境变量
ENV JAVA_HOME /usr/local/jre1.8.0_171
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
ENV CATALINA_HOME /usr/local/apache-tomcat-8.5.3
ENV CATALINA_BASE /usr/local/apache-tomcat-8.5.3
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin

#容器运行时监听的端口
EXPOSE  8080

CMD ["catalina.sh", "run"]
```
2. 切换至docker-build文件夹下执行命令
```
$ docker build -t tomcat8:jre8 .
Sending build context to Docker daemon   94.6MB
Step 1/11 : FROM ubuntu:14.10
 ---> a8a2ba3ce1a3
Step 2/11 : MAINTAINER created from zhangyognxin@f6car.com
 ---> Running in 81e5c424ac4d
Removing intermediate container 81e5c424ac4d
 ---> 27002ba82d71
Step 3/11 : ADD jre-8u171-linux-x64.tar.gz /usr/local/
 ---> 60b29e76b22d
Step 4/11 : ADD apache-tomcat-8.5.3.tar.gz /usr/local/
 ---> adb5ed3881da
Step 5/11 : ENV JAVA_HOME /usr/local/jre1.8.0_171
 ---> Running in 18fe496e4d4a
Removing intermediate container 18fe496e4d4a
 ---> 7716c6fa2809
Step 6/11 : ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
 ---> Running in 2f0b2c8d4205
Removing intermediate container 2f0b2c8d4205
 ---> 558b23f7cde4
Step 7/11 : ENV CATALINA_HOME /usr/local/apache-tomcat-8.5.3
 ---> Running in 4c902449a7e7
Removing intermediate container 4c902449a7e7
 ---> b3cc8cb3da03
Step 8/11 : ENV CATALINA_BASE /usr/local/apache-tomcat-8.5.3
 ---> Running in 8f84f9f78f15
Removing intermediate container 8f84f9f78f15
 ---> d254466d7ca0
Step 9/11 : ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin
 ---> Running in a86e0c15205a
Removing intermediate container a86e0c15205a
 ---> 94a98f047d9b
Step 10/11 : EXPOSE  8080
 ---> Running in 8e01c39824cd
Removing intermediate container 8e01c39824cd
 ---> 39d8a8b05172
Step 11/11 : CMD ["catalina.sh", "run"]
 ---> Running in b315b22125ae
Removing intermediate container b315b22125ae
 ---> 8e145b187fd5
Successfully built 8e145b187fd5
Successfully tagged tomcat8:jre8
```
3. 启动
```
docker run -it -d --rm -p 8888:8080 --name tomcat8 -v ~/docker/tomcat8:/usr/local/apache-tomcat-8.5.3/webapps/docker tomcat8:jre8

```
