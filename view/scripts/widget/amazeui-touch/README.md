# Amaze UI Touch

基于 React.js 的移动端 Web UI 组件库。

[![NPM version](https://img.shields.io/npm/v/amazeui-touch.svg?style=flat-square)](https://www.npmjs.com/package/amazeui-touch)
[![Build Status](https://img.shields.io/travis/amazeui/amazeui-touch.svg?style=flat-square)](https://travis-ci.org/amazeui/amazeui-touch)
[![Dependency Status](https://img.shields.io/david/amazeui/amazeui-touch.svg?style=flat-square)](https://david-dm.org/amazeui/amazeui-touch)
[![devDependency Status](https://img.shields.io/david/dev/amazeui/amazeui-touch.svg?style=flat-square)](https://david-dm.org/amazeui/amazeui-touch#info=devDependencies)

### [入门套件](https://github.com/amazeui/amt-starter-kit)

## 简介

### 专属于移动

Amaze UI Touch 专为移动打造，在技术实现、交互设计上只考虑主流移动设备，保证代码轻、性能高。

### 专注于 UI

只提供 UI 组件（View），对配套技术不做限定，方便用户与现有技术栈快速整合，降低使用成本。

### 采用 Flexbox

使用 Flexbox 技术，灵活自如地对齐、收缩、扩展元素，轻松搞定移动页面布局。

### 基于 React.js

基于风靡社区的 React.js 封装组件，沿袭高性能、可复用、易扩展、一处学习多端编写特性。



## 安装使用

1. 从 npm 安装：

    ``` bash
    npm install --save-dev amazeui-touch
    ```

2. 使用 组件：

    ``` javascript
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          said: false,
        };

        this.handleClick = this.handleClick.bind(this);
      }

      handleClick() {
        this.setState({
          said: true,
        });
      }

      renderHello() {
        return this.state.said ? (
          <p>Hello World! Welcome to Amaze UI Touch.</p>
        ) : null;
      }

      render() {
        const said = this.state.said;
        const text = said ? 'Said :(' : 'Say hello :)';

        return (
          <div>
            <Button
              amStyle="primary"
              disabled={said}
              onClick={this.handleClick}
            >
              {text}
            </Button>
            {this.renderHello()}
          </div>
        );
      }
    }

    ReactDOM.render(<App />, document.getElementById('root'));
    ```

ES2015/JSX 编译参见 [Amaze UI Touch Starter Kit](https://github.com/amazeui/amt-starter-kit)。



## 开发及演示

### 文档及演示

1. 全局安装 gulp.js：

   ``` bash
   npm install -g gulp
   ```


1. 克隆源代码并安装依赖：

   ``` bash
   git clone https://github.com/amazeui/amazeui-touch.git
   ```

   在源码目录下执行：

   ``` bash
   npm install
   ```

2. 启动开发服务：

   ``` bash
   npm start
   ```

   相关文件构建完成后会自动打开浏览器，可查看文档及组件演示。

### 构建
   
```bash
npm run build
```

打包后的文件位于 `dist` 目录下。

### [反馈建议](https://github.com/amazeui/amazeui-touch/issues)



## License

MIT © 2015 - 2016 AllMobilize Inc.
