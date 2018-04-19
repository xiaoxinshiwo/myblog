(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{48:function(e,t,s){e.exports=s.p+"assets/img/gitHubPages.dfc2e9da.png"},49:function(e,t,s){e.exports=s.p+"assets/img/codeDirs.290c1c6e.png"},52:function(e,t,s){"use strict";s.r(t);var a=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content"},[a("h1",{attrs:{id:"如何建设自己的个人网站"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#如何建设自己的个人网站","aria-hidden":"true"}},[e._v("#")]),e._v(" 如何建设自己的个人网站")]),a("h2",{attrs:{id:"前言"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#前言","aria-hidden":"true"}},[e._v("#")]),e._v(" 前言")]),a("p",[e._v("如果您希望创建一个类似本站的静态个人网站，请留下您的脚步，"),a("br"),e._v("\n希望看完本文您能够搭建自己的个人网站")]),a("h2",{attrs:{id:"使用技术"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#使用技术","aria-hidden":"true"}},[e._v("#")]),e._v(" 使用技术")]),a("p",[e._v("VuePress 官方网站："),a("a",{attrs:{href:""}},[e._v("https://vuepress.vuejs.org/zh/guide/")])]),a("h2",{attrs:{id:"环境"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#环境","aria-hidden":"true"}},[e._v("#")]),e._v(" 环境")]),a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Macbook pro 、IntelliJ Idea\n")])]),a("h2",{attrs:{id:"步骤"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#步骤","aria-hidden":"true"}},[e._v("#")]),e._v(" 步骤")]),a("p",[e._v("安装yarn")]),a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("brew install yarn --without-node\n")])]),a("p",[e._v("新建工程文件夹并且初始化")]),a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("mkdir my_project\n\ncd my_project\n\nnpm init -y\n")])]),a("p",[e._v("初始化vuepress工程")]),a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('# 将 VuePress 作为一个本地依赖安装\nyarn add -D vuepress # 或者：npm install -D vuepress\n\n# 新建一个 docs 文件夹\nmkdir docs\n\n# 新建一个 markdown 文件\necho "# Hello VuePress!" > docs/README.md\n\n# 开始写作\nnpx vuepress dev docs\n')])]),a("p",[e._v("接着，在 package.json 里加一些脚本:")]),a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('{\n  "scripts": {\n    "docs:dev": "vuepress dev docs",\n    "docs:build": "vuepress build docs"\n  }\n}\n')])]),a("p",[e._v("项目配置")]),a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("// cd進入.vuepress資料夾\n// 建立一個config.js設定檔\nmodule.exports = {\n  title: '章永新的博客',\n  base: \"/zhangyongxin/\",\n  head: [\n    ['link', { rel: 'icon', href: `/logo.ico` }]\n  ],\n  locales: {\n    '/': {\n      lang: 'zh-CN',\n    }\n  },\n  markdown: {\n    config: md => {\n      md.use(require('markdown-it-anchor'))\n    },\n    toc: {\n      includeLevel: [3,4] // 可以使用 [[toc]] 将本页的目录进行抽取\n    }\n  },\n  themeConfig: {\n    nav: [\n      { text: 'Home', link: '/' },\n      { text: '关于', link: '/about/about' },\n    ],\n    sidebar: [\n      '/about/about',\n      {\n        title: '博客',\n        collapsable: false,\n        children: [\n          '/blog/javaDesignPattern',\n          '/blog/howToBuildMyOwnSite',\n        ]\n      }\n    ]\n  }\n}\n")])]),a("p",[e._v("代码结构如下")]),a("img",{attrs:{src:s(49),alt:"代码目录"}}),a("h2",{attrs:{id:"发布至github"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#发布至github","aria-hidden":"true"}},[e._v("#")]),e._v(" 发布至GitHub")]),a("ol",[a("li",[a("p",[e._v("将 .vuepress/config.js 的 base 设置成你仓库的名字，举个例子，如果你的仓库是 https://github.com/foo/bar, 部署的页面将会通过 https://foo.github.io/bar 来访问，此时，你应该将 base 设置为 “/bar/”。")])]),a("li",[a("p",[e._v("在你的项目中运行:")])])]),a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("yarn docs:build\n在GitHub上创建名为bar的repository\n将这个repository clone到本地\n将dist下生成的所有文件放到bar文件夹下，push到GitHub上，\n点击settings按照下图进行设置，等待十几秒即可访问自己的主页了\n")])]),a("img",{staticStyle:{height:"50%",width:"60%"},attrs:{src:s(48),alt:"GitHub设置"}}),a("h2",{attrs:{id:"注意事项"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注意事项","aria-hidden":"true"}},[e._v("#")]),e._v(" 注意事项")]),a("ol",[a("li",[e._v("README.md 文件会被编译为index.html")]),a("li",[e._v("yarn docs:build 默认会在.vuepress文件加下生成dist文件")]),a("li",[e._v("更多设置请参考： "),a("a",{attrs:{href:""}},[e._v("https://vuepress.vuejs.org/zh/guide/")])])])])}],n=s(0),r=Object(n.a)({},function(){this.$createElement;this._self._c;return this._m(0)},a,!1,null,null,null);t.default=r.exports}}]);