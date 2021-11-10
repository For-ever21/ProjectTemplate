<template>
  <section class="sku_handle">
    <left-panel>
      <el-divider class="iw-divider">基础样式</el-divider>
      <div class="comp_list">
        <div
          class="item"
          :class="{ active: active === marketingSkuDefault }"
          @click="handleClickItem(marketingSkuDefault)"
        >
          <img class="sku" src="@/modules/project/assets/image/sku_comp.png" />
        </div>
      </div>
    </left-panel>
    <right-panel>
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="96px"
        label-position="left"
        class="iw-form"
      >
        <div class="title">预约信息</div>
        <el-form-item label="按钮文案" prop="buttonName">
          <el-input v-model="form.buttonName" />
        </el-form-item>
        <!-- TODO: 第一期不做
        <div style="padding: 0 20px">
          <el-divider />
        </div>
        <div class="title">单选按钮设置</div>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="选项" prop="name">
          <el-input v-model="form.name" type="textarea" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="样式" prop="name">
          <el-radio v-model="form.name" label="1">一行一个</el-radio>
          <el-radio v-model="form.name" label="2">一行两个</el-radio>
        </el-form-item>
        <el-form-item label="必填" prop="name">
          <el-switch v-model="form.name" />
        </el-form-item>
        <div style="padding: 0 20px">
          <el-divider />
        </div>
        <div class="title">地址内容</div>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="提示文案" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址详情" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="必填" prop="name">
          <el-switch v-model="form.name" />
        </el-form-item>
        <div style="padding: 0 20px">
          <el-divider />
        </div>
        <div class="title">日期时间设置</div>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="必填" prop="name">
          <el-switch v-model="form.name" />
        </el-form-item>
        -->
      </el-form>
    </right-panel>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import leftPanel from "@/modules/project/component/leftPanel.vue";
  import rightPanel from "@/modules/project/component/rightPanel.vue";
  import { CompCodeEnum } from "@/modules/project/enum";
  import projectStore from "@/modules/project/store";
  @Component({
    name: "SkuHandle",
    components: { leftPanel, rightPanel },
  })
  export default class SkuHandle extends Vue {
    // data 数据源
    @Prop({ required: false, type: Object }) readonly data!: any;
    private skuShow = true;
    private active = "";
    private form = {
      buttonName: "",
    };
    get templateComp() {
      return projectStore.getTemplateComp;
    }
    get editorActiveIndex() {
      return projectStore.getEditorActiveIndex;
    }
    get marketingSkuDefault() {
      return CompCodeEnum["marketing-sku-default"];
    }
    private rules = {
      buttonName: [{ required: true, message: "请输入按钮文案", trigger: "blur" }],
    };
    private activated() {
      // 获取组件属性值
      this.active = this.data.code;
      this.form = this.data.attributeJson;
    }
    private handleClickItem(val: CompCodeEnum) {
      this.active = val;
      const templateComp = this.templateComp;
      templateComp[this.editorActiveIndex].code = val;
    }
  }
</script>

<style lang="less" scoped>
  .sku_handle {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    .left-panel {
      padding: 40px;
    }
  }
</style>
