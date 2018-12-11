---
title: maven命令
date: 2018-06-07 15:03:43
type: post
tag:
  - maven
---
分享一个有用的maven命令：```mvn -N versions:update-child-modules```
这个命令可以在修改父pom version后全局替换子module的version为当前父module的version
之前都是全局搜索替换，有点麻烦，现在一个命令行搞定，如果你还不知道，赶紧用起来吧 :)
<!-- more -->
另外一个更方便的更新版本号的命令：```versions:set -DnewVersion=1.3.73```
