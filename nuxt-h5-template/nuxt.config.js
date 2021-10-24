import path from "path";
import cheerio from "cheerio";
import sitemap from "./config/sitemap";
import settings from "./config/settings";
import { BASE_URL } from "./config/link";
import { generateRoutes } from "./config/routes";
function resolve(str) {
  return path.resolve(__dirname, str);
}

export default {
  srcDir: "./",
  // rootDir: path.join(__dirname, "./"),
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: settings.title,
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1,user-scalable=no,viewport-fit=cover",
      },
      { name: "format-detection", content: "telephone=no" },
      { hid: "description", name: "description", content: settings.description },
      { "http-equiv": "Cache-Control", content: "no-store" },
      { "http-equiv": "Expires", content: "0" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/iw/favicon.ico" }],
    script: [
      {
        src: "/iw/js/flexible.js",
        type: "text/javascript",
        charset: "utf-8",
      },
      {
        src: "/iw/js/iwenJSNativeBridge.js",
        type: "text/javascript",
        charset: "utf-8",
      },
      // 引入百度统计(区别于aiwen-user-h5)
      {
        src: "https://hm.baidu.com/hm.js?bae5f27bf3508676ef87450a03bb747c",
      },
      {
        // 百度地图
        src: "https://api.map.baidu.com/api?v=2.0&ak=eYf9sA6yVTFHlh9ytU4a0EYY",
      },
      {
        // 微信小程序js
        src: "https://res.wx.qq.com/open/js/jweixin-1.4.0.js",
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  server: {
    port: settings.serverPort, // default: 3000
    host: "0.0.0.0", // default: localhost,
  },

  env: {
    ENV_NAME: process.env.ENV_NAME,
  },

  router: {
    middleware: ["device", "auth"],
    prefetchLinks: false, // 全局禁用所有链接上的预取
    extendRoutes: (routes, resolve) => {
      // 自定义路由配置
      const customRoutes = generateRoutes(resolve);
      routes.push(...customRoutes);
    },
  },

  render: {
    resourceHints: false, // 添加prefetch和preload，以加快初始化页面加载时间。如果有许多页面和路由，可禁用此项
  },

  loading: {
    color: settings.progressLoadingColor,
    failedColor: settings.progressFailedColor,
  },

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: "@/plugins/axios-accessor", ssr: true }, // 存储axios，统一配置
    { src: "@/plugins/global-comp", ssr: true }, // 全局组件
    { src: "@/plugins/mta-point", ssr: false }, // 打点统计
    { src: "@/plugins/vant-ui", ssr: true }, // 注册全局 vue 过滤器
    { src: "@/plugins/vue-filter", ssr: true }, // 注册全局 vue 过滤器
    { src: "@/plugins/vue-picture-preview", ssr: false }, // 客户端才注册组件
  ],

  hooks: {
    "vue-renderer:ssr:context"(context) {
      if (process.env.NODE_ENV !== "production") {
        const routePath = JSON.stringify(context.nuxt.routePath);
        context.nuxt = { serverRenderer: true, routePath };
      }
    },
    // 去除 data-n-head 属性
    "render:route": (_url, result) => {
      const dom = cheerio.load(result.html, { decodeEntities: false });
      dom(`meta`).removeAttr("data-n-head");
      dom(`link`).removeAttr("data-n-head");
      dom(`script`).removeAttr("data-n-head");
      result.html = dom.html();
    },
  },

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/proxy",
    "cookie-universal-nuxt",
    "@nuxtjs/sitemap",
  ],
  sitemap,

  // axios配置
  axios: {
    proxy: true, // 配置代理
    retry: {
      retries: 3,
    },
    credential: false,
  },
  // 本地代理配置
  proxy: {
    "/api": {
      target: BASE_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
        changeOrigin: true,
      },
    },
    "/midauth": {
      target: `${BASE_URL}/midauth`,
      changeOrigin: true,
      pathRewrite: {
        "^/midauth": "",
        changeOrigin: true,
      },
    },
    "/patient": {
      target: `${BASE_URL}/patient`,
      changeOrigin: true,
      pathRewrite: {
        "^/patient": "",
        changeOrigin: true,
      },
    },

    "/iw/p/h5": {
      target: `${BASE_URL}/api/gateway/doctor/p/h5`,
      changeOrigin: true,
      pathRewrite: {
        "^/iw/p/h5": "",
        changeOrigin: true,
      },
    },

    // 首页改版
    "/pch5": {
      target: "https://health.sina.cn/pch5",
      changeOrigin: true,
      pathRewrite: {
        "^/pch5": "",
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    // 主块中的 CSS 提取到一个单独的 CSS 文件 只在打包使用 利于seo
    extractCSS: process.env.NODE_ENV === "production",
    // yarn nuxt build --analyze 分析并可视化构建后的打包文件
    transpile: [/vant.*?less/],
    // Nuxt.js 将dist文件上传到 CDN 来获得最快渲染性能，只需将publicPath设置为 CDN 即可
    publicPath: settings.publicPath,
    babel: {
      plugins: [
        [
          "import",
          {
            libraryName: "vant", // vant 组件按需引入
            style: (name) => {
              return `${name}/style/less.js`;
            },
          },
          "vant",
        ],
      ],
    },
    loaders: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          "@red": "#664AE1",
        },
      },
      // 配置url-loader: 图片大小小于1byte的将被转为base64
      imgUrl: { limit: 1 },
    },
    postcss: {
      plugins: {
        "postcss-pxtorem": {
          rootValue: 37.5,
          propList: ["*", "!font-size"],
        },
      },
      preset: {
        autoprefixer: true,
      },
    },
    cache: true, // 启用缓存
    // 禁止预加载效果
    performance: {
      prefetch: false,
    },
    // 为客户端和服务端的构建配置进行手工的扩展处理
    extend(config, { isDev, isClient }) {
      // 排除 nuxt 原配置的影响,Nuxt 默认有vue-loader,会处理svg,img等
      const svgRule = config.module.rules.find((rule) => rule.test.test(".svg"));
      svgRule.exclude = [resolve("assets/icons")];
      // 添加loader规则
      config.module.rules.push({
        test: /\.svg$/, // 匹配.svg
        include: [resolve("assets/icons")], // 将存放svg的目录加入到loader处理目录
        use: [{ loader: "svg-sprite-loader", options: { symbolId: "icon-[name]" } }],
      });
      // Run ESLint on save
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        });
      }
    },
    // 自定义打包文件名
    filenames: {
      img: ({ isDev }) => (isDev ? "[path][name].[ext]" : "img/[name].[hash:7].[ext]"),
    },
  },
};
