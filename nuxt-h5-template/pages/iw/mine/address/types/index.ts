/*
 * @Author         : Qiao
 * @Date           : 2021-03-17 11:25:31
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-17 11:32:05
 * @FilePath       : /pages/mine/address/types/index.ts
 * @Description    : 收获地址ts接口
 */

/* 选择地址组件返回数据 */
export interface SelectCityReturn {
  provinceId: string | number;
  provinceName: string;
  cityId: string | number;
  cityName: string;
  areaId: string | number;
  areaName: string;
  [propName: string]: any;
}
