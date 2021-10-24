import { request } from "@/utils/request/api";

import {
  IFindDoctorReqParams,
  IGetLabelPageByDepartmentIdReqParams,
  IFindDoctorRes,
} from "@/api/zmy/zmyModel";

// 获取金牌科室接口
export const getDoctorPageFitment = () => {
  return request({
    url: "/patient/v3/department/getDoctorPageFitment",
    method: "get",
  });
};

// 获取科室列表
export const findDepartmentCondition = () => {
  return request({
    url: "/patient/v3/condition/v2/findDepartmentCondition",
    method: "get",
  });
};

// 获取地址列表
export const findCityCondition = () => {
  return request({
    url: "/patient/v3/condition/findCityCondition",
    method: "get",
  });
};

// 获取综合排序筛选接口
export const findMainCondition = () => {
  return request({
    url: "/patient/v3/condition/v2/findMainCondition",
    method: "get",
  });
};

// 获取更多筛选排序筛选接口
export const findMoreCondition = () => {
  return request({
    url: "/patient/v3/condition/v2/findMoreCondition",
    method: "get",
  });
};

// 获取综合排序、更多筛选接口（上面两个接口整合为一个）
export const findCondition = () => {
  return request({
    url: "/patient/v3/condition/findCondition",
    method: "get",
  });
};

// 通过科室id获取科室标签接口
export const getLabelPageByDepartmentId = (params: IGetLabelPageByDepartmentIdReqParams) => {
  return request({
    url: "/patient/v3/label/getLabelPageByDepartmentId",
    method: "get",
    params,
  });
};

// 筛选医生接口
export const findDoctor = (data: IFindDoctorReqParams): Promise<IFindDoctorRes> => {
  return request({
    url: "/patient/v3/doctor/v2/findDoctor",
    method: "post",
    data,
  });
};
