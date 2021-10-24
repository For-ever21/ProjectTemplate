import { uploadFile } from "@/utils/request/api";
import { UploadImgReq, UploadImgRes } from "./baseModel";

// 上传图片
export const uploadImg = (data: UploadImgReq): Promise<UploadImgRes> => {
  return uploadFile(
    {
      url: `/patient/h5/img/uploadImg`,
    },
    data
  );
};
