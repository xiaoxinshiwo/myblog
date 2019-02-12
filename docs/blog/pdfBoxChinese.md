---
title: pdfBox pdf转image 出现框框问题解决
date: 2019-01-25 16:48:14
tag:
  - pdfbox
---
maven依赖

```xml
<dependency>
    <groupId>org.apache.pdfbox</groupId>
    <artifactId>pdfbox</artifactId>
    <version>2.0.13</version>
</dependency>
```
<!-- more -->
工具类实现
```java
package com.f6car.passport.core;

import com.f6car.passport.exception.ServiceException;
import lombok.extern.slf4j.Slf4j;
import main.java.com.UpYun;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * pdf 工具类
 * @author zhangyongxin
 * @date 2019/1/21 12:33 PM
 */
@Slf4j
@Component
public class PdfUtil {

	/**
	 * 本地pdf 转换为 本地图片
	 * @param filePath
	 * @return
	 */
	public static List<String> pdfToImage(String filePath){

		List<String> list = new ArrayList<>();
		String destImageDirPath = filePath.substring(0,filePath.lastIndexOf(File.separator));//获取去除后缀的文件路径

		String imagePath;
		File sourcePdfFile = new File(filePath);
		try {
			File destImageDirFile = new File(destImageDirPath);
			if(!destImageDirFile.exists()){
				destImageDirFile.mkdirs();
			}
			PDDocument doc = PDDocument.load(sourcePdfFile);
			PDFRenderer renderer = new PDFRenderer(doc);
			int pageCount = doc.getNumberOfPages();
			for(int i=0; i<pageCount; i++){
				// 方式1,第二个参数是设置缩放比(即像素)
				// BufferedImage image = renderer.renderImageWithDPI(i, 296);
				// 方式2,第二个参数是设置缩放比(即像素)
				BufferedImage image = renderer.renderImage(i, 1.25f);  //第二个参数越大生成图片分辨率越高，转换时间也就越长
				imagePath = destImageDirPath + File.separator + i + ".jpg";
				ImageIO.write(image, "PNG", new File(imagePath));
				list.add(imagePath);
			}
			doc.close();
		} catch (IOException e) {
			log.error("pdfToImage error :{}",e);
		}
		return list;
	}
}

```
生成完毕后上传到又拍云，返回前端一个可以访问的网路图片地址。
## 碰到的问题1：
使用pdfbox会产生下图的问题，一些字变成了框框<br />![image.png](https://cdn.nlark.com/yuque/735/2019/png/227459/1548157347692-d07cd99f-2f96-429c-b553-48cbae0ffb10.png#align=left&display=inline&height=706&linkTarget=_blank&name=image.png&originHeight=706&originWidth=1018&size=78588&width=1018)<br />其实是pdf文件的字体，服务器上没有<br />![image.png](https://cdn.nlark.com/yuque/735/2019/png/227459/1548157420271-e5db7e36-f550-44c8-b27f-08bdcebcf5e2.png#align=left&display=inline&height=422&linkTarget=_blank&name=image.png&originHeight=422&originWidth=774&size=79611&width=774)<br />然后pdfbox会查找替代字体：

```java
2019-01-24 14:27:01,216 [INFO] [DubboServerHandler-192.168.12.214:20882-thread-160] c.f.p.c.PdfDownloader:49 url:https://dfs00.zhangzhongpei.com/qccr/g00/invoiceassistant/2019/01/15e32df6f44134f0.pdf download success
2019-01-24 14:27:01,300 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.p.f.PDTrueTypeFont:225 Using fallback font 'LiberationSans' for 'MicrosoftYaHei'
2019-01-24 14:27:01,304 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.p.f.PDCIDFontType0:161 Using fallback LiberationSans for CID-keyed font STSongStd-Light
2019-01-24 14:27:01,304 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 38081 (CID 0e4d) in font STSongStd-Light
2019-01-24 14:27:01,305 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 24515 (CID 0f8f) in font STSongStd-Light
2019-01-24 14:27:01,305 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 26725 (CID 0c42) in font STSongStd-Light
2019-01-24 14:27:01,305 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 21495 (CID 077c) in font STSongStd-Light
2019-01-24 14:27:01,306 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 24215 (CID 05cb) in font STSongStd-Light
2019-01-24 14:27:01,306 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 21271 (CID 041a) in font STSongStd-Light
2019-01-24 14:27:01,307 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 20140 (CID 08d8) in font STSongStd-Light
2019-01-24 14:27:01,307 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 22823 (CID 0576) in font STSongStd-Light
2019-01-24 14:27:01,307 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 19996 (CID 05ea) in font STSongStd-Light
2019-01-24 14:27:01,307 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 26377 (CID 10b5) in font STSongStd-Light
2019-01-24 14:27:01,307 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 38480 (CID 0f4b) in font STSongStd-Light
2019-01-24 14:27:01,308 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 20844 (CID 0704) in font STSongStd-Light
2019-01-24 14:27:01,308 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 21496 (CID 0db3) in font STSongStd-Light
2019-01-24 14:27:01,309 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 21512 (CID 0786) in font STSongStd-Light
2019-01-24 14:27:01,309 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 21516 (CID 0e5d) in font STSongStd-Light
2019-01-24 14:27:01,309 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 32534 (CID 0449) in font STSongStd-Light
2019-01-24 14:27:01,310 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 22777 (CID 1043) in font STSongStd-Light
2019-01-24 14:27:01,310 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 19975 (CID 0ea3) in font STSongStd-Light
2019-01-24 14:27:01,311 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 20803 (CID 10ed) in font STSongStd-Light
2019-01-24 14:27:01,311 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-160] o.a.p.r.CIDType0Glyph2D:63 No glyph for 25972 (CID 119c) in font STSongStd-Light
```
源码中备用字体的查找：
```java
private String getFallbackFontName(PDFontDescriptor fontDescriptor) {
        String fontName;
        if (fontDescriptor != null) {
            boolean isBold = false;
            String name = fontDescriptor.getFontName();
            if (name != null) {
                String lower = fontDescriptor.getFontName().toLowerCase();
                isBold = lower.contains("bold") || lower.contains("black") || lower.contains("heavy");
            }

            if (fontDescriptor.isFixedPitch()) {
                fontName = "Courier";
                if (isBold && fontDescriptor.isItalic()) {
                    fontName = fontName + "-BoldOblique";
                } else if (isBold) {
                    fontName = fontName + "-Bold";
                } else if (fontDescriptor.isItalic()) {
                    fontName = fontName + "-Oblique";
                }
            } else if (fontDescriptor.isSerif()) {
                fontName = "Times";
                if (isBold && fontDescriptor.isItalic()) {
                    fontName = fontName + "-BoldItalic";
                } else if (isBold) {
                    fontName = fontName + "-Bold";
                } else if (fontDescriptor.isItalic()) {
                    fontName = fontName + "-Italic";
                } else {
                    fontName = fontName + "-Roman";
                }
            } else {
                fontName = "Helvetica";
                if (isBold && fontDescriptor.isItalic()) {
                    fontName = fontName + "-BoldOblique";
                } else if (isBold) {
                    fontName = fontName + "-Bold";
                } else if (fontDescriptor.isItalic()) {
                    fontName = fontName + "-Oblique";
                }
            }
        } else {
            fontName = "Times-Roman";
        }

        return fontName;
    }
```

所以需要在服务器上安装需要的字体(MicrosoftYaHei、STHeitiTC-Medium)即可<br />![image.png](https://cdn.nlark.com/yuque/735/2019/png/227459/1548157554941-e551319a-4206-49b8-9904-2eb9f33f7feb.png#align=left&display=inline&height=742&linkTarget=_blank&name=image.png&originHeight=742&originWidth=1050&size=85316&width=1050)
## 碰到的问题2：
问题1虽然通过安装微软字体解决了，但是可能会侵权，所以orz继续寻找最佳方案。<br />解决思路：[安装开源的思源字体](https://github.com/Pal3love/Source-Han-TrueType)，在pdfBox获取系统字体时，无论识别的字体是什么统一使用安装的思源字体，代码实现如下：

```java
package com.f6car.passport.core;

import lombok.extern.slf4j.Slf4j;
import org.apache.fontbox.FontBoxFont;
import org.apache.fontbox.ttf.TrueTypeFont;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.font.*;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * pdf 工具类
 * @author zhangyongxin
 * @date 2019/1/21 12:33 PM
 */
@Slf4j
@Component
public class PdfUtil {
	private static String BASE_FONT = "SourceHanSerifCN";
	static {

		FontMapper fontMapper = new FontMapper() {
			private FontMapper delegate = FontMappers.instance();

			@Override
			public FontMapping<TrueTypeFont> getTrueTypeFont(String baseFont, PDFontDescriptor fontDescriptor) {
				return delegate.getTrueTypeFont(BASE_FONT, fontDescriptor);
			}

			@Override
			public FontMapping<FontBoxFont> getFontBoxFont(String baseFont, PDFontDescriptor fontDescriptor) {
				return delegate.getFontBoxFont(BASE_FONT, fontDescriptor);
			}

			@Override
			public CIDFontMapping getCIDFont(String baseFont, PDFontDescriptor fontDescriptor, PDCIDSystemInfo cidSystemInfo) {
				return delegate.getCIDFont(BASE_FONT, fontDescriptor, cidSystemInfo);
			}

		};
		FontMappers.set(fontMapper);
	}

	/**
	 * 本地pdf 转换为 本地图片
	 * @param filePath
	 * @return
	 */
	public static List<String> pdfToImage(String filePath){

		List<String> list = new ArrayList<>();
		String destImageDirPath = filePath.substring(0,filePath.lastIndexOf(File.separator));//获取去除后缀的文件路径

		String imagePath;
		File sourcePdfFile = new File(filePath);
		try {
			File destImageDirFile = new File(destImageDirPath);
			if(!destImageDirFile.exists()){
				destImageDirFile.mkdirs();
			}
			PDDocument doc = PDDocument.load(sourcePdfFile);
			PDFRenderer renderer = new PDFRenderer(doc);
			int pageCount = doc.getNumberOfPages();
			for(int i=0; i<pageCount; i++){
				// 方式1,第二个参数是设置缩放比(即像素)
				// BufferedImage image = renderer.renderImageWithDPI(i, 296);
				// 方式2,第二个参数是设置缩放比(即像素)
				BufferedImage image = renderer.renderImage(i, 1.25f);  //第二个参数越大生成图片分辨率越高，转换时间也就越长
				imagePath = destImageDirPath + File.separator + i + ".jpg";
				ImageIO.write(image, "PNG", new File(imagePath));
				list.add(imagePath);
			}
			if( doc != null ){
				doc.close();
			}
		} catch (IOException e) {
			log.error("pdfToImage error :{}",e);
		}
		return list;
	}
}

```
打印的日志也没出现之前的WARN了

```java
2019-01-25 16:20:21,935 [INFO] [DubboServerHandler-192.168.12.214:20882-thread-76] c.f.p.c.PdfDownloader:49 url:https://dfs00.zhangzhongpei.com/qccr/g00/invoiceassistant/2019/01/15e32df6f44134f0.pdf download success
2019-01-25 16:20:22,980 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-76] o.a.p.p.f.FileSystemFontProvider:481 New fonts found, font cache will be re-built
2019-01-25 16:20:22,980 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-76] o.a.p.p.f.FileSystemFontProvider:233 Building on-disk font cache, this may take a while
2019-01-25 16:20:23,112 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-76] o.a.p.p.f.FileSystemFontProvider:236 Finished building on-disk font cache, found 55 fonts
2019-01-25 16:20:23,148 [WARN] [DubboServerHandler-192.168.12.214:20882-thread-76] o.a.f.t.CmapSubtable:336 Format 14 cmap table is not supported and will be ignored
2019-01-25 16:20:23,705 [INFO] [DubboServerHandler-192.168.12.214:20882-thread-76] c.f.p.a.i.ElecReceiptApiImpl:91 uplod success:true
```




