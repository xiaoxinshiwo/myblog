---
title: 序列化异常之MySQLIntegrityConstraintViolationException
date: 2018-11-28 14:29:21
type: post
tag:
  - InvalidClassException
  - serialVersionUID
---

背景：A服务通过dubbo接口调用B服务，调用A服务时抛出异常如下：
```java
com.alibaba.dubbo.rpc.RpcException: Failed to invoke the method getUser in the service com.xiaoxin.passport.api.UserApi. Tried 1 times of the providers [192.168.12.214:20882] (1/1) from the registry local-test.zk.xiaoxin:2181 on the consumer 192.168.13.57 using the dubbo version 2.5.3. Last error is: Failed to invoke remote method: getUser, provider: dubbo://192.168.12.214:20882/com.xiaoxin.passport.api.UserApi?anyhost=true&application=f6-mobile&check=false&default.group=f6-local-test&default.owner=qixiaobo&default.reference.filter=clientException&default.retries=0&default.timeout=60000&dubbo=2.5.3&group=f6-local-test&interface=com.xiaoxin.passport.api.UserApi&methods=updateUserName,countByUserNameInUserCenter,getUser,updateUserPassword,validatePassword,verifyTokenAndReturnQccrUId,registeredUser,generateToken,saveOrUpdateUser,countInUserCenterByUserName,verifyToken,updateCellPhone,getSysUserByUserId,updateUserStatus,checkUserInPlatform,querySingleSysUserVo,countInUserCenterByCellPhone&pid=860&reference.filter=clientException,clientInfoConsumer&revision=0.0.1-SNAPSHOT&serialization=java&service.filter=customException&side=consumer&timestamp=1543373958840, cause: java.io.InvalidClassException: com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException; local class incompatible: stream classdesc serialVersionUID = -5528363270635808904, local class serialVersionUID = -4968823495505380271
java.io.InvalidClassException: com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException; local class incompatible: stream classdesc serialVersionUID = -5528363270635808904, local class serialVersionUID = -4968823495505380271
```
根据异常提示我们轻易的就可以知道这是个序列化异常，本地class的serialVersionUID和传输过来的不一致导致的。
但是MySQLIntegrityConstraintViolationException是mysql的驱动jar中的异常，一般在违反唯一键约束等情况时抛出，A服务引用的版本是5.1.39而B服务引用的版本是5.1.38，理论上A服务接收到的异常应该向下兼容B服务的，实际不是这样。
<!-- more -->
依赖为：
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.39</version>
    <scope>runtime</scope>
</dependency>
```

我们看看不同版本的这个异常的情况：

**5.1.39版本**
```java
package com.mysql.jdbc.exceptions.jdbc4;

import java.sql.SQLIntegrityConstraintViolationException;

public class MySQLIntegrityConstraintViolationException extends SQLIntegrityConstraintViolationException {

    static final long serialVersionUID = -5528363270635808904L;

    public MySQLIntegrityConstraintViolationException() {
        super();
    }

    public MySQLIntegrityConstraintViolationException(String reason, String SQLState, int vendorCode) {
        super(reason, SQLState, vendorCode);
    }

    public MySQLIntegrityConstraintViolationException(String reason, String SQLState) {
        super(reason, SQLState);
    }

    public MySQLIntegrityConstraintViolationException(String reason) {
        super(reason);
    }
}
```
**5.1.38版本**
```java
package com.mysql.jdbc.exceptions.jdbc4;

import java.sql.SQLIntegrityConstraintViolationException;

public class MySQLIntegrityConstraintViolationException extends SQLIntegrityConstraintViolationException {
    public MySQLIntegrityConstraintViolationException() {
    }

    public MySQLIntegrityConstraintViolationException(String reason, String SQLState, int vendorCode) {
        super(reason, SQLState, vendorCode);
    }

    public MySQLIntegrityConstraintViolationException(String reason, String SQLState) {
        super(reason, SQLState);
    }

    public MySQLIntegrityConstraintViolationException(String reason) {
        super(reason);
    }
}
```
从代码中可以看出5.1.38版本并没有独立的serialVersionUID，而5.1.39版本有，所以会造成上述问题。

解决办法：

1. B服务catch异常SQLIntegrityConstraintViolationException，抛出自定义业务异常。
2. A服务和B服务使用一样的依赖版本
