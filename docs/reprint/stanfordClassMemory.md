# 斯坦福大学公开课-内存
<authorAndTime dateTime='2018-04-30 12:19:46'/>

对java内存分配的问题会豁然开朗，值得反复观看。
最后2分钟，有一点应该是错误的：<br/>
String s1=hello;<br/>
String s2=hello;<br/>
s1==s2应该为true。<br/>
1. 相等的字符串字面量将会指向相同的字符串对象（甚至是在不同包的不同类中）。<br/>
2. 总之，字符串字面量不会被垃圾回收。绝对不会。<br/>
3. 在运行时创建的字符串和由字符串字面量创建的是两个不同的对象。<br/>
4. 对于运行时创建的字符串你可以通过intern()方法来重用字符串字面量<br/>

使用equals()方法是比较两个字符串是否相等的最好方式。<br/>

<iframe width="900" height="1500" src="https://open.163.com/movie/2010/1/I/3/M6LDTAPTU_M6LFSFRI3.html" frameborder="0" allowfullscreen></iframe>


