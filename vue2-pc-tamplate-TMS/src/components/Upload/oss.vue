<template>
  <div class="pic_upload_container">
    <el-upload
      class="uploader"
      action="#"
      :limit="limit"
      :list-type="listType"
      :on-success="handleSuccess"
      :on-progress="handleProgress"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :show-file-list="showFileList"
      :multiple="false"
      :auto-upload="false"
      :class="{
        picContent: cardStyle === 'picContent',
        picCard: cardStyle === 'picCard',
      }"
    >
      <div slot="trigger">
        <div v-if="cardStyle === 'picContent'" class="picContent_trigger">
          <i class="el-icon-plus uploader-icon"></i>
          <span>上传图片</span>
        </div>
        <div v-else-if="cardStyle === 'videoCard'" class="videoCard_trigger">
          <video
            v-if="videoLink"
            x5-video-player-type="h5-page"
            controlslist="nodownload"
            controls
            style="width: 100%; height: 100%; object-fit: contain"
          >
            <source :src="videoLink" type="video/mp4" />
            Sorry, your browser doesn't support embedded videos.
          </video>
          <i v-if="!videoLink && !videoFlag" class="el-icon-plus uploader-icon"></i>
          <span v-if="videoLink" class="el-upload-list__item-actions">
            <span class="el-upload-list-delete" @click.stop="handleRemoveVideo">
              <i class="el-icon-delete"></i>
            </span>
          </span>
          <el-progress
            v-if="videoFlag"
            type="circle"
            :percentage="videoUploadPercent"
            style="margin-top: 52px"
          />
        </div>
      </div>
    </el-upload>
    <el-dialog
      title="图片预览"
      top="30px"
      :visible.sync="dialogVisible"
      custom-class="standard-dialog"
    >
      <div class="preview">
        <img :src="dialogImageUrl" alt="" />
      </div>
    </el-dialog>
    <el-dialog
      title="图片剪裁"
      width="750px"
      top="30px"
      custom-class="standard-dialog"
      :visible.sync="dialogCropperVisible"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <div class="cropper-content">
        <el-radio-group
          v-if="fixedNumber[0] === 580 || fixedNumber[0] === 360"
          v-model="videoSizeSelect"
          style="marginbottom: 10px"
          @change="handleRadioChange"
        >
          <el-radio :label="0">横版视频封面（580 x 326）</el-radio>
          <el-radio :label="1">竖版视频封面（360 x 640）</el-radio>
        </el-radio-group>
        <div class="cropper" style="text-align: center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :qualityKB="option.qualityKB"
            :qualityTip="option.qualityTip"
            :autoCropWidth="option.fixedNumber[0]"
            :autoCropHeight="option.fixedNumber[1]"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" @click="handleFinishCropper" :loading="cropperLoading">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { Vue, Prop, Component, Model, Ref, Watch } from "vue-property-decorator";
  import { CustomFile, ElementFile } from "./types";
  import OSS from "@/utils/ossFile";
  // Oss 通用 上传图片 功能组件
  @Component({
    name: "OssUpload",
  })
  export default class OssUpload extends Vue {
    @Ref() readonly cropper!: any;
    /**
     * @description 上传图片类型 图文：picContent; 图文card: picCard; 视频card: videoCard
     */
    @Prop({ type: String, default: "picContent" }) readonly cardStyle!: string;
    /**
     * @description 文件列表的类型 text/picture/picture-card
     */
    @Prop({ type: String, default: "picture-card" }) readonly listType!: string;
    /**
     * @description 是否禁用
     */
    @Prop({ type: Boolean, default: false }) readonly disabled!: boolean;
    /**
     * @description 是否显示已上传文件列表
     */
    @Prop({ type: Boolean, default: true }) readonly showFileList!: boolean;
    /**
     * @description 图片尺寸限制宽高比
     */
    @Prop({ type: Array, default: () => [592, 296] }) readonly fixedNumber!: Array<number>;
    /**
     * @description limit
     */
    @Prop({ type: Number, default: 1 }) readonly limit!: number;
    @Model("update", { type: Array, default: () => [] }) imageList!: Array<CustomFile>;

    private dialogCropperVisible = false;
    private cropperLoading = false;
    private dialogVisible = false;
    private videoFlag = false; // 正在上传中;

    private videoUploadPercent: any = 0; // 视频上传进度
    private videoSizeSelect: 0 | 1 = 0; // 裁剪v-model

    private dialogImageUrl = "";
    private videoLink = ""; // 上传成功后的视频链接

    private fileList: Array<CustomFile> = [];

    // 裁剪组件的基础配置option
    private option = {
      name: "", // 裁剪图片名称
      img: "", // 裁剪图片的地址
      outputSize: 1, // 裁剪生成图片的质量
      outputType: "png", // 裁剪生成图片的格式
      canScale: false, // 图片是否允许滚轮缩放
      autoCrop: true, // 是否默认生成截图框
      fixedBox: true, // 固定截图框大小 不允许改变
      fixed: true, // 是否开启截图框宽高固定比例
      fixedNumber: this.fixedNumber, // 截图框的宽高比例
      qualityKB: 5 * 1024 * 1024, //图片限制质量
      qualityTip: "5M", //图片限制质量说明
      full: false, // 是否输出原图比例的截图
      canMoveBox: true, // 截图框能否拖动
      original: false, // 上传图片按照原始比例渲染
      centerBox: false, // 截图框是否被限制在图片里面
      infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    };

    @Watch("imageList", { immediate: true })
    imageListChange(val: Array<CustomFile>) {
      this.fileList = val;
      if (this.cardStyle === "videoCard") {
        this.videoLink = val[0]?.url;
      }
    }
    @Watch("fixedNumber", { deep: true })
    fixedNumberChange(val: Array<number>) {
      if (val[0] === 360) {
        this.videoSizeSelect = 1;
        // 竖版视频封面
        this.option.fixedNumber = [360, 640];
      } else {
        this.videoSizeSelect = 0;
        // 横版视频封面
        this.option.fixedNumber = [580, 326];
      }
    }
    private handleSuccess(res: unknown, file: ElementFile, fileList: Array<ElementFile>) {
      console.log("handleSuccess", res, file, fileList);
    }
    private checkScale(file: File, fixedNumber: Array<number>) {
      return new Promise((resolve, reject) => {
        const width = fixedNumber[0] || 0;
        const height = fixedNumber[1] || 0;
        const _URL = window.URL || window.webkitURL;
        const img: any = new Image();

        img.onload = () => {
          let valid = true;
          valid = img.width === width && img.height === height;
          valid ? resolve(true) : reject();
        };

        img.src = _URL.createObjectURL(file);
      });
    }
    private checkVideoInfo(file: File) {
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL;
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
          _URL.revokeObjectURL(video.src);
          const duration = video.duration; // 得到时长
          const height = video.videoHeight;
          const width = video.videoWidth;
          if (width / height !== 16 / 9 && width / height !== 9 / 16) {
            reject("视频尺寸不满足要求，横版视频尺寸：16:9，竖版视频尺寸：9:16");
          }
          if (duration > 60) {
            reject("视频时长不能超过1分钟！");
          }
          this.$emit("uploaded", { width, height, duration });
          resolve(true);
        };
        video.src = URL.createObjectURL(file);
      });
    }
    private async handleChange(file: ElementFile) {
      this.fileList = []; // 置空处理，等真正上传后，才展示
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isGIF = file.raw.type === "image/gif";
      const isLt5M = file.raw.size / 1024 / 1024 < 5;
      const isLt500M = file.raw.size / 1024 / 1024 < 500;
      const isMp4 = file.raw.type === "video/mp4";
      if (this.cardStyle === "picContent") {
        // 验证图片尺寸，不满足 不能进行上传
        if (!isLt5M || (!isJPG && !isPNG && !isGIF)) {
          this.$message.error("请上传5MB以内，格式为jpg,png,gif的图片!");
          this.$emit("update", []);
          return false;
        }
      } else if (this.cardStyle === "picCard") {
        if (!isLt5M || (!isJPG && !isPNG)) {
          this.$message.error("请上传5MB以内，格式为jpg,png的图片!");
          this.$emit("update", []);
          return false;
        }
      } else if (this.cardStyle === "videoCard") {
        try {
          if (!isMp4) {
            this.$message.error("请上传格式为MP4的视频");
            this.$emit("update", []);
            return false;
          }
          if (!isLt500M) {
            this.$message.error("请上传500MB以内的视频");
            this.$emit("update", []);
            return false;
          }
          await this.checkVideoInfo(file.raw);
        } catch (error) {
          this.$message.error(error);
          this.$emit("update", []);
          return false;
        }
      }
      //上传阿里云服务器
      if (this.cardStyle === "picContent") {
        OSS.put(file.name, file.raw).then((result: any) => {
          this.fileList = [{ url: result.url, name: result.name }];
          this.$emit("update", this.fileList);
        });
      } else if (this.cardStyle === "videoCard") {
        this.videoFlag = true;
        OSS.multipartUpload(file.name, file.raw, (p) => {
          // console.log(checkpoint); // 断点续传使用
          this.videoUploadPercent = Math.floor(p * 100);
        })
          .then((result: any) => {
            this.videoFlag = false;
            this.videoUploadPercent = 0;
            const { bucket, name } = result;
            // 生成文件下载地址
            this.videoLink = `http://${bucket}.oss-cn-beijing.aliyuncs.com/${name}`;
            this.$emit("update", [{ url: this.videoLink, name }]);
          })
          .catch(() => {
            this.videoFlag = false;
            this.videoUploadPercent = 0;
          });
      } else if (this.cardStyle === "picCard") {
        // 上传成功后将图片地址赋值给裁剪框显示图片
        this.checkScale(file.raw, this.option.fixedNumber)
          .then(() => {
            OSS.put(file.name, file.raw).then((result: any) => {
              this.fileList = [{ url: result.url, name: result.name }];
              this.$emit("update", this.fileList);
            });
          })
          .catch(() => {
            this.$nextTick(() => {
              this.option.img = file.url;
              this.option.name = file.name;
              this.dialogCropperVisible = true;
            });
          });
      }
    }
    private handleRemove(file: ElementFile, fileList: Array<ElementFile>) {
      this.fileList = fileList;
      this.$emit("update", this.fileList);
    }
    private handleRemoveVideo() {
      // 清空裁剪未完成的文件
      this.fileList = [];
      this.videoLink = "";
      this.$emit("update", []);
    }
    // 文件正在上传时的钩子
    private handleProgress() {
      console.log("handleProgress");
    }
    private handlePictureCardPreview(file: CustomFile) {
      this.dialogVisible = true;
      this.dialogImageUrl = file.url;
    }
    private handleCloseDialog() {
      this.dialogCropperVisible = false;
      // 清空裁剪未完成的图片
      this.fileList = [];
      this.$emit("update", []);
    }
    private handleRadioChange(val: number) {
      if (val) {
        // 竖版视频封面
        this.option.fixedNumber = [360, 640];
      } else {
        // 横版视频封面
        this.option.fixedNumber = [580, 326];
      }
    }
    private async handleFinishCropper() {
      // 裁剪完成，进行上传
      this.cropper.getCropBlob((data: File) => {
        this.cropperLoading = true;
        //上传阿里云服务器
        OSS.put(this.option.name, data)
          .then((result: any) => {
            this.dialogCropperVisible = false;
            this.cropperLoading = false;
            this.fileList = [{ url: result.url, name: result.name }];
            this.$emit("update", this.fileList);
          })
          .catch(() => {
            this.cropperLoading = false;
          });
      });
    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/var.less";
  .pic_upload_container {
    .uploader {
      line-height: 1;
      /deep/.el-upload-list__item {
        transition: none !important;
        margin: 0;
      }
      /deep/ .el-upload-list__item {
        position: absolute;
        left: 0;
      }
      &.picContent {
        position: relative;
        /deep/ .el-upload-list__item,
        /deep/ .el-upload--picture-card {
          width: 104px;
          height: 104px;
        }
      }
      &.picCard {
        /deep/ .el-upload-list__item,
        /deep/ .el-upload--picture-card {
          width: 352px;
          height: 228px;
        }
      }
      .picContent_trigger {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 104px;
        height: 104px;
        line-height: 1;
        & > span {
          color: #666666;
        }
      }
      .picCard_trigger {
        font-size: 28px;
        color: #8c939d;
        width: 352px;
        height: 228px;
        line-height: 228px;
        text-align: center;
      }
      .videoCard_trigger {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 352px;
        height: 228px;
        line-height: 228px;
        text-align: center;
        &:hover {
          border-color: #664ae1;
        }
        .el-upload-list__item-actions {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          cursor: pointer;
          text-align: center;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          transition: opacity 0.3s;
          .el-icon-delete {
            color: #fff;
            line-height: 228px;
          }
          &:hover {
            opacity: 1;
          }
        }
      }
      .uploader-icon {
        font-size: 24px;
        color: #999999;
        text-align: center;
        margin: 0 0 14px 0;
      }
    }
  }
  // 截图
  .cropper-content {
    .cropper {
      width: auto;
      height: 660px;
    }
  }
  .preview {
    text-align: center;
    & > img {
      padding-bottom: 40px;
      border: 1px solid #f5f5f5;
    }
  }
</style>
