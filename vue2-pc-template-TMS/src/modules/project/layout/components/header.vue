<template>
  <header class="header">
    <div class="left">
      <div class="logo">
        <img src="@/modules/project/assets/image/logo.png" alt="tms" />
      </div>
      <el-divider class="divider" direction="vertical" />
      <el-button type="text" icon="el-icon-arrow-left" @click="openBackDialog">返回</el-button>
      <div class="name" @click="handleEdit">{{ activityInfo.name || "新建活动名称" }}</div>
      <!-- 暂时不展示编辑图标 -->
      <!-- <div class="name-edit pointer">
        <svg-icon iconClass="edit" @click.native="handleEdit" />
      </div> -->
    </div>
    <div class="right">
      <i class="el-icon-view pointer" @click="handlePreview"></i>
      <el-button type="primary" @click="handleSubmit">发布活动</el-button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="backDialogVisible"
      width="444px"
      :close-on-click-modal="false"
      :show-close="false"
      custom-class="iw-dialog"
      append-to-body
    >
      <span>确定返回吗？返回后所有内容都将不保存</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="goBack">确 定</el-button>
        <el-button size="mini" @click="backDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="submitDialogVisible"
      width="444px"
      :close-on-click-modal="false"
      :show-close="false"
      custom-class="iw-dialog"
      append-to-body
    >
      <span>确定发布吗？发布后所有活动内容都将无法编辑</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" :loading="submitLoading" type="primary" @click="onSubmit">
          确 定
        </el-button>
        <el-button size="mini" @click="submitDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="validateDialogVisible"
      width="444px"
      :close-on-click-modal="false"
      show-close
      custom-class="iw-dialog"
      append-to-body
    >
      <div class="checkDialog">
        <span>以下内容需要填写：</span>
        <p v-for="(item, index) in validateArr" :key="index">{{ index + 1 + "." + item }}</p>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="previewDialogVisible"
      top="50px"
      custom-class="preview-dialog"
      append-to-body
      destroy-on-close
    >
      <preview />
    </el-dialog>
  </header>
</template>
<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import projectStore from "@/modules/project/store";
  import loginStore from "@/modules/login/store";
  import { saveActivityApi } from "@/modules/project/api";
  import preview from "@/modules/project/component/editor/preview.vue";
  import { isValidURL } from "@/utils/validateUtil";
  @Component({
    name: "LayoutHeader",
    components: { preview },
  })
  export default class LayoutHeader extends Vue {
    private backDialogVisible = false;
    private submitDialogVisible = false;
    private validateDialogVisible = false;
    private previewDialogVisible = false;
    private submitLoading = false;
    private editCount = 0;
    private validateArr: string[] = [];
    get templateComp() {
      return projectStore.getTemplateComp;
    }
    get activityInfo() {
      return projectStore.getActivityInfo;
    }
    @Watch("activityInfo", { deep: true })
    activityInfoChange() {
      this.editCount++;
    }
    private handleSubmit() {
      if (!projectStore.getTemplateComp.length) {
        this.$message.error("未获取到有效的模板信息，无法发布活动");
        return false;
      }
      //  校验规则用
      const formRefsList: any = projectStore.getFormRefsList;
      const activityArr = this.getValidateActivitynfo();
      const compArr = this.getValidateCompInfo();
      const errorArr = activityArr.concat(compArr);
      let isValid = true; // 表单校验 flag

      // 获取sku规格校验form组件
      const skuRefList: any = this.$parent.$children[3].$refs.skuRef;
      console.log(skuRefList, "skuRefList");

      // 触发表单校验
      for (let i = 0; i < formRefsList.length; i++) {
        formRefsList[i].validate((valid: boolean) => {
          if (!valid) {
            isValid = false;
          }
        });
      }
      for (let i = 0; i < skuRefList.length; i++) {
        skuRefList[i].getFormRef().validate((valid: boolean) => {
          if (!valid) {
            isValid = false;
          }
        });
      }
      if (isValid && !errorArr.length) {
        this.submitDialogVisible = true;
      } else {
        this.validateArr = errorArr;
        this.validateDialogVisible = true;
      }
    }
    // 发布活动
    private onSubmit() {
      this.submitDialogVisible = true;
      const activityReq = JSON.parse(JSON.stringify(this.activityInfo));
      const templateComp = JSON.parse(JSON.stringify(this.templateComp));
      templateComp.splice(1, 1); // hack 处理，去掉广告图额外生成的组件数据
      activityReq.channel = activityReq.channel.join(",");
      activityReq.startTime = activityReq.time[0];
      activityReq.endTime = activityReq.time[1];
      activityReq.spuId = templateComp[0].attributeJson?.spuId;
      activityReq.spuName = templateComp[0].attributeJson?.spuName;
      activityReq.contentJson = JSON.stringify(templateComp);
      activityReq.updator = loginStore.getterUserName;
      delete activityReq.time;
      this.submitLoading = true;
      saveActivityApi(activityReq)
        .then(() => {
          // 创建活动成功
          this.$notify({
            title: "操作成功",
            message: "创建活动成功",
            type: "success",
            duration: 2000,
          });
          if (process.env.NODE_ENV === "production") {
            this.goBack();
          }
          this.submitDialogVisible = false;
        })
        .catch(() => {
          this.$message.error("新建活动失败");
        })
        .finally(() => {
          this.submitLoading = false;
        });
    }
    private handlePreview() {
      // 预览
      this.previewDialogVisible = true;
    }
    private openBackDialog() {
      if (this.editCount > 1) {
        // 有修改活动信息，就弹出弹窗确认
        this.backDialogVisible = true;
      } else {
        this.goBack();
      }
    }
    private goBack() {
      // 返回爱问大后台页面
      window.location.href = process.env.VUE_APP_ADMIN_WENWO + "#/marketingCenter/activityManage";
    }
    private handleEdit() {
      if (this.$route.name !== "template") {
        this.$router.push({
          name: "template",
        });
        projectStore.compActiveAction("");
        projectStore.editorActiveIndexAction(0);
      }
    }
    private getValidateCompInfo() {
      let arr: string[] = [];
      const templateComp = projectStore.getTemplateComp;
      templateComp.forEach((item: any) => {
        if (item.category === "goods") {
          const attributeJson = item.attributeJson;
          if (!attributeJson.spuId) arr.push(`商品信息的SPU-ID`);
          attributeJson.skuList.forEach((citem: any, index: number) => {
            if (!citem.maxPrice || !citem.maxPrice) {
              arr.push(`规格${index + 1}的价格区间`);
            }
            if (!citem.specificationName) {
              arr.push(`规格${index + 1}的规格名称`);
            }
          });
        }
        if (item.category === "image") {
          const attributeJson = item.attributeJson;
          const linkUrl = attributeJson.imageInfo[0]?.linkUrl;
          if (!attributeJson.imageInfo[0].imgUrl) arr.push(`${item.descrition}的图片内容`);
          if (!isValidURL(linkUrl) && linkUrl) arr.push(`${item.descrition}的图片链接地址有误`);
        }
        if (item.category === "sku") {
          const attributeJson = item.attributeJson;
          if (!attributeJson.buttonName) arr.push(`预约组件的按钮名称`);
        }
        if (item.category === "button") {
          const attributeJson = item.attributeJson;
          if (!attributeJson.buttonName) arr.push(`按钮组件的按钮名称`);
        }
      });
      return arr;
    }
    private getValidateActivitynfo() {
      let arr = [];
      const formDict: any = {
        name: "活动名称",
        time: "活动时间",
        investmentTime: "招商截止时间",
        descrition: "活动说明",
      };
      const activityInfo: any = projectStore.getActivityInfo;
      for (let key in formDict) {
        if (!activityInfo[key] || !activityInfo[key].length) {
          arr.push(`活动信息的${formDict[key]}`);
        }
      }
      return arr;
    }
  }
</script>

<style lang="less" scoped>
  .header {
    position: relative;
    z-index: 9;
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    .left,
    .right {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .logo {
      width: 90px;
      height: 30px;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
    .el-button--text {
      color: #333333;
      &:hover {
        color: #666;
      }
    }
    .name {
      margin-left: 40px;
      margin-right: 4px;
      cursor: pointer;
    }
    .divider {
      height: 30px;
      background: #e5e5e5;
      margin: 0 20px;
    }
    .icon {
      font-size: 20px;
      margin: 10px;
    }
    .right {
      padding-right: 20px;
      .el-icon-view {
        // width: 21px;
        font-size: 18px;
        margin-right: 20px;
      }
    }
  }
  /deep/.el-dialog__body .checkDialog {
    text-align: left;
    max-height: 700px;
    overflow-y: auto;
  }
</style>
