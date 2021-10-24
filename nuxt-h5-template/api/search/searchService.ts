/*
 * @Author         : Qiao
 * @Date           : 2021-02-25 14:44:57
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-05 17:23:46
 * @FilePath       : \api\search\index.ts
 * @Description    : 搜索功能接口
 */

import { request } from "@/utils/request/api";
import { SearchPost, FindKeywordById } from "@/api/search/searchModel";

// 搜索页面获取搜索记录
export const getSearchHistory = () => {
  return request({
    url: "/patient/v3/search/history",
    method: "get",
  });
};
// 清除历史搜索记录
export const clearSearchHistory = () => {
  return request({
    url: "/patient/v3/search/history/clear",
    method: "get",
  });
};

// 获取热搜关键词、热搜医生
export const getHotKeywordGroup = () => {
  return request({
    url: "/patient/v3/search/hotKeywordGroup",
    method: "get",
  });
};

// 搜索结果页获取运营位内容
export const getOperationConfig = () => {
  return request({
    url: "/patient/v3/search/getOperationConfig",
    method: "get",
  });
};

// 通过id获取关键词
export const findKeywordById = (params: FindKeywordById) => {
  return request({
    url: "/patient/v3/search/findKeywordById",
    method: "get",
    params,
  });
};

/* 搜索结果页请求数据 */
export const search = (data: SearchPost) => {
  return request({
    url: "/patient/v3/search",
    method: "post",
    data,
  });
};
