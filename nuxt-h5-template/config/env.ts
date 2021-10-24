/**
 * @description 针对不同的环境进行相关配置
 */

import { IEnvConfig } from "./types";

const envConfig: IEnvConfig = {
  dev: {
    BASE_URL: "https://health.sina.cn",
  },
  test: {
    BASE_URL: "https://test.health.sina.cn",
  },
  "rebuild-dev": {
    BASE_URL: "https://rebuild-dev.health.sina.cn",
  },
  "rebuild-test": {
    BASE_URL: "https://rebuild-test.health.sina.cn",
  },
  uat: {
    BASE_URL: "https://uat.health.sina.cn",
  },
  production: {
    BASE_URL: "https://health.sina.cn",
  },
};

export default envConfig[process.env.ENV_NAME];
