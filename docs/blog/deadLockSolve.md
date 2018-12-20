---
title: 记一次生产死锁的问题调查和解决
date: 2018-11-07 17:12:47
tag:
  - mysql
  - 死锁
---

邮件收到报错信息如下：
```java
2018-11-07 16:13:59,867 [ERROR] [XNIO-3 task-68] c.f.p.s.i.p.TsPurchaseServiceImpl:? 生产应付单失败Deadlock found when trying to get lock; try restarting transaction
com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException: Deadlock found when trying to get lock; try restarting transaction
	at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:57)
	at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.lang.reflect.Constructor.newInstance(Constructor.java:526)
	<!-- more -->
	at com.air.tqb.dubbo.filter.ClientExceptionFilter.invoke(ClientExceptionFilter.java:36)
	at com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)
	at com.air.tqb.dubbo.filter.ClientInfoConsumerFilter.invoke(ClientInfoConsumerFilter.java:52)
	at com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)
	at com.alibaba.dubbo.rpc.protocol.dubbo.filter.FutureFilter.invoke(FutureFilter.java:53)
	at com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)
	at com.alibaba.dubbo.monitor.support.MonitorFilter.invoke(MonitorFilter.java:75)
	at com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)
	at com.alibaba.dubbo.rpc.filter.ConsumerContextFilter.invoke(ConsumerContextFilter.java:48)
	at com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)
	at com.alibaba.dubbo.rpc.protocol.InvokerWrapper.invoke(InvokerWrapper.java:53)
	at com.alibaba.dubbo.rpc.cluster.support.FailoverClusterInvoker.doInvoke(FailoverClusterInvoker.java:77)
	at com.alibaba.dubbo.rpc.cluster.support.AbstractClusterInvoker.invoke(AbstractClusterInvoker.java:227)
	at com.alibaba.dubbo.rpc.cluster.support.wrapper.MockClusterInvoker.invoke(MockClusterInvoker.java:72)
	at com.alibaba.dubbo.rpc.proxy.InvokerInvocationHandler.invoke(InvokerInvocationHandler.java:52)
	at com.alibaba.dubbo.common.bytecode.proxy31.genPayment(proxy31.java)
	at com.f6car.purchase.service.impl.purchase.TsPurchaseServiceImpl.inStockPurchase(TsPurchaseServiceImpl.java:472)
	at com.f6car.purchase.service.impl.purchase.TsPurchaseServiceImpl$$FastClassBySpringCGLIB$$405c4cc7.invoke(<generated>)
	at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)
	at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:738)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:157)
	at org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:99)
	at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:282)
	at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:96)
```
由于```com.f6car.purchase.service.impl.purchase.TsPurchaseServiceImpl.inStockPurchase(TsPurchaseServiceImpl.java:472)```业务内部调用了dubbo接口，
这里看不到接口内部的具体超时情况，在这个时间的另外一个系统收到的报错邮件如下：
```java
2018-11-07 16:13:59,859 [ERROR] [DubboServerHandler-10.25.24.204:20880-thread-188] c.a.t.s.a.ExceptionHandlerAspect:?
### Error querying database.  Cause: com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException: Deadlock found when trying to get lock; try restarting transaction
### The error may exist in URL [jar:file:/mnt/apache-tomcat-7.0.70-erp/webapps/kzf6/WEB-INF/lib/biz-mapper-1.0-SNAPSHOT.jar!/sqlmap/BaseMapper.xml]
### The error may involve defaultParameterMap
### The error occurred while setting parameters
### SQL: select genatorBillNo(?,?,CAST(?  as unsigned ))
### Cause: com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException: Deadlock found when trying to get lock; try restarting transaction
; SQL []; Deadlock found when trying to get lock; try restarting transaction; nested exception is com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException: Deadlock found when trying to get lock; try restarting transaction
IP:null
IdOwnOrg:10546050787349562379
UserID:10546050787350232730
Type:DUBBO
Action:genPayment-purchase
Args:["YFD","2018-11-07","10546050787349562379"]
org.springframework.dao.DeadlockLoserDataAccessException:
### Error querying database.  Cause: com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException: Deadlock found when trying to get lock; try restarting transaction
### The error may exist in URL [jar:file:/mnt/apache-tomcat-7.0.70-erp/webapps/kzf6/WEB-INF/lib/biz-mapper-1.0-SNAPSHOT.jar!/sqlmap/BaseMapper.xml]
### The error may involve defaultParameterMap
### The error occurred while setting parameters
### SQL: select genatorBillNo(?,?,CAST(?  as unsigned ))
### Cause: com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException: Deadlock found when trying to get lock; try restarting transaction
; SQL []; Deadlock found when trying to get lock; try restarting transaction; nested exception is com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException: Deadlock found when trying to get lock; try restarting transaction
at org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator.doTranslate(SQLErrorCodeSQLExceptionTranslator.java:269)
at org.springframework.jdbc.support.AbstractFallbackSQLExceptionTranslator.translate(AbstractFallbackSQLExceptionTranslator.java:72)
at org.mybatis.spring.MyBatisExceptionTranslator.translateExceptionIfPossible(MyBatisExceptionTranslator.java:74)
at org.mybatis.spring.SqlSessionTemplate$SqlSessionInterceptor.invoke(SqlSessionTemplate.java:421)
at com.sun.proxy.$Proxy51.selectOne(Unknown Source)
at org.mybatis.spring.SqlSessionTemplate.selectOne(SqlSessionTemplate.java:166)
at org.apache.ibatis.binding.MapperMethod.execute(MapperMethod.java:69)
at org.apache.ibatis.binding.MapperProxy.invoke(MapperProxy.java:53)
at com.sun.proxy.$Proxy54.getBillNo(Unknown Source)
at com.air.tqb.service.base.impl.BaseServiceImpl.getBillNo(BaseServiceImpl.java:75)
at com.air.tqb.service.base.impl.BaseServiceImpl$$FastClassBySpringCGLIB$$80aa6800.invoke(<generated>)
at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)
at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:700)
at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:150)
at org.springframework.transaction.interceptor.TransactionInterceptor$1.proceedWithInvocation(TransactionInterceptor.java:96)
at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:260)
at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:94)
```
发现```select genatorBillNo(?,?,CAST(?  as unsigned ))```时超时，赶紧让运维同学dump出线上的死锁日志如下：
```sql
------------------------
LATEST  DETECTED  DEADLOCK
------------------------
2018-11-07  16:13:59  0x7f8f23d34700
***  (1)  TRANSACTION:
TRANSACTION  288341382,  ACTIVE  0  sec  fetching  rows
mysql  tables  in  use  3,  locked  3
LOCK  WAIT  304  lock  struct(s),  heap  size  41168,  2069  row  lock(s)
MySQL  thread  id  1523982,  OS  thread  handle  140248716125952,  query  id  7086375026  10.25.24.204  root  Searching  rows  for  update
UPDATE  tm_billno_sn  n  SET  next_sn  =  n.next_sn+1  WHERE
n.business_type  =    NAME_CONST('bill_type',_utf8mb4'YFD'  COLLATE  'utf8mb4_bin')  AND  DATE_FORMAT(n.sn_date,'%Y-%m-%d')=    NAME_CONST('bill_date',_utf8mb4'2018-11-07'  COLLATE  'utf8mb4_bin')  AND  n.id_own_org  =    NAME_CONST('id_own_org',10546050787349562379)
***  (1)  WAITING  FOR  THIS  LOCK  TO  BE  GRANTED:
RECORD  LOCKS  space  id  2011  page  no  12297  n  bits  336  index  PRIMARY  of  table  `f6dms`.`tm_billno_sn`  trx  id  288341382  lock_mode  X  locks  rec  but  not  gap  waiting
Record  lock,  heap  no  122  PHYSICAL  RECORD:  n_fields  7;  compact  format;  info  bits  0
  0:  len  8;  hex  925b1950d335e7a8;  asc    [  P  5    ;;
  1:  len  6;  hex  00000868dc16;  asc        h    ;;
  2:  len  7;  hex  270000015b2407;  asc  '      [$  ;;
  3:  len  10;  hex  47442020202020202020;  asc  GD                ;;
  4:  len  8;  hex  0000000000000003;  asc                  ;;
  5:  len  8;  hex  925b1950d333040b;  asc    [  P  3    ;;
  6:  len  3;  hex  8fc4de;  asc        ;;

***  (2)  TRANSACTION:
TRANSACTION  288341314,  ACTIVE  1  sec  fetching  rows
mysql  tables  in  use  3,  locked  3
6340  lock  struct(s),  heap  size  778448,  1678750  row  lock(s)
MySQL  thread  id  1523984,  OS  thread  handle  140252758099712,  query  id  7086372072  10.25.24.204  root  Sending  data
SELECT  next_sn  INTO  seq  FROM  tm_billno_sn    s  WHERE  s.business_type  =  'TQB'  FOR  UPDATE
***  (2)  HOLDS  THE  LOCK(S):
RECORD  LOCKS  space  id  2011  page  no  12297  n  bits  336  index  PRIMARY  of  table  `f6dms`.`tm_billno_sn`  trx  id  288341314  lock_mode  X
Record  lock,  heap  no  1  PHYSICAL  RECORD:  n_fields  1;  compact  format;  info  bits  0
```
关键原因：
```sql
6340  lock  struct(s),  heap  size  778448,  1678750  row  lock(s)
MySQL  thread  id  1523984,  OS  thread  handle  140252758099712,  query  id  7086372072  10.25.24.204  root  Sending  data
SELECT  next_sn  INTO  seq  FROM  tm_billno_sn    s  WHERE  s.business_type  =  'TQB'  FOR  UPDATE
```
查找相关代码和function找到罪魁祸首：```genatorOrgNo```
```sql
CREATE DEFINER=`root`@`%` FUNCTION `genatorOrgNo`() RETURNS varchar(255) CHARSET utf8
BEGIN
DECLARE newBillNo VARCHAR(20) DEFAULT '';	#生成最新单据号
DECLARE seq BIGINT DEFAULT 0;								#当前单据序列
DECLARE seqStr VARCHAR(10) DEFAULT '';		#序列补0
SELECT next_sn INTO seq FROM tm_billno_sn  s WHERE s.business_type = 'TQB' FOR UPDATE;
IF seq = 0 THEN
	INSERT INTO tm_billno_sn(pk_id,business_type,next_sn,id_own_org,sn_date)
			VALUES (UUID_SHORT(),'TQB',0002,NULL,NULL);
  SET seq = 001;
ELSE
	UPDATE tm_billno_sn SET next_sn = next_sn+1 WHERE business_type = 'TQB';
END IF;
SET seqStr = LPAD(seq,4,'0');
SET newBillNo = CONCAT('CHS',DATE_FORMAT(NOW(),'%Y%m%d'),seqStr);
RETURN newBillNo;
END
```
解决办法就是将这个function修改掉，将生成单号的序列保存到另一张表中。
