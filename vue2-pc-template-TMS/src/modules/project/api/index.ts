import { RequestConfig } from "@wenwo-public/http-util-js";
import { post, get, postMutilData } from "@/utils/httpUtil";

import {
  TemplateListReq,
  TemplateListRes,
  TemplateDetailRes,
  SaveActivityReq,
  SpuDetailRes,
} from "./model";

// 通过营销目的获取模版列表
export function getTemplateListApi(
  data: TemplateListReq,
  config?: RequestConfig
): Promise<TemplateListRes> {
  return get("/pcd/tms/template/getListByMarketPurpose", data, config);
}

// 查询模板详情
export function getTemplateDetailApi(
  data?: { id: number },
  config?: RequestConfig
): Promise<TemplateDetailRes> {
  return get("/pcd/tms/template/getById", data, config);
}

// 通过spuId获取对应的spu的详细信息
export function findSpuDetailApi(
  data?: { id: number },
  config?: RequestConfig
): Promise<SpuDetailRes> {
  return get("/pcd/tms/activity/spu/findSpuDetailById", data, config);
}

// 保存活动
export function saveActivityApi(
  data?: SaveActivityReq,
  config?: RequestConfig
): Promise<Record<string, any>> {
  return post("/pcd/tms/activity/saveActivity", data, config);
}

// 上传图片
export function uploadPictureApi(
  data?: { imgage: Blob },
  config?: RequestConfig
): Promise<{ id: string; url: string }> {
  return postMutilData("/pcd/tms/activity/uploadImg", data, config);
}
