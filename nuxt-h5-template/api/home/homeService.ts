import { request } from "@/utils/request/api";

import {
  IArticleListReqParams,
  IAddDoctorReqParams,
  IArticleRes,
  VersionType,
  IbusinessType,
} from "@/api/home/model/homeModel";

// 首页获取banner接口
export const getBanner = (params: IbusinessType) => {
  return request({
    url: "/patient/v3/banner/getBanner",
    method: "get",
    params,
  });
};

// 首页获取banner接口  首页改版
export const getNewBanner = (params: VersionType) => {
  return request({
    url: "/pch5/decoration/h5/banner/index",
    method: "get",
    params,
  });
};

// 获取首页配置科室信息
export const getFitmentDepartment = (params: VersionType) => {
  return request({
    // url: "/patient/v3/department/getFitmentDepartment",
    url: "/pch5/decoration/h5/department/index",
    method: "get",
    params,
  });
};

// 获取首页活动信息
export const getIndexActivity = () => {
  return request({
    // url: "/patient/v3/index/getIndexActivity",
    url: "/patient/v3/index/getIndexActivityList",
    method: "get",
  });
};

// 获取文章数据
export const queryArticle = (params: IArticleListReqParams): Promise<IArticleRes> => {
  return request({
    // url: "/patient/v3/article/queryArticle",
    url: "/patient/v3/article/index",
    method: "get",
    params,
  });
};

// 添加医生患者
export const addDoctorPatient = (params: IAddDoctorReqParams) => {
  return request({
    url: "/patient/h5/doctor/addDoctorPatient",
    method: "get",
    params,
  });
};
