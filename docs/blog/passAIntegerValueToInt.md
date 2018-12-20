---
title: Integer a = null; int b=a;
date: 2018-11-29 14:39:31
tag:
 - java
---

如题执行下面的方法会发生什么？
```java
Integer a = null;
int b=a;
```
<!-- more -->
这个话题牵扯到java的基本数据类型对应的对象类型的自动拆箱，首先我们考虑下下面的代码的执行：
```java
 Integer a = 1;
 int b=a;
```
我们把断点打在Integer.intValue()方法上，发现```int b= a 就是执行 Integer(1).intValue()```
![](https://ww1.sinaimg.cn/large/007iUjdily1fxoxhtdh5qj30h103udfy)
所以
```java
Integer a = null;
int b = a;

等于
int b = null.intValue();
会抛出空指针异常

```
