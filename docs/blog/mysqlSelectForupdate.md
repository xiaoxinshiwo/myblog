---
title: Mysql select ... for update
date: 2018-11-06 09:42:01
type: post
tag:
  - mysql
---

> 对于搜索遇到的索引记录，锁定行和任何关联的索引条目，就像您UPDATE为这些行发出 语句一样。阻止其他事务更新这些行，执行SELECT ... LOCK IN SHARE MODE或从某些事务隔离级别读取数据。一致性读取将忽略在读取视图中存在的记录上设置的任何锁定。<br/>
对于锁定读取 （SELECT使用FOR UPDATE或LOCK IN SHARE MODE）， UPDATE和 DELETE语句，所采用的锁取决于语句是使用具有唯一搜索条件的唯一索引还是范围类型搜索条件。<br/>
对于具有唯一搜索条件的唯一索引， InnoDB仅锁定找到的索引记录，而不是之前的间隙。<br/>
对于其他搜索条件以及非唯一索引， InnoDB锁定扫描的索引范围，使用间隙锁或 下一键锁定 来阻止其他会话插入范围所涵盖的间隙。有关间隙锁和下一键锁的信息，请参见第14.6.1节“InnoDB锁定”。

根据mysql官方文档我们可以知道SELECT ... FOR UPDATE可以给查询到的关联记录加上读锁的，能够阻止其他的事务更新这些行。
<!-- more -->
在实际的项目中，订单的流水号的规则如下CGD + 20181011 + 00001 程序调用的function如下：
```
--- genatorBillNo
CREATE DEFINER=`root`@`%` FUNCTION `genatorBillNo`(bill_type VARCHAR(10),bill_date VARCHAR(40),id_own_org BIGINT UNSIGNED) RETURNS varchar(255) CHARSET utf8
BEGIN
DECLARE newBillNo VARCHAR(20) DEFAULT '';	#生成最新单据号
DECLARE seq BIGINT DEFAULT 0;								#当前单据序列
DECLARE seqStr VARCHAR(10) DEFAULT '';		#序列补0
SELECT next_sn INTO seq FROM tm_billno_sn  s WHERE
	s.business_type = bill_type  AND DATE_FORMAT(s.sn_date,'%Y-%m-%d')= bill_date AND s.id_own_org = id_own_org FOR UPDATE;
IF seq = 0 THEN
	INSERT INTO tm_billno_sn(pk_id,business_type,next_sn,id_own_org,sn_date)
			VALUES (UUID_SHORT(),bill_type,002,id_own_org, DATE_FORMAT( bill_date, '%Y-%m-%d'));
  SET seq = 001;
ELSE
	UPDATE tm_billno_sn n SET next_sn = n.next_sn+1 WHERE
			n.business_type = bill_type AND DATE_FORMAT(n.sn_date,'%Y-%m-%d')= bill_date AND n.id_own_org = id_own_org ;
END IF;
SET seqStr = LPAD(seq,3,'0');
SET newBillNo = CONCAT(bill_type,DATE_FORMAT(bill_date,'%Y%m%d'),seqStr);
RETURN newBillNo;
END
--- tm_billno_sn
CREATE TABLE `tm_billno_sn` (
  `pk_id` bigint(20) unsigned NOT NULL COMMENT '主键',
  `business_type` char(10) DEFAULT NULL COMMENT '业务类型',
  `next_sn` bigint(20) unsigned DEFAULT NULL COMMENT '当前流水号',
  `id_own_org` bigint(20) unsigned DEFAULT NULL COMMENT '组织',
  `sn_date` date DEFAULT NULL COMMENT '归零日期',
  PRIMARY KEY (`pk_id`),
  KEY `IDX_SN_DATE` (`sn_date`),
  KEY `IDX_ID_OWN_ORG` (`id_own_org`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
```
我们碰到了这样的问题：当同一个公司（id_own_org）生成流水号所在的事务超长时，本公司生成其他订单流水也会超时，但是我们的初衷是```锁定该公司当天特定类型的行```，怎么本公司的其他类型的行也锁定了呢？
根据官方文档的解释```对于其他搜索条件以及非唯一索引， InnoDB锁定扫描的索引范围```这里我们只用到了```IDX_ID_OWN_ORG```这个索引，而这个索引是单列的，所以该公司下所有的记录条数都被锁定了。
下面我们来做下试验。使用mysql命令行分别开启两个session.
session1:
```
mysql> use test
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> set autocommit=off;
Query OK, 0 rows affected (0.00 sec)
mysql>  begin;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT next_sn FROM tm_billno_sn  s WHERE
    -> s.business_type = 'SKD'  AND DATE_FORMAT(s.sn_date,'%Y-%m-%d')= '2018-11-04' AND s.id_own_org = 10545511425563128134 FOR UPDATE;
+---------+
| next_sn |
+---------+
|       2 |
+---------+
1 row in set (0.25 sec)
```
session2:
```
mysql> UPDATE tm_billno_sn n SET next_sn = n.next_sn+1 WHERE n.business_type = 'YSF' AND DATE_FORMAT(n.sn_date,'%Y-%m-%d')= '2018-11-04' AND n.id_own_org = 10545511425563128134 ;
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```
由此可以验证同一公司（id_own_org）的不同类型也是被锁定了的，肯定不行的。优化方法也很简单，将索引IDX_ID_OWN_ORG改建为```id_own_org和business_type```的联合索引，减小锁定的范围；
或者先通过id_own_org、business_type、sn_date三者获取pk_id其他的操作使用主键索引，这样就可以锁定单行了。
另外：如果索引创建的不合适，select...for update在执行的时候mysql认为效率低，或者锁定范围过大，则会造成锁表的情况，为了验证这一问题我们将```tm_billno_sn```的索引```IDX_ID_OWN_ORG```也删除。表结构如下：
```
CREATE TABLE `tm_billno_sn` (
  `pk_id` bigint(20) unsigned NOT NULL COMMENT '主键',
  `business_type` char(10) DEFAULT NULL COMMENT '业务类型',
  `next_sn` bigint(20) unsigned DEFAULT NULL COMMENT '当前流水号',
  `id_own_org` bigint(20) unsigned DEFAULT NULL COMMENT '组织',
  `sn_date` date DEFAULT NULL COMMENT '归零日期',
  PRIMARY KEY (`pk_id`),
  KEY `IDX_SN_DATE` (`sn_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT;
```
session1:
```
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT next_sn FROM tm_billno_sn  s WHERE
    -> s.business_type = 'SKD'  AND DATE_FORMAT(s.sn_date,'%Y-%m-%d')= '2018-11-04' AND s.id_own_org = 10545511425563128134 FOR UPDATE;
+---------+
| next_sn |
+---------+
|       2 |
+---------+
1 row in set (27.57 sec)
```
session2:
```
mysql> UPDATE tm_billno_sn n SET next_sn = n.next_sn+1 WHERE n.business_type = 'YSF' AND DATE_FORMAT(n.sn_date,'%Y-%m-%d')= '2018-11-04' AND n.id_own_org = 10545511425561984440 ;
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```
综上我们得出结论，在使用select ... for update 企图锁定行的时候最好能够使用索引锁定唯一的行，否则就会造成锁表，或者锁定的数据范围太大，造成性能很差的结果。
