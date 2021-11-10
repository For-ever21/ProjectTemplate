/* eslint-disable @typescript-eslint/camelcase */
// const TerserPlugin = require("terser-webpack-plugin");
const autoprefixer = require("autoprefixer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const path = require("path");

// 是否使用gzip
const productionGzip = true;

// 需要gzip压缩的文件后缀
const productionGzipExtensions = ["js", "css"];

// cdn 配置地址
const cdn = {
  // 本地环境
  dev: {
    js: [],
  },
  // 打包环境
  build: {
    js: [
      "https://cdn.jsdelivr.net/combine/npm/vue@2.6.12/dist/vue.min.js," +
        "npm/vue-router@3.5.1/dist/vue-router.min.js," +
        "npm/vuex@3.6.2/dist/vuex.min.js," +
        "npm/axios@0.21.1/dist/axios.min.js," +
        "npm/element-ui@2.15.1/lib/index.js",
    ],
  },
};

function addStyleResource(rule) {
  rule
    .use("style-resource")
    .loader("style-resources-loader")
    .options({
      patterns: [path.resolve(__dirname, "./src/styles/var.less")],
    });
}

module.exports = {
  publicPath: "/", // 部署应用时的基本 URL history模式下不要随意更改
  outputDir: process.env.VUE_APP_OUTPUT_DIR, // 生产环境构建文件的目录
  assetsDir: "static", // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  indexPath: "index.html", // 指定生成的 index.html 的输出路径
  filenameHashing: true, // 生成的静态资源文件名是否使用哈希
  lintOnSave: true,
  productionSourceMap: false, // 生产环境构建map文件
  integrity: true, // 构建后的文件是部署在 CDN，启用该选项可以提供额外的安全性。
  // css相关配置
  css: {
    // 开启 CSS source maps
    sourceMap: false, // 默认为false，true 会影响构建性能
    requireModuleExtension: true, // 默认 true,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
  },
  parallel: require("os").cpus().length > 1,
  chainWebpack: (config) => {
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin("html").tap((args) => {
      if (process.env.NODE_ENV === "development") {
        args[0].cdn = cdn.dev;
      } else {
        args[0].cdn = cdn.build;
      }
      return args;
    });

    config
      // 无列映射的源映射忽略加载器源映射 开发环境, sourcemap不包含列信息
      .when(process.env.NODE_ENV === "development", (config) => config.devtool("cheap-source-map"));

    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));
  },
  configureWebpack: () => {
    const myConfig = {};
    if (process.env.NODE_ENV === "production") {
      myConfig.plugins = [];
      // 1. 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
      productionGzip &&
        myConfig.plugins.push(
          new CompressionWebpackPlugin({
            // asset: '[path].gz[query]',
            algorithm: "gzip",
            test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
            threshold: 8192,
            minRatio: 0.8,
          })
        );
      // 2. 生产环境npm包转CDN
      myConfig.externals = {
        vue: "Vue",
        "vue-router": "VueRouter",
        vuex: "Vuex",
        axios: "axios",
        "element-ui": "ELEMENT",
      };
      // TODO: 暂时注释，会影响jenkins构建
      // 3.删除所有的注释
      // config.optimization.minimizer.push(
      //   new TerserPlugin({
      //     sourceMap: true,
      //     cache: true, // 启用缓存
      //     parallel: true, // 启用多进程并行运行
      //     terserOptions: {
      //       // 删除所有的注释
      //       comments: false,
      //       compress: {
      //         warnings: false, //去除warnings
      //         drop_console: true, //去除console
      //         drop_debugger: true, //去除debugger
      //         pure_funcs: ["console.log"],
      //         collapse_vars: true, // 内嵌定义了但是只用到一次的变量
      //         reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
      //       },
      //     },
      //   })
      // );
    }
    return myConfig;
  },
  devServer: {
    // open: true,
    host: "0.0.0.0",
    port: 3000,
    https: false,
    disableHostCheck: true, // 关闭host check，方便使用ngrok之类的内网转发工具
    overlay: {
      warnings: false,
      errors: true,
    },
    hot: true,
    hotOnly: true,
    progress: true,
    proxy: {
      "/api": {
        // 流量平台代理
        // target: "http://bc.wenwo.com",
        // target: "http://10.200.0.183:56080",
        target: "https://adm.wenwo.com/flow",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/",
        },
      },
      "/ztApi": {
        // 中台接口代理
        target: "https://adm.wenwo.com",
        changeOrigin: true,
        pathRewrite: {
          "^/ztApi": "/",
        },
      },
    },
  },
};
