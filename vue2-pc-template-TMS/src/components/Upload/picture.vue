<script>
  import uploadPicture from "@wenwo-public-elementui/picture-uploader-ui";
  import { uploadPictureApi } from "@/modules/project/api";
  export default {
    functional: true,
    render(createElement, context) {
      context.data.class = "custom-uploader";
      context.data.props = {
        uploadPictureApi: uploadPictureApi,
        accept: "image/jpeg,image/jpg,image/png",
      };
      // const readFileSuccessHandler = (data) => {
      //   console.log(data);
      // };
      // const uploadSuccessHandler = (data) => {
      //   console.log(data);
      // };
      // context.data.on = {
      //   "read-file-success": readFileSuccessHandler,
      //   "upload-success": uploadSuccessHandler,
      // };
      return createElement(uploadPicture, context.data, context.children);
    },
  };
</script>
<style lang="less" scoped>
  .custom-uploader {
    width: 320px;
    height: 140px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
  }
  // /deep/img {
  //   object-fit: contain;
  // }
</style>
