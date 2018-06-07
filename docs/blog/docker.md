# docker 入门
<authorAndTime dateTime='2018-06-07 15:03:29'/>

## docker practice

为了保持内容为最新，建议每次阅读前先 pull 最新镜像
```
$ docker pull dockerpracticecn/docker_practice

$ docker run -it --rm -d --name dockerPractice -p  4000:80  dockerpracticecn/docker_practice
```
之后打开浏览器，在地址栏输入 ```127.0.0.1:4000``` 即可开始阅读。

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
