<template>
  <section class="image_handle">
    <left-panel class="left-panel">
      <el-divider class="iw-divider">基础样式</el-divider>
      <div class="comp_list">
        <div
          class="item"
          :class="{ active: active === basicsImageDefault }"
          @click="handleClickItem(basicsImageDefault)"
        >
          <img class="img" src="@/modules/project/assets/image/pic_default.png" alt="默认图片" />
          <div class="label">默认样式</div>
        </div>
      </div>
    </left-panel>
    <right-panel class="right-panel">
      <div class="title">图片内容</div>
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="96px"
        label-position="left"
        class="iw-form"
      >
        <el-form-item class="no-label" label="" prop="imgUrl">
          <uploadPicture v-model="form.imgUrl" :maxSize="10" showProgress tipText="添加图片" />
        </el-form-item>
        <el-form-item label="链接" prop="linkUrl">
          <el-input v-model="form.linkUrl" />
        </el-form-item>
        <!-- <div style="padding: 0 20px">
          <el-divider />
        </div>
        <div class="replace_img">
          <el-image :src="form.imgUrl" />
          <div class="action">替换</div>
        </div> -->
      </el-form>
    </right-panel>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import leftPanel from "@/modules/project/component/leftPanel.vue";
  import rightPanel from "@/modules/project/component/rightPanel.vue";
  import uploadPicture from "@/components/Upload/picture.vue";
  import { CompCodeEnum } from "@/modules/project/enum";
  import projectStore from "@/modules/project/store";

  import { isValidURL } from "@/utils/validateUtil";

  @Component({
    name: "ImageHandle",
    components: { leftPanel, rightPanel, uploadPicture },
  })
  export default class ImageHandle extends Vue {
    // data 数据源
    @Prop({ required: false, type: Object }) readonly data!: any;
    private active = "";
    private form = {
      imgUrl: "",
      linkUrl: "",
    };
    private validator = {
      validateUrl: (_rule: string, value: string, callback: Function) => {
        if (isValidURL(value) || !value) {
          callback();
        } else {
          callback(new Error("请输入正确格式的链接"));
        }
      },
    };
    private rules = {
      imgUrl: [{ required: true, message: "请上传图片" }],
      linkUrl: [{ validator: this.validator.validateUrl, trigger: "blur" }],
    };
    get templateComp() {
      return projectStore.getTemplateComp;
    }
    get editorActiveIndex() {
      return projectStore.getEditorActiveIndex;
    }
    get basicsImageDefault() {
      return CompCodeEnum["basics-image-default"];
    }
    private created() {
      // 获取组件属性值
      this.active = this.data.code;
      if (this.data.code === this.basicsImageDefault) {
        // 默认单图 取值
        this.form = this.data.attributeJson.imageInfo[0];
      }
    }
    private handleClickItem(val: CompCodeEnum) {
      this.active = val;
      const templateComp = this.templateComp;
      templateComp[this.editorActiveIndex].code = val;
    }
  }
</script>

<style lang="less" scoped>
  .image_handle {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    .left-panel {
      padding: 40px;
    }
    .right-panel {
      .replace_img {
        margin: 0 20px;
        width: 320px;
        height: 140px;
        border-radius: 4px;
        border: 1px dotted #e5e5e5;
        position: relative;
        .el-image {
          width: 280px;
          height: 100%;
          margin-left: 20px;
        }
        .action {
          width: 320px;
          height: 31px;
          line-height: 31px;
          background: #000;
          opacity: 0.4;
          position: absolute;
          color: #fff;
          text-align: center;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          bottom: 0;
          cursor: pointer;
        }
      }
    }
  }
</style>
