---
title: spring4.3读书笔记3
date: 2018-05-16 11:21:36
type: post
tag:
  - 读书笔记
  - spring
---
41. Configuring a ConversionService
A ConversionService is a stateless object designed to be instantiated at application startup, then shared between multiple threads. In a Spring application, you typically configure a ConversionService instance per Spring container (or ApplicationContext). That ConversionService will be picked up by Spring and then used whenever a type conversion needs to be performed by the framework. You may also inject this ConversionService into any of your beans and invoke it directly.
If no ConversionService is registered with Spring, the original PropertyEditor-based system is used.
To register a default ConversionService with Spring, add the following bean definition with id conversionService:
```
<bean id="conversionService"
    class="org.springframework.context.support.ConversionServiceFactoryBean"/>
```
<!-- more -->
A default ConversionService can convert between strings, numbers, enums, collections, maps, and other common types. To supplement or override the default converters with your own custom converter(s), set the converters property. Property values may implement either of the Converter, ConverterFactory, or GenericConverter interfaces.
```
<bean id="conversionService"
        class="org.springframework.context.support.ConversionServiceFactoryBean">
    <property name="converters">
        <set>
            <bean class="example.MyCustomConverter"/>
        </set>
    </property>
</bean>
```
42. @DateTimeFormat to format a java.util.Date as a ISO Date (yyyy-MM-dd):
```
public class MyModel {

    @DateTimeFormat(iso=ISO.DATE)
    private Date date;

}
```
43. Configuring a global date & time format
By default, date and time fields that are not annotated with @DateTimeFormat are converted from strings using the DateFormat.SHORT style. If you prefer, you can change this by defining your own global format.
You will need to ensure that Spring does not register default formatters, and instead you should register all formatters manually. Use the org.springframework.format.datetime.joda.JodaTimeFormatterRegistrar or org.springframework.format.datetime.DateFormatterRegistrar class depending on whether you use the Joda-Time library.
For example, the following Java configuration will register a global ' `yyyyMMdd’ format. This example does not depend on the Joda-Time library:
```
@Configuration
public class AppConfig {

    @Bean
    public FormattingConversionService conversionService() {

        // Use the DefaultFormattingConversionService but do not register defaults
        DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService(false);

        // Ensure @NumberFormat is still supported
        conversionService.addFormatterForFieldAnnotation(new NumberFormatAnnotationFormatterFactory());

        // Register date conversion with a specific global format
        DateFormatterRegistrar registrar = new DateFormatterRegistrar();
        registrar.setFormatter(new DateFormatter("yyyyMMdd"));
        registrar.registerFormatters(conversionService);

        return conversionService;
    }
}
```
44. SpEL #{}
> Greater/less-than comparisons against null follow a simple rule: null is treated as nothing here (i.e. NOT as zero). As a consequence, any other value is always greater than null (X > null is always true) and no other value is ever less than nothing (X < null is always false).
If you prefer numeric comparisons instead, please avoid number-based null comparisons in favor of comparisons against zero (e.g. X > 0 or X < 0).
45. AOP
Types of advice:
- Before advice: Advice that executes before a join point, but which does not have the ability to prevent execution flow proceeding to the join point (unless it throws an exception).
- After returning advice: Advice to be executed after a join point completes normally: for example, if a method returns without throwing an exception.
- After throwing advice: Advice to be executed if a method exits by throwing an exception.
- After (finally) advice: Advice to be executed regardless of the means by which a join point exits (normal or exceptional return).
- Around advice: Advice that surrounds a join point such as a method invocation. This is the most powerful kind of advice. Around advice can perform custom behavior before and after the method invocation. It is also responsible for choosing whether to proceed to the join point or to shortcut the advised method execution by returning its own return value or throwing an exception.
Around advice is the most general kind of advice.
> If the target object to be proxied implements at least one interface then a JDK dynamic proxy will be used. All of the interfaces implemented by the target type will be proxied. If the target object does not implement any interfaces then a CGLIB proxy will be created.
46. @Aspect
> Aspects (classes annotated with @Aspect) may have methods and fields just like any other class. They may also contain pointcut, advice, and introduction (inter-type) declarations.
You may register aspect classes as regular beans in your Spring XML configuration, or autodetect them through classpath scanning - just like any other Spring-managed bean. However, note that the @Aspect annotation is not sufficient for autodetection in the classpath: For that purpose, you need to add a separate @Component annotation (or alternatively a custom stereotype annotation that qualifies, as per the rules of Spring’s component scanner).
47.Declaring a pointcut
@Pointcut annotation (the method serving as the pointcut signature must have a void return type).
```
@Pointcut("execution(* transfer(..))")// the pointcut expression
private void anyOldTransfer() {}// the pointcut signature
```
Other pointcut types
The full AspectJ pointcut language supports additional pointcut designators that are not supported in Spring.
These are:``` call, get, set, preinitialization, staticinitialization, initialization, handler, adviceexecution, withincode, cflow, cflowbelow, if, @this, and @withincode.``` Use of these pointcut designators in pointcut expressions interpreted by Spring AOP will result in an IllegalArgumentException being thrown.
> ```Around advice is declared using the @Around annotation. The first parameter of the advice method must be of type ProceedingJoinPoint. Within the body of the advice, calling proceed() on the ProceedingJoinPoint causes the underlying method to execute. The proceed method may also be called passing in an Object[] - the values in the array will be used as the arguments to the method execution when it proceeds.```
47. CGLIB
CGLIB proxying works by generating a subclass of the target class at runtime. Spring configures this generated subclass to delegate method calls to the original target: the subclass is used to implement the Decorator pattern, weaving in the advice.
CGLIB proxying should generally be transparent to users. However, there are some issues to consider:
> Final methods can’t be advised, as they can’t be overridden.
48. 数据库事物管理 PlatformTransactionManager
>JtaTransactionManager 分布式事物管理
This transaction manager is appropriate for handling distributed transactions,
  i.e. transactions that span multiple resources, and for controlling transactions on
  application server resources (e.g. JDBC DataSources available in JNDI) in general.
  For a single JDBC DataSource, DataSourceTransactionManager is perfectly sufficient,
  and for accessing a single resource with Hibernate (including transactional cache),
  HibernateTransactionManager is appropriate, for example.


