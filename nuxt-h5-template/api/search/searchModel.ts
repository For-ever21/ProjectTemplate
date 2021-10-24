/*
 * @Author         : Qiao
 * @Date           : 2021-02-25 14:54:43
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-05 17:15:42
 * @FilePath       : \api\model\searchModel.ts
 * @Description    : 搜索功能接口返回数据
 */

/* 搜索请求数据 */
export interface SearchPost {
  keyWord: String;
  pageNum: number;
  pageSize: number;
  type: number | String;
  userId?: String;
}

/* 搜索请求数据 */
export interface FindKeywordById {
  id: String;
}
