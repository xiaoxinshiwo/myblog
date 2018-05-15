(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{67:function(a,e,r){"use strict";r.r(e);var t=r(0),c=Object(t.a)({},function(){var a=this,e=a.$createElement,r=a._self._c||e;return r("div",{staticClass:"content"},[a._m(0),r("authorAndTime",{attrs:{dateTime:"2018-04-27 15:45:06"}}),r("p",[a._v("简述\nThreadLocal是什么呢？其实ThreadLocal并非是一个线程的本地实现版本，它并不是一个Thread，而是threadlocalvariable(线程局部变量)。也许把它命名为ThreadLocalVar更加合适。线程局部变量(ThreadLocal)其实的功用非常简单，就是为每一个使用该变量的线程都提供一个变量值的副本，是Java中一种较为特殊的线程绑定机制，是每一个线程都可以独立地改变自己的副本，而不会和其它线程的副本冲突。")]),r("p",[a._v("从线程的角度看，每个线程都保持一个对其线程局部变量副本的隐式引用，只要线程是活动的并且 ThreadLocal 实例是可访问的；在线程消失之后，其线程局部实例的所有副本都会被垃圾回收（除非存在对这些副本的其他引用）。")]),r("p",[a._v("通过ThreadLocal存取的数据，总是与当前线程相关，也就是说，JVM 为每个运行的线程，绑定了私有的本地实例存取空间，从而为多线程环境常出现的并发访问问题提供了一种隔离机制。")]),r("p",[a._v("ThreadLocal是如何做到为每一个线程维护变量的副本的呢？其实实现的思路很简单，在ThreadLocal类中有一个Map，用于存储每一个线程的变量的副本。")]),r("p",[a._v("概括起来说，对于多线程资源共享的问题，同步机制采用了“以时间换空间”的方式，而ThreadLocal采用了“以空间换时间”的方式。前者仅提供一份变量，让不同的线程排队访问，而后者为每一个线程都提供了一份变量，因此可以同时访问而互不影响。\nThreadLocal和Synchonized对比\nThreadLocal使用场合主要解决多线程中数据数据因并发产生不一致问题。ThreadLocal为每个线程的中并发访问的数据提供一个副本，通过访问副本来运行业务，这样的结果是耗费了内存，单大大减少了线程同步所带来性能消耗，也减少了线程并发控制的复杂度。")]),r("p",[a._v("ThreadLocal不能使用原子类型，只能使用Object类型。ThreadLocal的使用比synchronized要简单得多。")]),r("p",[a._v("ThreadLocal和Synchonized都用于解决多线程并发访问。但是ThreadLocal与synchronized有本质的区别。synchronized是利用锁的机制，使变量或代码块在某一时该只能被一个线程访问。而ThreadLocal为每一个线程都提供了变量的副本，使得每个线程在某一时间访问到的并不是同一个对象，这样就隔离了多个线程对数据的数据共享。而Synchronized却正好相反，它用于在多个线程间通信时能够获得数据共享。")]),r("p",[a._v("Synchronized用于线程间的数据共享，而ThreadLocal则用于线程间的数据隔离。")]),r("p",[a._v("当然ThreadLocal并不能替代synchronized,它们处理不同的问题域。Synchronized用于实现同步机制，比ThreadLocal更加复杂。")]),a._m(1)],1)},[function(){var a=this.$createElement,e=this._self._c||a;return e("h1",{attrs:{id:"java-lang-threadlocal-分析"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#java-lang-threadlocal-分析","aria-hidden":"true"}},[this._v("#")]),this._v(" java.lang.ThreadLocal 分析")])},function(){var a=this.$createElement,e=this._self._c||a;return e("p",[this._v("本文转载于：  "),e("a",{attrs:{href:"http://blog.51cto.com/lavasoft/51926",target:"_blank",rel:"noopener noreferrer"}},[this._v("http://blog.51cto.com/lavasoft/51926")])])}],!1,null,null,null);e.default=c.exports}}]);