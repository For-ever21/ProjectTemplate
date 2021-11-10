/**
 * @description: 页码
 */
export interface Page {
  pageNum: number;
  pageSize: number;
}

/**
 * @description: 后台返回list基础字段
 */
export interface PageList<T> extends Page {
  rows: Array<T>;
  total: number;
  totalPage: number;
  nextPageNum: number; // 下一页页码，没有下一页返回 -1
}
