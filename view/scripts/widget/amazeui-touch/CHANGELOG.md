## Change Log

### v1.0.0-rc.2 (2016/07/05 14:57 +08:00)

- `[+]` [1f3ae5a](https://github.com/amazeui/amazeui-touch/commit/1f3ae5a6d1a0f853ebac9849371bdf0ea20b801b) 处理 React 15.2.0 `unknown-prop` 警告信息
- `[+]` [a83a7b3](https://github.com/amazeui/amazeui-touch/commit/a83a7b3f891306ac7522882bb43a7fd9291839cc) 添加服务器端渲染示例
- `[+]` [58c9b5d](https://github.com/amazeui/amazeui-touch/commit/58c9b5dbbc9e7f1df2c18b4fb5a9e5522656f520) #72 完善后端渲染支持
- `[√]` [2c823c8](https://github.com/amazeui/amazeui-touch/commit/2c823c8ed33851c8fbd650eb85fdd2c8d3e38657) 修复遗漏 `import` Modal 样式问题
- `[*]` [32c371e](https://github.com/amazeui/amazeui-touch/commit/32c371e0f5e222eaf8192ce58ad013d91074ee97) 允许用户引用 `amazeui.touch.scss` 时覆盖 `$ratchicons-path` 变量，以处理 Webpack 打包时[路径错误问题](https://github.com/jtangelder/sass-loader#problems-with-url)


### v1.0.0-rc.1 (2016/07/01)

- `[*]` [6af1392](https://github.com/amazeui/amazeui-touch/commit/6af1392fc54c3b439c13520ad4977eab8bf968d6) 调整 TabBar & NavBar 边框风格
- `[√]` [4467120](https://github.com/amazeui/amazeui-touch/commit/4467120066894b441f9cfb7b926fa4861836ba24) #73 修复网格边框在 Android 浏览器中不显示或显示不完整问题
- `[*]` [648fd17](https://github.com/amazeui/amazeui-touch/commit/648fd17099a794cc62d0fc6be0029673a286fb9c) #69 添加 CSS 依赖到组件文件中，以支持 CSS 按需打包
- `[√]` [0346c36](https://github.com/amazeui/amazeui-touch/commit/0346c36bb39eedd8b69616fc49869bfcd6fc938c) #71 修复 `<Card.Child>` `className` 应用错误问题
- `[+]` [4fbe23b](https://github.com/amazeui/amazeui-touch/commit/4fbe23be24eaf05b91e05b55fea3628117c7ff53) #70 Field 组件添加 `containerClassName` 属性，用于输入框包含标签或者前后内容时，给容器传递 className

### v1.0.0-beta.4 (2016/06/21)

- `Changed` [aa2455d](https://github.com/amazeui/amazeui-touch/commit/aa2455dbf604c44d5e265f9a777b067286d07bd5) 升级 normalize.css 至 v4.1.1
- `New` [6057ffc](https://github.com/amazeui/amazeui-touch/commit/6057ffc9865ea73479a42707031b72ee7793f17e) 暴露旧版 Flexbox 回退 API
- `New` [fd536bc](https://github.com/amazeui/amazeui-touch/commit/fd536bca68582cc0106a74d181639a5fe3885d78) Grid 添加边框样式（用于宫格制作等）
- `New` [0ed43e7](https://github.com/amazeui/amazeui-touch/commit/0ed43e71a052c3eb4804a0d6616c10c74cec9a2e) 调整图标变量，方便用户使用自定义图标
- `Fixed` [37eacd0](https://github.com/amazeui/amazeui-touch/commit/37eacd077360f169b052ceac8252ed9b486927bc) #62 修复 Tabs `activeKey` 控制问题
- `Fixed` [d85beb8](https://github.com/amazeui/amazeui-touch/commit/d85beb8c7a3086841f4295b40e95fb00c153a284) #60 Icon 组件 `href` 遗漏问题 (@minwe)
- `Improved` [e07d9d2](https://github.com/amazeui/amazeui-touch/commit/e07d9d2d952820ee6eb5177f9ad21c3ab738aada) #13 统一 date/datetime-local 与其他类型 input 高度
- `Fixed` [9f6eb37](https://github.com/amazeui/amazeui-touch/commit/9f6eb374dd18735146b53cf6da328781c0478941) 修复多选 select `getValue()` 错误

### v1.0.0-beta.3 (2016/06/01 15:40 +08:00)

- `Fixed` [99369b5](https://github.com/amazeui/amazeui-touch/commit/99369b5e42ced90789813a26ae0f3c1e8eebaabe) 修复 CSSTransitionGroup 在全局模式时的引用错误
- `New` [14045dc](https://github.com/amazeui/amazeui-touch/commit/14045dc04bbf5915ce1825048ecf1d76e18402c7) Grid 新增 `wrap` 属性，控制其是否换行（`flex-wrap` 属性）

### v1.0.0-beta.2 (2016/05/24 15:44 +08:00)

- `Improved` [e1b0e29](https://github.com/amazeui/amazeui-touch/commit/e1b0e29ac65e2b9c6fc44f6567128af0361798f6) #50 解决 `context` 在 OffCanvas 和 Popover 中丢失问题
- `New` [3aa23d4](https://github.com/amazeui/amazeui-touch/commit/3aa23d4c23437a5d5cf7bdbef83bd8927f0b398d) Android UC 浏览器在 `<html>` 上添加 `.ua-stupid-uc` 类名，以应用相关回退样式
- `Changed` [1b988fd](https://github.com/amazeui/amazeui-touch/commit/1b988fd77f8a3625a8e36d1c30afada871482dca) React 相关包移到 `peerDependencies` 字段，防止打包多个版本 React 报错问题
- `Fixed` [6977df2](https://github.com/amazeui/amazeui-touch/commit/6977df245e3f45dc068fadbab217bcd3d5d9b83e) 修复 Slider 在以 Android UC 为代表的浏览器中 `swipe` 手势无效问题
- `Improved` [d72e6ce](https://github.com/amazeui/amazeui-touch/commit/d72e6cee6622f92683c1c2b591ee37c8a9a63936) 网格系统兼容 Android UC 为代表的只支持 2009 版 flexbox 规范的浏览器
- `Fixed` [814f8dc](https://github.com/amazeui/amazeui-touch/commit/814f8dc206b40a75cfab5d08792bb3c53e2a0f12)  #31 文档在 Android UC 等浏览器中无法滚动问题
- `Improved` [6769e0f](https://github.com/amazeui/amazeui-touch/commit/6769e0fed9f0c5b7a175163a99344c2cf2e17dfb) #44 Switch 增加 `value` `disabled` `getValue` API
- `Changed` [eccf8e5](https://github.com/amazeui/amazeui-touch/commit/eccf8e5d6da12cd287c33559cab2a59d695616b6)
减少 NavBar 导航条目数据层级
- `Improved` [470741e](https://github.com/amazeui/amazeui-touch/commit/470741ee254d4d6898d146eee77614969c04652a) 处理 NavBar 在以 Android UC 为代表的浏览器中的兼容性 (@minwe)
- `New` [fcf9893](https://github.com/amazeui/amazeui-touch/commit/fcf98932c08b2ae67fbfd90f1844f9e070d09b73) 增加 `margin` `padding` 及文字颜色相关辅助类名
- `Improved` [f4f9a29](https://github.com/amazeui/amazeui-touch/commit/f4f9a29bdbb49ec8c763414bb745850ce8f697f7) #23 改进 Container 在 iOS 中流畅度
- `Improved` [0f680f8](https://github.com/amazeui/amazeui-touch/commit/0f680f823648eb63528195f1907c1e4e1830381a) 重构 Notification
- `Changed` [84c682e](https://github.com/amazeui/amazeui-touch/commit/84c682e9a606e9f8cc1d697e733d19e4721e596d) Modal `onRequestClose` 属性重命名为 `onDismiss`
- `Improved` [ed81459](https://github.com/amazeui/amazeui-touch/commit/ed81459aba1180aaf36ffa08080231919379cf0a) 重构 Modal，增强可定制性
- `Improved` [a79fe65](https://github.com/amazeui/amazeui-touch/commit/a79fe65c86e31153a201cce5033e1e7a99daf317) #40 调整 NavBar API，可以在链接上放置 OffCanvasTrigger


### v1.0.0-beta.1 (2016/04/25)

- `Changed` [93fac1f](https://github.com/amazeui/amazeui-touch/commit/93fac1f8a17a1f9d61af3e401bb759f2f2467a3b) #39 **API 变更**：`onSelect` 与 React 事件 API 冲突，重命名为 `onAction`，涉及的组件包括：
  - Modal
  - NavBar
  - Slider
  - Tabs
  - TabBar
- `Fixed` [89bc1ff](https://github.com/amazeui/amazeui-touch/commit/89bc1ff022f3b9074409c33f09c24af3c471349f) 修复 React 15.x 读取 `key` 警告问题
- `Changed` [721a2a7](https://github.com/amazeui/amazeui-touch/commit/721a2a72a63c20200b494d76655f81aca80914cd) #36 `react` 和 `react-dom` 移到 `peerDependencies`，解决使用时打包多个版本的问题
- `Fixed` [3d6bbdc](https://github.com/amazeui/amazeui-touch/commit/3d6bbdc819175a0cf6b31185b2a7b3421e447a8c) 修复 flexbox 在部分安卓 UA 上的显示问题（Thx @leakl），至此 flexbox 兼容性问题主要剩下 NavBar 和 Grid
- `Improved` [082c00f](https://github.com/amazeui/amazeui-touch/commit/082c00f2ad7d1e61c914238cc5eb326f73cb672e) 运行环境判断，为后端渲染做准备
- `Fixed` [4903567](https://github.com/amazeui/amazeui-touch/commit/49035679e1e3c55e043eeae02df1dd62be8c71c9) #27 修复 Object.assign 没有转换问题
- `Fixed` [dcdf80a](https://github.com/amazeui/amazeui-touch/commit/dcdf80a3dcbf1611c5422d4ded8b39de7781f9a0) 修复 Modal `open()` 方法判断逻辑始终为 `true` 的错误

### v0.1.0-beta2 (2015/11/17)

- `Improved` [81c4c1a](https://github.com/amazeui/amazeui-touch/commit/81c4c1a23fa5fca4a3352e3a8711a79fa04d7b3b) 移除 `input[type="range"]` 在 Safari 中的黑色边框
- `Improved`  [e39f2e0](https://github.com/amazeui/amazeui-touch/commit/e39f2e023ce9e7997adcafbb96e0cfbc0274ea97) #6 调整 View 样式
- `Improved` #11 优化 Modal、Notification 等组件在 iOS 9 Safari 中入场动画效果
- `Improved` [6cdf4ec](https://github.com/amazeui/amazeui-touch/commit/6cdf4ec61c357b0471837a49db78ba1d66f5b564) #5 修复 Slider 阻止垂直触控默认滚动行为问题
- `Fixed` [33305f4](https://github.com/amazeui/amazeui-touch/commit/33305f49405b09ec578fdf530a54012e1fd9bf43)  #7 修复 Modal 遮罩层显示问题（via [519ae20](https://github.com/amazeui/amazeui-touch/commit/519ae20c8646252c06b819c538c74395a4e47b22) ）
- `Changed` [44bfec0](https://github.com/amazeui/amazeui-touch/commit/44bfec03b4fbee022914476abb88b3f090f8d093) #10 替换 Loader 样式，移除 SVG
- `Improved` [ea51873](https://github.com/amazeui/amazeui-touch/commit/ea51873871d70e131b1d307a1a4236d89e37774e) Button 添加 `:hover` 样式
- `Improved` [338dca4](https://github.com/amazeui/amazeui-touch/commit/338dca48a0fec187ebbcd6215853f27942c6ab99) 官网添加 kitchen-sink 二维码
