module.exports = {
  theme: 'yubisaki',
  title: '博客',
  description: `zhangyongxin's blog`,
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }]
  ],
  base: '/zhangyongxin/',
  dest: './docs/.vuepress/dist',
  ga: 'UA-129050457-1',
  serviceWorker: true,
  port:8090,
  evergreen: true,
  themeConfig: {
    background: `https://s1.ax1x.com/2018/11/08/i7Y6L8.jpg`,
    github: 'xiaoxinshiwo',
    logo: 'https://ww1.sinaimg.cn/large/007iUjdily1fxzd5bx3z0j303k03kmx0.jpg',
    footer:'十步杀一人，千里不留行',
    accentColor: '#ac0b39',
    per_page: 6,
    lastUpdated: 'Last Updated', // string | boolean
    date_format: 'yyyy-MM-dd HH:mm:ss',
    tags: true,
    // gitalk 的配置项, 不支持 flipMoveOptions
    comment: {
      clientID: 'dcb2c98bdb97b6f5e37f',
      clientSecret: 'a58fc9ff4e53f1e26539fb621d65402d501027c4',
      repo: 'myblog',
      owner: 'xiaoxinshiwo',
      admin: ['xiaoxinshiwo'],
      perPage: 5,
      // id: this.$site,      // Ensure uniqueness and length less than 50
      distractionFreeMode: false  // Facebook-like distraction free mode
    },
    nav: [
      {text: '首页', link: '/', root: true},
      {text: '分类', link: '/tags/', tags: true},
      {text: '工具', link: '/tools/toolCollections'},
      {text: 'About', link: '/about/about'},
      {text: 'Github', link: 'https://github.com/xiaoxinshiwo'}
    ]
  },
  markdown: {
    anchor: {
      permalink: true
    },
    toc: {
      includeLevel: [1, 2]
    },
    config: md => {
      // 使用更多 markdown-it 插件！
      md.use(require('markdown-it-task-lists'))
        .use(require('markdown-it-imsize'), { autofill: true })
    }
  },
  postcss: {
    plugins: [require('autoprefixer')]
  },
  plugins: ['@vuepress/last-updated','@vuepress/google-analytics']
}
