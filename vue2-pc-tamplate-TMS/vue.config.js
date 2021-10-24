const autoprefixer = require("autoprefixer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 按需引入vant组件 结合typescript
const merge = require("webpack-merge");
const tsImportPluginFactory = require("ts-import-plugin");

const path = require("path");

// 是否使用gzip
const productionGzip = true;

// 需要gzip压缩的文件后缀
const productionGzipExtensions = ["js", "css"];

// cdn 配置地址
const cdn = {
  js: [
    "https://cdn.jsdelivr.net/combine/npm/vue@2.6.14/dist/vue.min.js," +
      "npm/vue-router@3.5.1/dist/vue-router.min.js," +
      "npm/vuex@3.6.2/dist/vuex.min.js," +
      "npm/axios@0.21.1/dist/axios.min.js," +
      "npm/element-ui@2.15.1/lib/index.js",
  ],
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
  publicPath: "/tms/", // 部署应用时的基本 URL history模式下不要随意更改
  outputDir: "dist", // 生产环境构建文件的目录
  assetsDir: "static", // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  filenameHashing: true, // 生成的静态资源文件名是否使用哈希
  lintOnSave: true,
  productionSourceMap: false, // 生产环境构建map文件
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
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn;
      }
      return args;
    });

    /** 处理svg 图片 打包svg图片为雪碧图*/
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.exclude.add(/node_modules/);
    svgRule
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      });
    // const imagesRule = config.module.rule("images");
    // imagesRule.exclude.add(resolve("src/icons"));
    config.module.rule("images").test(/\.(png|jpe?g|gif)(\?.*)?$/);
    // vant ts版本 的按需加载
    config.module
      .rule("ts")
      .use("ts-loader")
      .tap((options) => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true,
              }),
            ],
          }),
          compilerOptions: {
            module: "es2015",
          },
        });
        return options;
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
    }
    return myConfig;
  },
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 9527,
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
      // 爱问大后台 通用接口
      "/api": {
        // target: "http://10.97.103.78:55001", // 临时 联调地址
        // target: "https://admin-dev.wenwo.com", // 开发环境 联调地址
        target: "https://admin-test.wenwo.com", // 测试环境 联调地址
        // target: "https://admin.wenwo.com", // 生产 联调地址
        // target: "https://admin-rebuild-dev.wenwo.com", // 重构开发 联调地址
        // target: "https://admin-rebuild-test.wenwo.com", // 重构测试 联调地址
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
      // 登录接口
      "/loginApi": {
        // target: "https://admin-dev.wenwo.com", // 开发环境 联调地址
        target: "https://admin-test.wenwo.com", // 测试环境 联调地址
        // target: "https://admin.wenwo.com", // 生产 联调地址
        // target: "https://admin-rebuild-dev.wenwo.com", // 重构开发 联调地址
        // target: "https://admin-rebuild-test.wenwo.com", // 重构测试 联调地址
        changeOrigin: true,
        pathRewrite: {
          "^/loginApi": "/api",
        },
      },
    },
  },
};
