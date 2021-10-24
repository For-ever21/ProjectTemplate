/*
 * @Author: 李才人
 * @Date: 2021-06-15 15:31:41
 * @LastEditors: 李才人
 * @LastEditTime: 2021-07-02 14:41:44
 * @FilePath: \c-platform-h5-nuxt\pages\iw\msg\common\index.ts
 * @Description: 服务通知/订阅通知/系统通知通用方法
 */
import { Notify, Toast } from "vant";
import { ReadMessage, ReadMessageBatch, DelMessage } from "@/api/msg/msgService";
import { ReadMessageClick } from "@/api/msg/msgModel";
// export let deleteServiceMessage = (e: any) => {
//   console.log("跳转消息详情页面", e, );
//   Dialog.confirm({
//     message: "确认需要删除？",
//     confirmButtonText: "确认删除",
//     confirmButtonColor: "#ee0a24",
//   })
//     .then(() => {
//       Toast.success(`删除成功，id-${e.setId}`);
//       const params = {
//         id: "666",
//       };
//       // DelMessage(params)
//       //   .then(() => {
//       //     Toast.success("删除单条消息");
//       //   })
//       //   .catch(() => {});
//     })
//     .catch(() => {
//       // on cancel
//     });
// }

// @ 单条已读消息
export const setReadMessage = (params: ReadMessageClick, cb?: Function) => {
  const paramsObj = {
    id: params.id,
  };
  ReadMessage(paramsObj)
    .then(() => cb && cb())
    .catch((error) => {
      console.error(error);
      window.location.href = params.link;
    });
};

// @ 批量设置已读消息
export const setReadMessageBatch = (type: string, cb: Function) => {
  const params = {
    type,
  };
  ReadMessageBatch(params)
    .then(() => cb && cb())
    .catch((error) => {
      console.log(error);
      Toast(error.message);
    });
};

// @ 删除消息
export const deleteMessage = (id: string | number, cb?: Function) => {
  // Notify({ type: "success", message: "删除成功" });
  const params = {
    id,
  };
  DelMessage(params)
    .then(() => {
      Notify({ type: "success", message: "删除成功" });
      cb && cb();
    })
    .catch((error) => {
      console.log(error);
      Toast(error.message);
    });
};

// @ 优化下拉加载数据显示
export const showListPadding = (arr: any) => {
  return arr.length <= 4 ? "120px" : "";
};
