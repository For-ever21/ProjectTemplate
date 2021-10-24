import { request, requestUrlencoded } from "@/utils/request/api";

import { Ipage } from "@/api/baseModel";

import {
  FindAddressById,
  SaveAddress,
  ImyPrescriptionReq,
  ImyPrescriptionRes,
  FindMyDoctorPageReq,
  FindMyDoctorPageRes,
  pagePersonalCommunityReq,
  pagePersonalCommunityRes,
  findUserFavoritesRes,
  FamilyMemberPageRes,
  FamilyMemberItem,
} from "./mineModel";

// ======= 我的问诊  =========

// ======= 我的处方  =========

// 获取 我的处方 列表
export const getMyPrescription = (params: ImyPrescriptionReq): Promise<ImyPrescriptionRes> => {
  return request({
    url: `/patient/h5/prescription/myPrescription`,
    method: "get",
    params,
  });
};

// ======= 我的医生  =========

// 我的医生分页列表(分页)
export const findMyDoctorPage = (data: FindMyDoctorPageReq): Promise<FindMyDoctorPageRes> => {
  return request({
    url: `/patient/v3/doctor/findMyDoctorPage`,
    method: "post",
    data,
  });
};

// 取消关注 医生
export const unsubscribeDoctor = (params: { doctorId: string }) => {
  return request({
    url: "/patient/v3/doctor/unsubscribeDoctor",
    method: "get",
    params,
  });
};

// ======= 我的社区  =========

// 我的社区分页列表(分页)
export const pagePersonalCommunity = (
  data: pagePersonalCommunityReq
): Promise<pagePersonalCommunityRes> => {
  return requestUrlencoded({
    url: `/patient/v3/community/pagePersonalCommunity`,
    method: "post",
    data,
  });
};

// 取消关注 社区
export const unfollowCommunity = (data: { communityId: string }) => {
  return requestUrlencoded({
    url: "/patient/v3/community/unfollowCommunity",
    method: "post",
    data,
  });
};

// ======= 我的收藏  =========
// 获取患者我的收藏列表(分页)
export const findUserFavoritesPage = (data: Ipage): Promise<findUserFavoritesRes> => {
  return requestUrlencoded({
    url: "/patient/h5/collection/findUserFavoritesPage",
    method: "post",
    data,
  });
};

// ======= 我的地址  =========

// 获取我的收货地址
export const findAddress = () => {
  return request({
    url: "/patient/h5/address/findAddress",
    method: "get",
  });
};

// 通过id获取地址详情
export const findAddressById = (params: FindAddressById) => {
  return request({
    url: "/patient/h5/address/findAddressById",
    method: "get",
    params,
  });
};

// 保存地址
export const saveAddress = (data: SaveAddress) => {
  return request({
    url: "/patient/h5/address/saveAddress",
    method: "post",
    data,
  });
};

// 根据地址id查询地址详情
export const removeAddress = (params: FindAddressById) => {
  return request({
    url: "/patient/h5/address/removeAddress",
    method: "get",
    params,
  });
};
// 获取城市地址列表
export const getCityInfos = () => {
  return request({
    url: "/patient/v3/condition/getCityInfos",
    method: "get",
  });
};

// ======= 就诊人管理  =========
// 分页查询家庭成员信息
export const findFamilyMemberPage = (data: Ipage): Promise<FamilyMemberPageRes> => {
  return requestUrlencoded({
    url: "/patient/h5/familymembers/findFamilyMemberPage",
    method: "post",
    data,
  });
};
// 删除家庭成员信息列表
export const removeFamilyMember = (data: { mid: string }) => {
  return requestUrlencoded({
    url: "/patient/h5/familymembers/removeFamilyMember",
    method: "post",
    data,
  });
};
// 添加家庭成员
export const addFamilyMember = (data: FamilyMemberItem) => {
  return requestUrlencoded({
    url: "/patient/h5/familymembers/addFamilyMember",
    method: "post",
    data,
  });
};
// 修改家庭成员信息
export const updateFamilyMember = (data: FamilyMemberItem | { id: string }) => {
  return requestUrlencoded({
    url: "/patient/h5/familymembers/updateFamilyMember",
    method: "post",
    data,
  });
};
// 根据成员mid查询用户的家庭成员信息
export const findFamilyMemberById = (data: { mid: string }): Promise<FamilyMemberItem> => {
  return requestUrlencoded({
    url: "/patient/h5/familymembers/findFamilyMemberById",
    method: "post",
    data,
  });
};

// ======= 设置  =========
