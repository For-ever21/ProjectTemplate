<template>
  <section class="button_handle">
    <left-panel class="left-panel">
      <el-divider class="iw-divider">基础样式</el-divider>
      <div class="comp_list">
        <div
          class="item"
          :class="{ active: active === basicsButtonDefault }"
          @click="handleClickItem(basicsButtonDefault)"
        >
          <div class="button">按钮</div>
          <div class="label">基础样式</div>
        </div>
        <div
          class="item"
          :class="{ active: active === basicsButtonFixed }"
          @click="handleClickItem(basicsButtonFixed)"
        >
          <div class="button">按钮</div>
          <div class="label">悬浮样式</div>
        </div>
      </div>
    </left-panel>
    <right-panel>
      <div class="title">按钮内容</div>
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="96px"
        label-position="left"
        class="iw-form"
      >
        <el-form-item label="文本" prop="buttonName">
          <el-input v-model="form.buttonName" />
        </el-form-item>
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
    name: "ButtonHandle",
    components: { leftPanel, rightPanel },
  })
  export default class ButtonHandle extends Vue {
    // data 数据源
    @Prop({ required: false, type: Object }) readonly data!: any;
    private active = "";
    private form = {
      buttonName: "",
    };
    private rules = {
      buttonName: [{ required: true, message: "请输入文案", trigger: "blur" }],
    };
    get templateComp() {
      return projectStore.getTemplateComp;
    }
    get editorActiveIndex() {
      return projectStore.getEditorActiveIndex;
    }
    get basicsButtonDefault() {
      return CompCodeEnum["basics-button-default"];
    }
    get basicsButtonFixed() {
      return CompCodeEnum["basics-button-fixed"];
    }
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
  .button_handle {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    .left-panel {
      padding: 40px;
      .list {
        padding: 20px 0;
        .item {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          width: 260px;
          height: 188px;
          padding: 10px;
          box-sizing: border-box;
          box-shadow: 0px 1px 10px 1px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          text-align: center;
          &.active {
            border: 1px solid #333ddd;
            filter: blur(0px);
          }
          .content {
            img {
              width: 100%;
              height: 100%;
              border: 1px dashed #666;
            }
          }
          .label {
            margin-top: 10px;
            color: #333;
          }
        }
      }
    }
  }
</style>
