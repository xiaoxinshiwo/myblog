# SpringBoot 暴露 MBean
<authorAndTime dateTime='2018-06-07 15:03:43'/>

## 增加配置项

```
spring.jmx.default-domain=${spring.application.name}
spring.jmx.enabled=true
spring.jmx.server=mbeanServer
```
## 配置需要暴露的mbean

```
package com.xiaoxin.jmx.bean;

import lombok.extern.slf4j.Slf4j;
import org.springframework.jmx.export.annotation.ManagedOperation;
import org.springframework.jmx.export.annotation.ManagedResource;
import org.springframework.stereotype.Component;

/**
 * @Auther zhangyongxin
 * @date 2018/6/6 下午1:28
 */
@Component
@ManagedResource(objectName = "com.xiaoxin.jmx.bean:name=TestJmxBean", description = "TestMBean manager.")
@Slf4j
public class TestJmxBean {

    private String name;

    /**
     * 此操作可以暴露操作给jConsole，实际在清除缓存是可以使用
     */
    @ManagedOperation(description = "clearName")
    public void clearName() {
        this.name = null;
        log.info("invoked clearName");
    }
}
```
## 注解含义参照：

Purpose | Annotation | Annotation Type
------- | -------| -------
|Mark all instances of a Class as JMX managed resources|@ManagedResource|Class|
|Mark a method as a JMX operation|@ManagedOperation|Method|
|Mark a getter or setter as one half of a JMX attribute|@ManagedAttribute|Method only getters and setters)|
|Define descriptions for operation parameters|@ManagedOperationParameter and<br/>@ManagedOperationParameters|Method|


## 参考: 
[https://docs.spring.io/spring/docs/4.3.17.RELEASE/spring-framework-reference/htmlsingle/#jmx-exporting](https://docs.spring.io/spring/docs/4.3.17.RELEASE/spring-framework-reference/htmlsingle/#jmx-exporting)

## 远程连接端口设置
```
java -Dcom.sun.management.jmxremote \
-Dcom.sun.management.jmxremote.port=9010 \
-Dcom.sun.management.jmxremote.local.only=false \
-Dcom.sun.management.jmxremote.authenticate=false \
-Dcom.sun.management.jmxremote.ssl=false \
-jar design-pattern-0.0.1-SNAPSHOT.jar
```


