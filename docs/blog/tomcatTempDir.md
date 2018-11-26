---
title: 验证码显示不出来,tomcat的temp文件夹丢失导致
date: 2018-11-22 13:55:05
type: post
tag:
  - tomcat
---
一位同事使用了google kaptcha用于图像验证码的生成，
在测试环境可以显示验证码，但是在试用环境不能显示验证码，且点多次点击后或出现Stack Overflow。
<!-- more -->
具体代码如下：
```
 /**
     * @param request
     * @param response
     * @return
     * @throws Exception
     * @Description 获取图片验证码
     * @author pm
     */
    @RequestMapping("/captcha-image")
    public ModelAndView captchaImage(HttpServletRequest request,
                                     HttpServletResponse response) throws Exception {
        response.setDateHeader("Expires", 0);
        response.setHeader("Cache-Control",
                "no-store, no-cache, must-revalidate");
        response.addHeader("Cache-Control", "post-check=0, pre-check=0");
        response.setHeader("Pragma", "no-cache");
        response.setContentType("image/jpeg");

        String capText = captchaProducer.createText();
        request.getSession().setAttribute(com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY,
                capText);
        BufferedImage bi = captchaProducer.createImage(capText);
        ServletOutputStream out = response.getOutputStream();
        ImageIO.write(bi, "jpg", out);
        try {
            out.flush();
        } finally {
            out.close();
        }
        return null;
    }
```
google之：
```
When you startup Tomcat, using startup.bat (Windows) or startup.sh, it calls catalina.bat/catalina.sh respectively.

Catalina then needs a temp directory to be set. It does this by setting the CATALINA_TMPDIR variable to TOMCAT_HOME\temp folder and assigns it to java system environment variable as java.io.tmpdir.

This is copied from catalina.bat:

rem   CATALINA_TMPDIR (Optional) Directory path location of temporary directory
rem                   the JVM should use (java.io.tmpdir).  Defaults to
rem                   %CATALINA_BASE%\temp.
Where CATALINA_BASE is TOMCAT_HOME (if run using the startup script).

We carry on:

if not "%CATALINA_TMPDIR%" == "" goto gotTmpdir
set "CATALINA_TMPDIR=%CATALINA_BASE%\temp"
Finally:

if not "%SECURITY_POLICY_FILE%" == "" goto doSecurity
%_EXECJAVA% %JAVA_OPTS% %CATALINA_OPTS% %DEBUG_OPTS% -Djava.endorsed.dirs="%JAVA_ENDORSED_DIRS%" -classpath "%CLASSPATH%" -Dcatalina.base="%CATALINA_BASE%" -Dcatalina.home="%CATALINA_HOME%" -Djava.io.tmpdir="%CATALINA_TMPDIR%" %MAINCLASS% %CMD_LINE_ARGS% %ACTION%
goto end
:doSecurity
%_EXECJAVA% %JAVA_OPTS% %CATALINA_OPTS% %DEBUG_OPTS% -Djava.endorsed.dirs="%JAVA_ENDORSED_DIRS%" -classpath "%CLASSPATH%" -Djava.security.manager -Djava.security.policy=="%SECURITY_POLICY_FILE%" -Dcatalina.base="%CATALINA_BASE%" -Dcatalina.home="%CATALINA_HOME%" -Djava.io.tmpdir="%CATALINA_TMPDIR%" %MAINCLASS% %CMD_LINE_ARGS% %ACTION%
goto end
Finally, the java.io.tmpdir is pointed to the CATALINA_TMPDIR where the JVM write temporary files including disk-based storage policies.
```
原来：jvm生成临时文件都会写到java.io.tmpdir文件夹下，且临时文件夹默认路径为```%CATALINA_BASE%\temp```，但是试用环境的tomcat下的temp文件夹莫名的不见了，
创建temp文件夹后，验证码可以显示了。
参考：
[https://stackoverflow.com/questions/7112591/what-is-the-tomcat-temp-directory-in-tomcat-7](https://stackoverflow.com/questions/7112591/what-is-the-tomcat-temp-directory-in-tomcat-7)
至于为什么会出现Stack Overflow则是因为框架发生异常时会往response写入错误信息，但是在获取验证码时靠response输出了图片文件流，
response处于提交状态，所以会继续异常，致使异常堆积，无法释放，造成Stack Overflow。
