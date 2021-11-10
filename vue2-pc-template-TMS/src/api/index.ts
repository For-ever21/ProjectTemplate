import { get } from "@/utils/httpUtil";

// 获取oss配置信息
export function getOssConfigApi(): Promise<Record<string, any>> {
  return get("/flowCommonData/getOssConfig");
}
