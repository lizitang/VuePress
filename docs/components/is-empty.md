## 空组件

关于render函数相关的知识，请参考vue文档[render-function](https://cn.vuejs.org/v2/guide/render-function.html),
[Babel 插件](https://github.com/vuejs/babel-plugin-transform-vue-jsx)[Babel Preset JSX](https://github.com/vuejs/jsx)
```vue
<script>
  export default {
    name: 'isEmpty',
    functinal: true, // 函数化组件
    props: {
      text: {type: String, default: '暂无数据'},
    },
    render(h, ctx) {
      return h('div', {
        class: ['is-empty']
      }, ctx.props.text)
    }
  }
</script>

<style scoped>
// 样式按视觉稿调整
</style>
```