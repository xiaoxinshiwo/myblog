---
title: CORS support in Spring Framework
date: 2018-05-21 15:08:11
tag:
  - 转载
  - cors
---

 ENGINEERING   SÉBASTIEN DELEUZE   JUNE 08, 2015
For security reasons, browsers prohibit AJAX calls to resources residing outside the current origin. For example, as you’re checking your bank account in one tab, you could have the evil.com website in another tab. The scripts from evil.com shouldn’t be able to make AJAX requests to your bank API (withdrawing money from your account!) using your credentials.

Cross-origin resource sharing (CORS) is a W3C specification implemented by most browsers that allows you to specify in a flexible way what kind of cross domain requests are authorized, instead of using some less secured and less powerful hacks like IFrame or JSONP.

Spring Framework 4.2 GA provides first class support for CORS out-of-the-box, giving you an easier and more powerful way to configure it than typical filter based solutions.

Spring MVC provides high-level configuration facilities, described bellow.

Controller method CORS configuration
You can add to your @RequestMapping annotated handler method a @CrossOrigin annotation in order to enable CORS on it (by default @CrossOrigin allows all origins and the HTTP methods specified in the @RequestMapping annotation):
```
@RestController
@RequestMapping("/account")
public class AccountController {

	@CrossOrigin
	@GetMapping("/{id}")
	public Account retrieve(@PathVariable Long id) {
		// ...
	}

	@DeleteMapping("/{id}")
	public void remove(@PathVariable Long id) {
		// ...
	}
}
```
It is also possible to enable CORS for the whole controller:
```
@CrossOrigin(origins = "http://domain2.com", maxAge = 3600)
@RestController
@RequestMapping("/account")
public class AccountController {

	@GetMapping("/{id}")
	public Account retrieve(@PathVariable Long id) {
		// ...
	}

	@DeleteMapping("/{id}")
	public void remove(@PathVariable Long id) {
		// ...
	}
}
```
In this example CORS support is enabled for both retrieve() and remove() handler methods, and you can also see how you can customize the CORS configuration using @CrossOrigin attributes.

You can even use both controller and method level CORS configurations, Spring will then combine both annotation attributes to create a merged CORS configuration.
```
@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/account")
public class AccountController {

	@CrossOrigin(origins = "http://domain2.com")
	@GetMapping("/{id}")
	public Account retrieve(@PathVariable Long id) {
		// ...
	}

	@DeleteMapping("/{id}")
	public void remove(@PathVariable Long id) {
		// ...
	}
}
```
If you are using Spring Security, make sure to enable CORS at Spring Security level as well to allow it to leverage the configuration defined at Spring MVC level.
```
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors().and()...
	}
}
```
Global CORS configuration
In addition to fine-grained, annotation-based configuration you’ll probably want to define some global CORS configuration as well. This is similar to using filters but can be declared withing Spring MVC and combined with fine-grained @CrossOrigin configuration. By default all origins and GET, HEAD and POST methods are allowed.

JavaConfig
Enabling CORS for the whole application is as simple as:
```
@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**");
	}
}
```
If you are using Spring Boot, it is recommended to just declare a WebMvcConfigurer bean as following:
```
@Configuration
public class MyConfiguration {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**");
            }
        };
    }
}
```
You can easily change any properties, as well as only apply this CORS configuration to a specific path pattern:
```
@Override
public void addCorsMappings(CorsRegistry registry) {
	registry.addMapping("/api/**")
		.allowedOrigins("http://domain2.com")
		.allowedMethods("PUT", "DELETE")
			.allowedHeaders("header1", "header2", "header3")
		.exposedHeaders("header1", "header2")
		.allowCredentials(false).maxAge(3600);
}
```
If you are using Spring Security, make sure to enable CORS at Spring Security level as well to allow it to leverage the configuration defined at Spring MVC level.

XML namespace
It is also possible to configure CORS with the mvc XML namespace.

This minimal XML configuration enable CORS on /** path pattern with the same default properties than the JavaConfig one:
```
<mvc:cors>
	<mvc:mapping path="/**" />
</mvc:cors>
```
It is also possible to declare several CORS mappings with customized properties:
```
<mvc:cors>

	<mvc:mapping path="/api/**"
		allowed-origins="http://domain1.com, http://domain2.com"
		allowed-methods="GET, PUT"
		allowed-headers="header1, header2, header3"
		exposed-headers="header1, header2" allow-credentials="false"
		max-age="123" />

	<mvc:mapping path="/resources/**"
		allowed-origins="http://domain1.com" />

</mvc:cors>
```
If you are using Spring Security, don’t forget to enable CORS at Spring Security level as well:
```
<http>
	<!-- Default to Spring MVC's CORS configuration -->
	<cors />
	...
</http>
```
How does it work?
> CORS requests (including preflight ones with an OPTIONS method) are automatically dispatched to the various HandlerMappings registered. They handle CORS preflight requests and intercept CORS simple and actual requests thanks to a CorsProcessor implementation (DefaultCorsProcessor by default) in order to add the relevant CORS response headers (like Access-Control-Allow-Origin). CorsConfiguration allows you to specify how the CORS requests should be processed: allowed origins, headers, methods, etc. It can be provided in various ways:

AbstractHandlerMapping#setCorsConfiguration() allows to specify a Map with several CorsConfiguration mapped on path patterns like /api/**
Subclasses can provide their own CorsConfiguration by overriding AbstractHandlerMapping#getCorsConfiguration(Object, HttpServletRequest) method
Handlers can implement CorsConfigurationSource interface (like ResourceHttpRequestHandler now does) in order to provide a CorsConfiguration for each request.
Filter based CORS support
As an alternative to other methods presented above, Spring Framework also provides a CorsFilter. In that case, instead of using @CrossOrigin or WebMvcConfigurer#addCorsMappings(CorsRegistry), you can for example declare the filter as following in your Spring Boot application:
```
@Configuration
public class MyConfiguration {

	@Bean
	public FilterRegistrationBean corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://domain1.com");
		config.addAllowedHeader("*");
		config.addAllowedMethod("*");
		source.registerCorsConfiguration("/**", config);
		FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
		bean.setOrder(0);
		return bean;
	}
}
```
转载于 [https://spring.io/blog/2015/06/08/cors-support-in-spring-framework](https://spring.io/blog/2015/06/08/cors-support-in-spring-framework)
