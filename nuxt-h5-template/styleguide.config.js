// const { resolve } = require("path");
const { getWebpackConfig } = require("nuxt");
const vueLoader = require("vue-loader");

const FILTERED_PLUGINS = [
  "WebpackBarPlugin",
  "VueSSRClientPlugin",
  "HotModuleReplacementPlugin",
  "FriendlyErrorsWebpackPlugin",
  "HtmlWebpackPlugin",
];

const docSiteUrl = process.env.DEPLOY_PRIME_URL || "https://vue-styleguidist.github.io";

/** @type import("vue-styleguidist").Config */
module.exports = async () => {
  // get the webpack config directly from nuxt
  const nuxtWebpackConfig = await getWebpackConfig("client", {
    for: "dev",
  });

  const webpackConfig = {
    module: {
      rules: [
        ...nuxtWebpackConfig.module.rules.filter(
          // remove the eslint-loader
          (a) => a.loader !== "eslint-loader"
        ),
        {
          test: /\.vue$/,
          loader: "vue-loader",
          options: {
            loaders: {
              scss: ["vue-style-loader", "css-loader", "less-loader"],
            },
          },
        },
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.(css?|less)(\?.*)?$/,
          loader: "style-loader!css-loader!less-loader",
        },
      ],
    },
    resolve: { ...nuxtWebpackConfig.resolve },
    plugins: [
      ...nuxtWebpackConfig.plugins.filter(
        // And some other plugins that could conflcit with ours
        (p) => FILTERED_PLUGINS.includes(p.constructor.name) === -1
      ),
      new vueLoader.VueLoaderPlugin(),
    ],
  };

  return {
    components: "./components/**/index.vue",
    // renderRootJsx: resolve(__dirname, "styleguide/styleguide.root.js"),
    ribbon: {
      text: "Back to examples",
      url: `${docSiteUrl}/Examples.html`,
    },
    webpackConfig,
    usageMode: "expand",
    styleguideDir: "doc",
  };
};
