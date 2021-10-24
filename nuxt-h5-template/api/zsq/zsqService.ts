import { request } from "@/utils/request/api";

import {
  IcommunityFitmentReqParams,
  ICommunityListReqParams,
  IcommunityFitmentResponseData,
  ICommunityRes,
} from "@/api/zsq/zsqModel";

// 通过类型获取社区配置模块
export const getCommunityFitment = (
  params: IcommunityFitmentReqParams
): Promise<IcommunityFitmentResponseData> => {
  return request({
    url: "/patient/v3/community/getCommunityFitment",
    method: "get",
    params,
  });
};

//  获取社区列表
export const queryCommunityList = (data: ICommunityListReqParams): Promise<ICommunityRes> => {
  return request({
    url: "/patient/v3/community/communitySearch",
    method: "post",
    data,
  });
};
