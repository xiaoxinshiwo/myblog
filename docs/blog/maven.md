---
title: maven命令
date: 2018-06-07 15:03:43
type: post
tag:
  - maven
---
1. 版本替换
分享一个有用的maven命令：```mvn -N versions:update-child-modules```
这个命令可以在修改父pom version后全局替换子module的version为当前父module的version
之前都是全局搜索替换，有点麻烦，现在一个命令行搞定，如果你还不知道，赶紧用起来吧 :)
另外一个更方便的更新版本号的命令：```versions:set -DnewVersion=1.3.73```
<!-- more -->
2. 上传本地jar到maven仓库
```
— resource
mvn deploy:deploy-file -DgroupId=com.alibaba.sdk -DartifactId=taobao-sdk -Dversion=20181204-test -Dpackaging=jar -Dfile=/Users/zhangyongxin/Downloads/dingtalk-sdk-java/taobao-sdk-java-auto_1479188381469-20181204-source.jar -Dclassifier=sources -Durl=https://maven.carzone365.com/repository/maven-3rd/ -DrepositoryId=releases

— jar
mvn deploy:deploy-file -DgroupId=com.alibaba.sdk -DartifactId=taobao-sdk -Dversion=20181204-test -Dpackaging=jar -Dfile=/Users/zhangyongxin/Downloads/dingtalk-sdk-java/taobao-sdk-java-auto_1479188381469-20181204.jar -Durl=https://maven.carzone365.com/repository/maven-3rd/ -DrepositoryId=releases
```
3. maven依赖本地jar
```xml
<dependency>
	<groupId>com.taobao.top</groupId>
	<artifactId>lippi-oapi-encrpt</artifactId>
	<version>dingtalk-SNAPSHOT</version>
	<scope>system</scope>
	<systemPath>${pom.basedir}/lib/lippi-oapi-encrpt.jar</systemPath>
</dependency>

```
