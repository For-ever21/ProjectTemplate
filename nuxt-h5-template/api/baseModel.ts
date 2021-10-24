/**
 * @description: 页码
 */
export interface Ipage {
  pageNum: number;
  pageSize: number;
}

/**
 * @description: 分页接口 list基础字段
 */
export interface IpageList<T> extends Ipage {
  list: Array<T>;
  total: number;
  totalPage: number;
}

/**
 * @description: 分页接口rows基础字段
 */
export interface IpageRows<T> extends Ipage {
  rows: Array<T>;
  total: number;
  totalPage: number;
  nextPageNum: number; // 下一页页码，没有下一页返回 0
}

/**
 * @description: 上传图片 入参
 */
export interface UploadImgReq {
  fileName: string;
  image: File | Blob;
  file: File | Blob;
}

/**
 * @description: 上传图片 返回数据
 */
export interface UploadImgRes {
  id: string;
  url: string;
}
