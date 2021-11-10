
# 项目名：爱问广告投放管理平台

[项目地址](https://adm.wenwo.com/)

## 1. 技术栈
* [vue2.x](https://cn.vuejs.org/v2/guide/)
* [vue-router](https://router.vuejs.org/zh/)
* [vuex](https://vuex.vuejs.org/zh/)
* [typescript](https://www.typescriptlang.org/zh/)
* [element-ui](https://element.eleme.cn/#/zh-CN)


## 2. Build Setup

``` bash
# 安装依赖 (install dependencies)

npm install cnpm -g
cnpm install

# 开启本地带有热重载的开发服务器，端口为3033，serve with hot reload at localhost:3033
npm run dev

# 打包生产环境版本 build for production with minification
npm run build

# 打包测试环境版本 Build for test environment with minification
npm run build:test

# 打包开发环境版本 Build for development environment with minification
npm run build:dev

# 打包重构测试环境版本 Build for rebuild test environment with minification
npm run rebuild:test

# 打包重构开发环境版本 Build for rebuild development environment with minification
npm run rebuild:dev
```

## 3. 环境相关配置说明

### 3.1 环境相关配置文件说明
> 环境相关配置见 `./.env.xxx` 相关文件
* VUE_APP_CURRENT_MODE：环境变量
* VUE_APP_API：项目api请求地址前缀
* VUE_APP_ZT_API：中台API请求地址前缀
* VUE_APP_OUTPUTDIR：项目打包输出目录
* VUE_APP_LOGIN_CONFIG_ID：登录配置ID（不同环境id不同，本地调试请留意）

### 3.2 运行环境变量
* 获取方法  
```process.env.RUN_ENV```

* 不同环境运行变量

| 环境         | 命令                  | 对应gitlab分支 | 运行环境变量 |
|-------------|------------------------|---------------|----------|
| mock        | npm run mock           |               | mock     |
| 本地运行     | npm run dev           |                | develop |
| 开发环境     | npm run build:dev     | develop        | product|
| 测试环境     | npm run build:test    | test           | product|
| 重构开发环境 | npm run rebuild:dev   | rebuild-dev    | product|
| 重构测试环境 | npm run rebuild:test  | rebuild-test   | product |
| 生产环境     | npm run build         | master         | product |


### 3.3 环境变量
* 获取方法  
```process.env.VUE_APP_CURRENT_MODE```

* 不同运行环境变量 

| 环境   | 命令  | 对应gitlab分支 | 环境变量 | 对应配置文件 |
|--------|--------|------|-----|-----|
| mock   | npm run mock  |     | mock     |     |
| 本地运行 | npm run dev           |       | develop |.env.development|
| 开发环境 | npm run build:dev     | develop    | develop |.env.develop|
| 测试环境  | npm run build:test    | test   | test   |.env.test|
| 重构开发环境 | npm run rebuild:dev   | rebuild-dev | rebuild-dev|.env.rebuildDev|
| 重构测试环境 | npm run rebuild:test | rebuild-test |rebuild-test|.env.rebuildTest|
| 生产环境  | npm run build   | master  | production |.env.production|


## 4. 项目部署
> 本项目已集成[运维系统CICD](http://10.200.0.128/main#/project/gitlab/index)
* 项目打包路径 ./dist
* 项目部署路径 /www/web_pages/flow
* 项目部署配置文件请查看 ./Jenkinsfile


## 5. styles
> 本项目采用 **`less`** 编写样式。详情见 [styles](./src/styles/) 文件夹

* [index.less](./src/styles/index.less) 为统一出口文件。
* [custom.less](./src/styles/custom.less) 页面共用样式。
* [element-ui.less](./src/styles/element-ui.less) element-ui样式复写
* [mixins.less](./src/styles/mixins.less) less代码快、快捷定义样式
* [resetStyle.less](./src/styles/resetStyle.less) css基础样式重置
* [transition.less](./src/styles/transition.less) 全局 transition css
* [var.less](./src/styles/var.less) less 变量


## 6. typescript适配定义文件
参考 [shims-vue.d.ts](../src/types/shims-vue.d.ts)

## 7. router
> 本项目已配置**动态获取 modules 文件夹下 router/asyncRouter 文件中的路由配置**。无需手动添加

### 7.1 路由基础配置
> 配置见 [src/router](./src/router/index.ts)

  ```javascript
    /** 实现自动加载 @modules 下的模块里的静态 router 文件 */
    const loadModulesRouter = require.context(
        "../modules",
        true,
        /\.\/[a-zA-Z0-9_-]+\/router\/.+\.ts$/
    );

    /** 实现自动加载 @modules 下的模块里的异步动态 asyncRouter 文件 */
    const loadModulesAsyncRouter = require.context(
        "../modules",
        true,
        /\.\/[a-zA-Z0-9_-]+\/asyncRouter\/.+\.ts$/
    );
    function getFileRoutes(fn: any): Array<CustomRoute> {
        let routes: Array<CustomRoute> = [];

        routes = fn.keys().reduce((routes: Array<CustomRoute>, modulePath: string) => {
            const value = fn(modulePath);
            routes = routes.concat(value.default);
            return routes;
        }, routes);
        return routes;
    }
    // 存储 静态路由
    const constantRoutes = getFileRoutes(loadModulesRouter);

    // 存储 异步路由
    export const asyncRoutes = getFileRoutes(loadModulesAsyncRouter);

    // 存储 error 页面路由
    const createRouter = () =>
    new VueRouter({
        mode: "history",
        routes: constantRoutes.concat(errorRoutes),
        base: "./",
        scrollBehavior(): { x: number; y: number } {
        r   eturn { x: 0, y: 0 };
        },
    });
  ```
### 7.2 路由导航卫士
* 路由鉴权以及用户登录信息设置等配置见 [permisstionGuard.ts](./src/router/guard/permisstionGuard.ts)  

  ```javascript
    // 鉴权路由 白名单
    const whiteList = ["/login", "/auth-redirect", "/"]; 
  ```
> 不需要登录状态就可访问的路由添加到 `whiteList` 中  

  ```javascript
    const hasToken = getToken();
    const { userId } = getUserInfo();
    if (hasToken) {
    if (to.path === "/login") {
        // 已经登录，走登录后的首页
        next({ path: "/home" });
    } else {
        try {
        // 获取用户信息
        if (!userId) await store.dispatch("getUserInfo");
        next();
        } catch (error) {
        // 删除token，重新跳转到登录页
        await store.dispatch("resetToken");
        Message.error(error || "Has Error");
        next(`/login?redirect=${to.fullPath}`);
        }
    }
    } else {
    if (whiteList.indexOf(to.path) !== -1) {
        // 白名单内的地址，直接通过
        next();
    } else {
        // 判断没有权限，进入登录页
        next(`/login?redirect=${to.fullPath}`);
    }
    }
  ```
> 上面为登录判断逻辑

* 其他配置见 [progressGuard.ts](./src/router/guard/progressGuard.ts)

## 8. axios 配置
> axios 配置[utils/http.ts](./src/utils/http.ts)
### 8.1 token统一设置
  ```javascript
    import { getToken } from "@/utils/auth";
    // ……
    // 请求拦截
    service.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            if (store.getters.getterToken) {
            config.headers["token"] = getToken(); // 业务端 校验
            config.headers["Authorization"] = `Bearer business=${getToken()}`; // 中台 校验
            }
            return config;
        },
        (err: any) => {
            Promise.reject(err);
        }
    );
    // ……
  ```

### 8.2 接口响应异常拦截处理
+ 接口返回数据统一格式为：
  ```javascript
    {
        data: {},
        message: "massage",
        status: 0
    }  
  ```
+ 接口响应处理逻辑
  ```javascript
    import { ResultEnum } from "@/enums/httpEnum";
    // ……
    const { data, message, status } = response.data;
    if (status === ResultEnum.SUCCESS) {
      return data;
    } else if (status === ResultEnum.Unauthorized) {
      // 重置token，重新登录
      store.dispatch("resetToken").then(() => {
        location.reload();
      });
    } else if (status >= ResultEnum.SpecialStart && status <= ResultEnum.SpecialEnd){
      return Promise.reject(response.data);
    } else {
      Message.error(message || "Error");
      return Promise.reject(new Error(message || "Error"));
    }
    // ……
  ```
  * 正常情况 `status` 为 `0`
  * 登录信息失效 `status` 为 `401`或`403`
  * 前端自定义异常处理 `status` 为 `56081001-56081999`
  * 其他异常 **统一使用element-ui的Message组件弹出后台返回的message错误信息**

