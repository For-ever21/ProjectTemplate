import { Message, Notification } from "element-ui";
import { getOssConfigStorage, setOssConfigStorage } from "@/utils/auth";
import { getOssConfig } from "@/modules/wax/api/common";
import store from "@/store";
// 初始化 oss 对象
async function initOSSClient() {
  const OSS = require("ali-oss");
  let ossClient = null;
  const ossConfigStr = getOssConfigStorage();
  if (ossConfigStr) {
    let ossConfigObj = {};
    try {
      ossConfigObj = JSON.parse(ossConfigStr);
    } catch (error) {
      ossConfigObj = {};
    }
    ossClient = new OSS(ossConfigObj);
  } else {
    // 重新拉取 oss配置
    try {
      const configData = await getOssConfig();
      ossClient = new OSS(configData);
      setOssConfigStorage(JSON.stringify(configData));
    } catch (error) {
      Message.error("暂时无法上传，请稍后再试！");
    }
  }
  return ossClient;
}

// oss上传文件
export default {
  // 普通上传
  put(name: string, file: File) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const client = await initOSSClient();
        const suffix = name.substr(name.indexOf(".")); // 文件后缀
        const filename = Date.parse(new Date().toString()) + suffix.toLowerCase(); // 组成新文件名
        const dirName = store.getters.getterUserInfo.userId;
        const result = await client.put(`${dirName}/${filename}`, file);
        resolve(result);
        Notification({
          title: "操作成功",
          message: "上传成功！",
          type: "success",
          duration: 2000,
        });
      } catch (e) {
        Message.error("上传图片失败，请稍后再试！");
        console.log(e);
        reject(e);
      }
    });
  },
  // 分片上传
  multipartUpload(name: string, file: File, callback?: (args: any, args2: any) => any) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const client = await initOSSClient();
        const suffix = name.substr(name.indexOf(".")); // 文件后缀
        const filename = Date.parse(new Date().toString()) + suffix.toLowerCase(); // 组成新文件名
        const dirName = store.getters.getterUserInfo.userId;
        const result = await client.multipartUpload(`${dirName}/${filename}`, file, {
          progress: (p: any, checkpoint: string) => {
            if (callback) callback(p, checkpoint);
          },
        });
        resolve(result);
        Notification({
          title: "操作成功",
          message: "上传成功！",
          type: "success",
          duration: 2000,
        });
      } catch (e) {
        Message.error("上传失败，请稍后再试！");
        console.log(e);
        reject(e);
      }
    });
  },
};
