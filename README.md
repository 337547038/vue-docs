# Vue Markdown 生成文档和演示案例
## 1.先通过vue-cli完成环境搭建

## 2.添加文档演示目录
- 目录结构调整和文件创建
```html
├─examples  // 复制 src 目录，改成 examples 用作示例展示
│  └─components
│      demo-block.vue
│  ├─docs //markdown帮助文档文件夹
│  └─router
│      index.js //路由配置文件
│  │  App.vue //主页文件
│  │  main.js //项目入口文件
│
├─src // 新增 src 用于编写存放组件
│  ├─assets 
│  ├─components  //组件文件夹
│  ├─router
│  │ App.vue
│  │ main.js
```
  - 找到`\build\webpack.base.conf.js`文件修改`webpack`的主文件入口
```JavaScript
entry: {
  app: './examples/main.js'
}
```

  - 修改`webpack`编译配置

```JavaScript
{
  test: /\.js$/,
  loader: 'babel-loader',
  include: [resolve('examples'), resolve('src')]
}
```

 - 启动项目`npm run dev`有错误就根据错误调整，直到可以正常访问不在报错
 
## 3.解析`markdown`文件
安装`vue-markdown-loader`直接执行命令
  > npm install vue-markdown-loader --save-dev
- 配置`webpack`加载器解析`markdown`，在`webpack.base.conf.js`在属性`rules`追加配置加载器

```JavaScript
module.exports = {
  module: {
    rules: [
      {
        test: /\.md$/,
        loader: 'vue-markdown-loader'
      }
    ]
  }
};
```
- 在`docs`文件下创建第一个`markdown`文件，`test.md`
```html
# test
> Hello World
```
```JavaScript
  routes: [{
    path: '/test',
    name: 'test',
    component: r => require.ensure([], () => r(require('../docs/test.md')))
  }]
```
- 浏览器访问`http://localhost:8080/#/test`,正确的将`markdown`解析为 vue 组件并正确初始化路由
## 4.解析代码块和示例生成
- 代码块示例

:::demo ### 描述标题

```html
<template>
    <p>test content</p>
</template>
<script>
    console.log(1)
</script>
```
:::
- 开发一个`demo-block`用于显示代码块的组件
```html
<template>
  <div class="demo-block">
    <div class="demo-block-source">
      <slot name="source"></slot>
      <span class="demo-block-code-icon"
        v-if="!$slots.default"
        @click="showCode=!showCode"><img alt="expand code"
          src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
          class="code-expand-icon-show"></span>
    </div>
    <div class="demo-block-meta"
      v-if="$slots.default">
      <slot></slot>
      <span v-if="$slots.default"
        class="demo-block-code-icon"
        @click="showCode=!showCode"><img alt="expand code"
          src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
          class="code-expand-icon-show"></span>
    </div>
    <div class="demo-block-code"
      v-show="showCode">
      <slot name="highlight"></slot>
    </div>
  </div>
</template>
<script type="text/babel">

export default {
  data() {
    return {
      showCode: false
    };
  }
};
</script>
<style>
.demo-block {
  border: 1px solid #ebedf0;
  border-radius: 2px;
  display: inline-block;
  width: 100%;
  position: relative;
  margin: 0 0 16px;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  border-radius: 2px;
}
.demo-block p {
  padding: 0;
  margin: 0;
}
.demo-block .demo-block-code-icon {
  position: absolute;
  right: 16px;
  bottom: 14px;
  cursor: pointer;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
}
.demo-block .demo-block-code-icon img {
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  max-width: 100%;
  width: 100%;
  vertical-align: baseline;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.demo-block .demo-block-source {
  border-bottom: 1px solid #ebedf0;
  padding: 20px 24px 20px;
  color: #444;
  position: relative;
  margin-bottom: -1px;
}
.demo-block .demo-block-meta {
  position: relative;
  padding: 12px 50px 12px 20px;
  border-radius: 0 0 2px 2px;
  -webkit-transition: background-color 0.4s;
  transition: background-color 0.4s;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-size: 14px;
  color: #444;
  font-size: 14px;
  line-height: 2;
  border-radius: 0;
  border-bottom: 1px dashed #ebedf0;
  margin-bottom: -1px;
}
.demo-block .demo-block-meta code {
  color: #444;
  background-color: #e6effb;
  margin: 0 4px;
  display: inline-block;
  padding: 3px 7px;
  border-radius: 3px;
  height: 18px;
  line-height: 18px;
  font-family: Menlo, Monaco, Consolas, Courier, monospace;
  font-size: 14px;
}
.demo-block .demo-block-code {
  background-color: #f7f7f7;
  font-size: 0;
}
.demo-block .demo-block-code code {
  background-color: #f7f7f7;
  font-family: Consolas, Menlo, Courier, monospace;
  border: none;
  display: block;
  font-size: 14px;
  padding: 16px 32px;
}
.demo-block .demo-block-code pre {
  margin: 0;
  padding: 0;
}
.sh-checkbox {
  color: #444;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
}
</style>
```
- `vue-markdown-loader`依赖了`highlight`在`App.vue`的样式中引用进行代码着色，风格参照`highlight.js`自己引用
```css
@import 'highlight.js/styles/color-brewer.css';
```
- 在`main.js`配置全局安装组件，让每个`md`文件都可以自动编译成 vue 组件并且渲染代码块
```javascript
import DemoBlock from './components/demo-block.vue'
Vue.component('demo-block', DemoBlock)
```
- `webpack.base.conf.js`配置`vue-markdown-loader`的`options`属性
  - 将`demo`代码块解析，在 markdown 用`demo-block`组件包裹
  - 安装`npm install markdown-it-container --save-dev`
  - 对 options 进行配置完成效果渲染
```javascript
const markdownRender = require('markdown-it')();

{
  test: /\.md$/,
  loader: 'vue-markdown-loader',
  options: {
    preventExtract: true,
    use: [
      [require('markdown-it-container'), 'demo', {

        validate: function (params) {
          return params.trim().match(/^demo\s+(.*)$/);
        },

        render: function (tokens, idx) {
          if (tokens[idx].nesting === 1) {
            // 1.获取第一行的内容使用markdown渲染html作为组件的描述
            let demoInfo = tokens[idx].info.trim().match(/^demo\s+(.*)$/);
            let description = (demoInfo && demoInfo.length > 1) ? demoInfo[1] : '';
            let descriptionHTML = description ? markdownRender.render(description) : '';
            // 2.获取代码块内的html和js代码
            let content = tokens[idx + 1].content;
            // 3.使用自定义开发组件【DemoBlock】来包裹内容并且渲染成案例和代码示例
            return `<demo-block>
            <div class="source" slot="source">${content}</div>
            ${descriptionHTML}
            <div class="highlight" slot="highlight">`;
          } else {
            return '</div></demo-block>\n';
          }
        }
      }]
    ]

  }
}
```
- 重新运行`npm run dev`得到预期的效果

## 5.最终示例优化为
- package.json添加scripts examples,运行示例`npm run examples`
- 添加路由配置`router.con.js`文件。主要是方便添加新组件页面时不用去添加侧栏导航
