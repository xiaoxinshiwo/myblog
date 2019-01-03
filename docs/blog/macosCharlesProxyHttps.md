---
 title: macOS 下使用charles抓包https
 date: 2018-12-20 13:40:16
 tag:
  - 抓包
---

1. 环境准备：macbookPro 一台，小米手机一台（或iphone），charles安装包
    charles破解版获取地址
    [https://xclient.info/s/charles.html](https://xclient.info/s/charles.html)
2. 在mac上安装charles，破解步骤按照xclient.info上的步骤即可。
<!-- more -->
3. 设置charles

    设置代理的端口


<a data-fancybox title="设置代理的端口" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687764-2f289460-2ba9-4897-96f5-e48ea8efb7f7.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687764-2f289460-2ba9-4897-96f5-e48ea8efb7f7.png "")
</a>
    安装证书


<a data-fancybox title="安装证书" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687795-b516b629-3c18-4b4f-af1a-222721ea0cd7.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687795-b516b629-3c18-4b4f-af1a-222721ea0cd7.png "")
</a>
    安装完后提示证书不受信任，双击设置【始终信任】即可


<a data-fancybox title="双击设置" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687827-1f8bd3a0-f796-4429-ae98-cb4028ef08d1.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687827-1f8bd3a0-f796-4429-ae98-cb4028ef08d1.png "")
</a>
4. 手机端设置代理（前提：电脑和手机在同一个局域网内）


<a data-fancybox title="手机端设置代理" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687880-7174dc25-13ff-4327-884f-9bdfd3473fa5.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687880-7174dc25-13ff-4327-884f-9bdfd3473fa5.png "")
</a>



<a data-fancybox title="手机端设置代理" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687908-0b5fe617-925e-46da-b589-3836d84b20e4.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687908-0b5fe617-925e-46da-b589-3836d84b20e4.png "")
</a>

    点击无线网，设置如下：


<a data-fancybox title="点击无线网" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687958-66586e91-7593-4b6f-bcc3-c5127c24c872.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687958-66586e91-7593-4b6f-bcc3-c5127c24c872.png "")
</a>



5. 手机端安装证书
    手机浏览器输入 【chls.pro/ssl】就会自动下载证书。在iPhone或其他手机上可以直接安装。下面说下在小米6上怎么安装（复杂。。。）
    在小米6自带浏览器或者使用第三方浏览器直接打开都不能安装下载的.crt证书。提示【无法安装证书】
    在设置 > 更多设置 > 系统安全 > 加密与凭证 > 从存储设备安装 提示：【没有安装的证书】
    心好累。。。
    还好有最后一招：
    在电脑上将安装好的证书导出


<a data-fancybox title="电脑上将安装好的证书导出" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687986-9ec6abed-7447-4dd3-be4e-5788a7b00cae.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687986-9ec6abed-7447-4dd3-be4e-5788a7b00cae.png "")
</a>

    导出后的文件是：charles-ssl-proxying-certificate.pem，上传到手机上。继续按照步骤：设置 > 更多设置 > 系统安全 > 加密与凭证 > 从存储设备安装 但是并不能安装（网上有人说可以）。
    我们利用手机自带的文件管理器将文件后缀改为.crt后安装如下：


<a data-fancybox title="安装证书" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805688018-7b814adc-bf5b-4628-92c0-d8ba4880c259.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805688018-7b814adc-bf5b-4628-92c0-d8ba4880c259.png "")
</a>

    证书名字随便输入，提示安装完成。查看授信的证书如下：


<a data-fancybox title="查看授信的证书" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805688041-03151c4e-771c-4e92-95d3-46c1775f2a42.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805688041-03151c4e-771c-4e92-95d3-46c1775f2a42.png "")
</a>

    至此，小米6上的证书安装成功（finally）。
    iphone上的安装就很简单了。


<a data-fancybox title="查看授信的证书" target="_blank"
href="https://upload-images.jianshu.io/upload_images/1901430-7bc4aeef100b2746.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/450/format/webp">
![image | left](https://upload-images.jianshu.io/upload_images/1901430-7bc4aeef100b2746.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/450/format/webp "")
</a>

    但是iphone安装完证书后需要启用，设置 > 通用 > 关于手机 > 证书信任设置：


<a data-fancybox title="查看授信的证书" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805688090-ef033d95-41d5-437b-b9c4-cf2a60580c5f.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805688090-ef033d95-41d5-437b-b9c4-cf2a60580c5f.png "")
</a>




6. 设置ssl proxy 代理的地址和端口


<a data-fancybox title="查看授信的证书" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805688064-4ed70bab-e785-4939-bed8-3f78fb14c932.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805688064-4ed70bab-e785-4939-bed8-3f78fb14c932.png "")
</a>
7. 打开需要抓包的app，电脑端抓包如下：


<a data-fancybox title="查看授信的证书" target="_blank"
href="https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687858-b7cf0b20-16aa-487f-9517-e2d4df6eaafd.png">
![image | left](https://cdn.nlark.com/yuque/735/2018/png/213602/1545805687858-b7cf0b20-16aa-487f-9517-e2d4df6eaafd.png "")
</a>
8. ps:微博不知道为啥抓取不到 ○|￣|\_


