# 在项目中通过切面统一进行参数校验
<authorAndTime dateTime='2018-05-17 18:51:15'/>

> 一直以来项目中的参数校验零零散散，散布在controller或者service的方法的开始部分。统一处理可以使代码优雅高效。<br/>
另外参数校验在controller做还是service做呢？个人觉得service层才最合理，因为service可以复用。

下面我们来看看怎么在service层加入切面，在切面上如何进行参数校验吧。<br/>
引入依赖:
```
<dependency>
  <groupId>org.hibernate.validator</groupId>
  <artifactId>hibernate-validator</artifactId>
  <version>6.0.10.Final</version>
</dependency>
<dependency>
  <groupId>org.glassfish</groupId>
  <artifactId>javax.el</artifactId>
  <version>3.0.1-b09</version>
</dependency
```
编写model编写需要参数校验的bean:
```
package com.xiaoxin.validator.model;

import com.xiaoxin.validator.annotation.Gender;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.*;
import java.util.Date;

/**
 * @Auther zhangyongxin
 * @date 2018/5/17 上午10:14
 */
@Getter
@Setter
@ToString
public class Student {
    @NotNull(message = "姓名不能为空")
    private String name;
    //自定义注解限制为 枚举类型 0、1
    @Gender
    private int gender;
    @Length(min=19,max=19,message = "身份证号只能为19位")
    private String identityId;
    @Pattern(regexp="^(1)\\d{10}$", message="请输入正确的手机号")
    private String phoneNumber;
    @Email(message = "请输入正确的email地址")
    private String email;
    @Past(message = "生日不能大于当前时间")
    @DateTimeFormat(pattern = "yyyMMdd")
    private Date birthDay;
    @Max(value = 130,message = "年龄不能超过130岁")
    private int age;
}
```
@Gender为自定义限制注解，代码如下：
```
package com.xiaoxin.validator.annotation;

import com.xiaoxin.validator.GenderValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

/**
 * 自定义注解，性别只能为0、1
 * @Auther zhangyongxin
 * @date 2018/5/17 上午10:57
 */
@Target( { ElementType.ANNOTATION_TYPE, ElementType.METHOD, ElementType.FIELD })
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {GenderValidator.class})
public @interface Gender {

    String message() default "性别只能为0：女 1：男";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

}

```
编写@Gender注解validator实现校验任务
```
package com.xiaoxin.validator;

import com.xiaoxin.validator.annotation.Gender;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;

/**
 * 自定义注解相关的validator；性别只能为 0、1
 * @Auther zhangyongxin
 * @date 2018/5/17 上午10:59
 */
public class GenderValidator implements ConstraintValidator<Gender, Integer> {
    private final Integer[] ALL_GENDERS = {0,1};

    @Override
    public boolean isValid(Integer integer, ConstraintValidatorContext constraintValidatorContext) {

        if (Arrays.asList(ALL_GENDERS).contains(integer)) {
            return true;
        }
        return false;
    }
}

```
编写自定义注解@NeedValidate用于统一切面处理
```
package com.xiaoxin.validator.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @Auther zhangyongxin
 * @date 2018/5/18 上午9:30
 */
@Target( {ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface NeedValidate {
}

```
编写service，在需要参数校验的方法参数中增加校验注解，方法的参数如果为基本数据类型需要转换为包装类型。
```
package com.xiaoxin.validator.service;

import com.xiaoxin.validator.model.Student;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;

/**
 * @Auther zhangyongxin
 * @date 2018/5/17 上午11:04
 */
public interface StudentService {

    Student addOneStudent(Student student,@Length(min=19,max=19)String identityId);

    Student findOneStudent(String identityId);

    void deleteOneStudent(@Length(min=19,max=19)String identityId);

    void updateOneStudentAge(@Length(min=19,max=19)String identityId,
                          @Max(value = 130,message = "年龄不能超过130岁") Integer age);

}
```
编写Service实现类 在需要切面校验的方法上添加@NeedValidate注解
```
package com.xiaoxin.validator.service;

import com.xiaoxin.validator.annotation.NeedValidate;
import com.xiaoxin.validator.model.Student;
import com.xiaoxin.validator.service.StudentService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.constraints.Length;
import org.springframework.stereotype.Service;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotEmpty;
import java.util.Date;

/**
 * @Auther zhangyongxin
 * @date 2018/5/17 上午11:05
 */
@Slf4j
@Service
public class StudentServiceImpl implements StudentService {
    @Override
    public Student addOneStudent(Student student,String identityId) {
        log.info("add one student:"+student);
        return student;
    }

    @Override
    public Student findOneStudent(String identityId) {
        Student student = new Student();
        student.setBirthDay(new Date());
        student.setEmail("123@163.com");
        student.setGender(0);
        student.setPhoneNumber("13987654320");
        student.setName("韩梅");
        student.setIdentityId(identityId);
        return student;
    }

    @Override
    public void deleteOneStudent(String identityId) {
        log.info("deleted one student:{}",identityId);
    }

    @Override
    @NeedValidate
    public void updateOneStudentAge(String identityId,Integer age) {
        log.info("updateOneStudentAge:{},age:{}",identityId,age);
    }
}

```
编写切面统一处理校验逻辑
```
package com.xiaoxin.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.hibernate.validator.HibernateValidator;
import org.springframework.stereotype.Component;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import javax.validation.executable.ExecutableValidator;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

/**
 * 参数的校验分为 bean的校验和其他类型参数校验，需要分开对应。
 * 基本数据类型必须写成包装类型。
 * 方法上的validate如@Max等写在service interface的方法参数上，
 *
 * @NeedValidate 注解写在实现类上
 * @Auther zhangyongxin
 * @date 2018/5/17 上午10:11
 */
@Aspect
@Component
@Slf4j
public class ParameterValidationAspect {

    //标注了@NeedValidate注解的
    @Around("@annotation(com.xiaoxin.validator.annotation.NeedValidate)")
    public Object validateParameters(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        log.info("ParameterValidationAspect before " + className + "." + methodName);
        if (null != args && args.length > 0) {
            ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class).configure().buildValidatorFactory();
            ExecutableValidator validator = validatorFactory.getValidator().forExecutables();
            Validator beanValidator = validatorFactory.getValidator();
            Set<ConstraintViolation<Object>> violations = new HashSet<>();
            Class clazz = joinPoint.getSignature().getDeclaringType();
            Class[] classTypes = new Class[args.length];
            // 因为此处获取不带基本类型的数据类型，只能获取对应的包装类型，所以在service层需要写基本类型对应的包装类型的参数
            for (int i = 0; i < args.length; i++) {
                classTypes[i] = args[i].getClass();
            }
            Method method = clazz.getMethod(methodName, classTypes);
            // 非java bean的参数校验
            violations.addAll(validator.validateParameters(clazz.newInstance(), method, args));
            // java Bean的参数校验
            for (Object object : args) {
                violations.addAll(beanValidator.validate(object));
            }
            dealWithValidations(violations);
        }
        return joinPoint.proceed();

    }

    private void dealWithValidations(Set<ConstraintViolation<Object>> violations) {
        if (violations.size() > 0) {
            StringBuffer buf = new StringBuffer();
            for (ConstraintViolation<Object> violation : violations) {
                buf.append("-" + violation.getPropertyPath().toString());
                buf.append(violation.getMessage() + "<br/>\n");
            }
            throw new IllegalArgumentException(buf.toString());
        }
    }
}

```
编写controller进行测试
```
package com.xiaoxin.validator.controller;

import com.xiaoxin.validator.model.Result;
import com.xiaoxin.validator.model.ResultGenerator;
import com.xiaoxin.validator.model.Student;
import com.xiaoxin.validator.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.Date;

/**
 * @Auther zhangyongxin
 * @date 2018/5/17 上午11:51
 */
@RestController
@RequestMapping("student")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @PostMapping("/addOne")
    public Result addOneStudent(){
        Student student = new Student();
        student.setBirthDay(new Date());
        student.setEmail("123163.com");
        student.setGender(0);
        student.setPhoneNumber("13987654320");
        student.setName("韩梅");
        student.setIdentityId("3412041900000000000");
        student = studentService.addOneStudent(student,"");
        return new Result(student);
    }

    @PostMapping("/addOneStudent")
    public Result addOneStudent(@RequestBody @Valid Student student, BindingResult bindingResult){

        /**
         * 参数校验
         */
        if(bindingResult.hasErrors()){
            return ResultGenerator.genValidationResult(bindingResult);
        }
        return new Result(studentService.addOneStudent(student,"3412041900000000000"));
    }

    @GetMapping("/findOne")
    public Result findOneStudent(@NotEmpty String identityId){
        Student student =  studentService.findOneStudent(identityId);
        return new Result(student);
    }

    @PostMapping("/deleteOne")
    public Result deleteOneStudent(@RequestBody String identityId){
        studentService.deleteOneStudent(identityId);
        return ResultGenerator.genSuccessResult();
    }

    @PostMapping("/updateAge")
    public Result updateStudentAge(@RequestParam String identityId,@RequestParam int age){
        studentService.updateOneStudentAge(identityId,age);
        return ResultGenerator.genSuccessResult();
    }
}
```
调用测试接口http://127.0.0.1:7788/student/addOne返回结果如下：
```
{
"timestamp": "2018-05-17T11:13:42.651+0000",
"status": 500,
"error": "Internal Server Error",
"message": "-email请输入正确的email地址<br/>\n-addOneStudent.arg1长度需要在19和19之间<br/>\n",
"path": "/student/addOne"
}
```
最后Bean嵌套集合或者Bean的注解写法：
```
package org.hibernate.validator.referenceguide.chapter02.objectgraph.containerelement;

public class Car {

    private List<@NotNull @Valid Person> passengers = new ArrayList<Person>();

    private Map<@Valid Part, List<@Valid Manufacturer>> partManufacturers = new HashMap<>();

    //...
}
package org.hibernate.validator.referenceguide.chapter02.objectgraph.containerelement;

public class Part {

    @NotNull
    private String name;

    //...
}
package org.hibernate.validator.referenceguide.chapter02.objectgraph.containerelement;

public class Manufacturer {

    @NotNull
    private String name;

    //...
}
```
参考： [http://hibernate.org/validator/](http://hibernate.org/validator/)





