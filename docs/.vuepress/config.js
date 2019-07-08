module.exports = {
  base: '/VuePress/',
  dest: './docs/.vuepress/dist',
  title: 'LIZI BLOG',
  description: 'Just playing around',
  // head: [
  //   ['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
  // ],
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    nav: [
      { text: 'Home', link: '/' },
      { text: '博文', link: '/guide/' },
      { text: 'Vue组件', link: '/components/' },
      { text: '项目总结', link: '/project/' },
      {
        text: '选择语言',
        items: [
          { text: '简体中文', link: '/language/chinese/' },
          { text: 'English', link: '/language/japanese/' }
        ]
      },
      { text: 'GitHub', link: 'https://github.com/lizitang' }
    ],
    sidebar: {
      '/guide/': [
        {
          title: '博文',
          collapsable: false,
          children: [
            ['', '介绍'],
            ['html', 'html&css'],
            ['javaScript', 'Javascript'],
            ['es6', 'ES6'],
            ['vue', 'Vue'],
            ['react', 'React'],
          ]
        }
      ],
      '/components/': [
        {
          title: '组件',
          collapsable: false,
          children: [
            ['', '介绍'],
            ['dialog-edit', '弹框表单组件'],
            ['region', '省市联动'],
            ['image-view', '图片列表'],
          ]
        }
      ],
    },
    serviceWorker: {
      updatePopup: true // Boolean | Object, 默认值是 undefined.
      // 如果设置为 true, 默认的文本配置将是: 
      // updatePopup: { 
      //    message: "New content is available.", 
      //    buttonText: "Refresh" 
      // }
    }
  }
}