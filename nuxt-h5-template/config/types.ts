export type IEnvConfig = {
  [k in Env]: IEnvItemConfig;
};
export interface IEnvItemConfig {
  BASE_URL: string; // 基础 url
}

export interface ISettings {
  title: string; // 配置系统title
  description?: string; // 系统描述
  keywords?: string; // 系统关键词
  progressLoadingColor: string; // 顶部加载条loading颜色
  progressFailedColor: string; // 顶部加载条error颜色
  publicPath: string; // 项目包路径
  errorLog: string[]; // 是否开启错误日志打印，最好只支持生产环境
  serverPort: number; // server 端口号
}
