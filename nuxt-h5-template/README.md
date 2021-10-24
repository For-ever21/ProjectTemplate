# 患端SEO项目

[更新日志](CHANGELOG.md)
- [患端SEO项目](#患端seo项目)
  - [项目介绍](#项目介绍)
  - [文档](#文档)
  - [项目结构](#项目结构)
  - [开发准备事项](#开发准备事项)
    - [环境要求](#环境要求)
    - [插件](#插件)
    - [建议开发环境](#建议开发环境)
  - [使用](#使用)
    - [开发环境](#开发环境)
    - [打包](#打包)
    - [格式化](#格式化)
    - [其他](#其他)
  - [Git Flow](#git-flow)
  - [项目注意事项](#项目注意事项)

## 项目介绍

基于`vant-ui`,`typescript`,`Nuxt`实现SSR移动端项目

## 文档

[styleguide命令生成](/doc)

## 项目结构
```
|-- 根目录
    |-- api -存放业务接口
    |-- assets
    |   |-- icons -svg格式的图标
    |   |-- images
    |   |   |-- default -默认图存放
    |   |   |-- icons -图标-png格式
    |   |-- styles
    |       |-- mixins -混合工具类less存放
    |-- components -通过styleguide生成doc说明文档
    |-- config -配置文件
    |-- enums -全局枚举
    |-- pages
    |   |-- conAnalysis
    |   |   |-- _id.vue
    |   |   |-- components -业务组件
    |   |   |-- images -存放业务所需图片
    |   |   |-- types -存放业务的ts声明
    |-- utils
        |-- api.ts -基础axios配置
        |-- appPath.ts -请求路径转换
        |-- dataUtil.ts -数据处理工具
        |-- dateUtil.ts -日期处理工具
        |-- domainUtil.ts -域名处理
        |-- domUtil.ts -dom处理工具
        |-- index.ts -常用工具
        |-- is.ts -判断类型工具
        |-- scroll-to.ts -实现滚动操作工具
        |-- uuid.ts -生成随机uuid工具
        |-- validateUtil.ts -正则验证工具
        |-- auth -cookie校验方法
        |-- file 文件格式流处理工具
        |   |-- download.ts
        |   |-- stream.ts
        |-- native 与原生app调用工具类
```


## 开发准备事项
### 环境要求

- `Node.js`: - 版本最好大于 `12.0.0`
- `yarn` > `npm` > `cnpm`: - 包管理工具.

### 插件

- [Vue Router Next](https://github.com/vuejs/vue-router-next)
- [Vuex Next](https://github.com/vuejs/vuex)
- [axios](https://github.com/axios/axios) - Http 数据交互
- [TypeScript](https://www.typescriptlang.org/)

### 建议开发环境

- `Git`: - 版本管理工具
- `Visual Studio Code` - (VSCode): 最新版本
  - [VS Code Extensions](./.vscode/extensions.json)
    - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - Tailwind Css 样式联想
    - [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) - vue 开发必备
    - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 脚本代码检查
    - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 代码格式化
    - [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - css 格式化

## 使用

### 开发环境

```bash
yarn dev
```

### 打包

```bash

yarn build # 打包

yarn build:dev # 打包，执行之前会先删除缓存

yarn build --report # 生成构建包报表预览
```

### 格式化

```bash
yarn lint # 检测eslint格式

yarn lint-fix # 检测eslint格式 并进行修复
```

### 其他

```bash

yarn changelog # 生成CHANGELOG

yarn styleguide # 本地运行component组件说明文档

yarn styleguide:build # 生成component组件说明文档(doc)
```

## Git Flow

[wiki地址](https://wiki.dev.wenwo.com/pages/viewpage.action?pageId=13274560)

## 项目注意事项
* 患端SEO项目使用56005端口
