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
      '/about/about',
      {
        title: '博客',
        collapsable: false,
        children: [
          '/blog/javaDesignPattern',
          '/blog/howToBuildMyOwnSite/howToBuildMyOwnSite',
        ]
      }
    ]
  }
}
