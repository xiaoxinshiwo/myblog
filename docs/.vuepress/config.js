module.exports = {
  title: '章永新的博客',
  base: "/zhangyongxin/",
  head: [
    ['link', { rel: 'icon', href: `/logo.ico` }]
  ],
  locales: {
    '/': {
      lang: 'zh-CN',
    }
  },
  markdown: {
    config: md => {
      md.use(require('markdown-it-anchor'))
    },
    toc: {
      includeLevel: [3,4] // 可以使用 [[toc]] 将本页的目录进行抽取
    }
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '关于', link: '/about/about' },
    ],
    sidebar: [
      {
        title: '博客',
        collapsable: true,
        children: [
          '/blog/howToBuildMyOwnSite/howToBuildMyOwnSite',
          '/blog/knowledgeStack',
          '/blog/bookList',
          '/blog/designPattern/javaDesignPattern',
          '/blog/docker',
          '/blog/jmx',
          '/blog/maven',
          '/blog/crossTGW',
          '/blog/shortMsgCannotReveive/prodShortMsgCannotReceive',
          '/blog/whatHappenedWhenNewString/whatHappenedWhenNewString',
          '/blog/validateParameterforYourService',
          '/blog/dubboMutiIp',
          '/blog/mysqlSelectForupdate',
          'blog/deadLockSolve',
          '/blog/javaPassByValue',
          '/blog/httpStatus',
          '/blog/springNotes1',
          '/blog/springNotes2',
          '/blog/springNotes3',
          '/blog/interestingThoughts/interestingThoughts'
        ]
      },
      {
        title: '转载',
        collapsable: true,
        children: [
          '/reprint/threadLocal',
          '/reprint/stanfordClassMemory',
          '/reprint/javaInterview/javaInterview1',
          '/reprint/javaInterview/javaInterview2',
          '/reprint/CORS support in Spring framework'
        ]
      }
    ]
  }
}
