module.exports = {
  theme: 'yubisaki',
  title: '博客',
  description: `zhangyongxin's blog`,
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }]
  ],
  base: '/zhangyongxin/',
  repo: 'https://github.com/xiaoxinshiwo/myblog',
  dest: './docs/.vuepress/dist',
  ga: '',
  serviceWorker: true,
  evergreen: true,
  themeConfig: {
    background: `https://s1.ax1x.com/2018/11/07/i7AOmV.jpg`,
    github: 'xiaoxinshiwo',
    logo: '/img/logo.jpg',
    accentColor: '#0a2d34',
    per_page: 6,
    lastUpdated: 'Last Updated', // string | boolean
    date_format: 'yyyy-MM-dd HH:mm:ss',
    nav: [
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
}
