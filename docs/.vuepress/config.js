module.exports = {
  title: '章永新的博客',
  base: "/zhangyongxin/",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '关于', link: '/about/about' },
      { text: 'VuePress', link: 'https://vuepress.vuejs.org/' },
    ],
    sidebar: [
      '/about/about',
      {
        title: '博客',
        collapsable: false,
        children: [
          '/blog/javaDesignPattern'
        ]
      }
    ]
  }
}
