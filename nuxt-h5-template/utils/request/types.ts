export interface Result<T = any> {
  status: number;
  message: string;
  data: T;
}

export interface UploadFileParams {
  // 其他参数
  data?: { [key: string]: any };
  // 文件参数的接口字段名
  name?: string;
  // 文件
  file: File | Blob;
  // 文件名
  filename?: string;
  [key: string]: any;
}
