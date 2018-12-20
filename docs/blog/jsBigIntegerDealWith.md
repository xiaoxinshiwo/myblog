---
title: 前端无法正确接收BigInteger型数值
date: 2018-11-21 13:55:05
type: post
tag:
  - javascript
---

诡异的现象，后端返回了BigInteger型数值，但是前端接收后，后面的几位都变成0了？？？很诡异：
<a data-fancybox title="诡异的现象" target="_blank"
href="https://ww1.sinaimg.cn/large/007iUjdily1fxfjjtjhagj30p10gpac0">
![avatar](https://ww1.sinaimg.cn/large/007iUjdily1fxfjjtkkclj317o0emn1l)
</a>
<!-- more -->
但是通过工具获取的值确实是正确的：
<a data-fancybox title="通过工具获取的值" target="_blank"
href="https://ww1.sinaimg.cn/large/007iUjdily1fxfjjtjhagj30p10gpac0">
![avatar](https://ww1.sinaimg.cn/large/007iUjdily1fxfjjtjhagj30p10gpac0)
</a>
google之，得知：

由于JavaScript中Number类型的自身原因，并不能完全表示BigInteger型的数字，在BigInteger长度大于17位时会出现精度丢失的问题。

解决：

原因有了，那么解决的方法是显而易见的：

1、在后台把BigInteger型改为String类型（推荐）；

2、让前端支持long型。

参考：
[https://stackoverflow.com/questions/8663298/json-transfer-of-bigint-12000000000002539-is-converted-to-12000000000002540
](https://stackoverflow.com/questions/8663298/json-transfer-of-bigint-12000000000002539-is-converted-to-12000000000002540
)

