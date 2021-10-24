/**
 * @description SEO sitemap配置
 */
const sitemap = {
  path: "/seo/sitemap/h5.xml", // 生成的文件路径
  hostname: "https://health.sina.cn", // 网址
  cacheTime: 1000 * 60 * 60 * 24, // 1天 更新频率 只在 generate: false 有用
  gzip: true, // 生成 .xml.gz 压缩的sitemap
  generate: false, // 允许使用 generate 生成
  // 排除不要的页面
  exclude: [
    "/404", // 这里的路径相对 hostname
  ],
  // 默认的配置
  defaults: {
    changefreq: "daily",
    lastmod: new Date(),
    priority: 0.9,
  },
  // 需要生成的 xml 数据，return 返回需要给出的 xml 数据
  routes: () => {
    const routes = [
      {
        url: "/zsq", // 这里的路径相对 hostname
        loc: "https://health.sina.cn/iw/zsq",
      },
    ];
    return routes;
  },
};

export default sitemap;
