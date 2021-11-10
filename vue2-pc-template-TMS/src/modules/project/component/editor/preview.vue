<template>
  <section class="preview">
    <div class="header">
      <img src="@/modules/project/assets/image/back.png" />
      <span>预览页面</span>
      <img src="@/modules/project/assets/image/share.png" />
    </div>
    <div class="contain">
      <template v-for="(item, index) in templateComp">
        <component
          v-if="index !== 1"
          :ref="`compRef${item.category}`"
          class="comp"
          :is="trans(item.category)"
          :attributeJson="item.attributeJson"
          :code="transCode(item.code)"
          :key="index"
          preview
          @btnClick="handleBtnClick"
        />
        <!-- TODO 业务逻辑 特殊处理 门店展示 -->
        <div v-if="index === 0" :key="`shop${index}`" class="shop">
          <div class="content">
            <span>请选择服务门店</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Ref } from "vue-property-decorator";
  import projectStore from "@/modules/project/store";
  import { CompCodeEnum } from "@/modules/project/enum";

  import goodsComp from "./marketing/goodsComp.vue";
  import skuComp from "./marketing/skuComp.vue";
  import imageComp from "./basics/imageComp.vue";
  import buttonComp from "./basics/buttonComp.vue";
  import textComp from "./basics/textComp.vue";

  @Component({
    name: "PreviewPanel",
    components: { goodsComp, skuComp, imageComp, buttonComp, textComp },
  })
  export default class PreviewPanel extends Vue {
    @Ref() readonly skuCompRef!: any;
    get templateComp() {
      return projectStore.getTemplateComp;
    }
    get compActive() {
      return projectStore.getCompActive;
    }
    get editorActiveIndex() {
      return projectStore.getEditorActiveIndex;
    }
    private trans(category: string) {
      const categoryMap: Record<string, string> = {
        goods: "goodsComp",
        image: "imageComp",
        text: "textComp",
        button: "buttonComp",
        sku: "skuComp",
      };
      return categoryMap[category] || "";
    }
    private transCode(code: CompCodeEnum) {
      return CompCodeEnum[code];
    }
    private handleBtnClick() {
      (this.$refs.compRefsku as any)[0].skuShow = true;
    }
  }
</script>

<style lang="less" scoped>
  .preview {
    flex: 1;
    background: #f5f7f9;
    height: 100%;
    overflow-y: auto;
    width: 375px;
    height: 667px;
    border: 1px solid #f5f5f5;
    border-radius: 8px;
    .header {
      height: 54px;
      background: #fff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      width: 375px;
      box-sizing: border-box;
      z-index: 1;
      img {
        width: 22px;
        height: 22px;
        margin: 0 16px;
      }
      span {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #32333b;
      }
    }
    .contain {
      padding-top: 54px;
      width: 375px;
      min-height: 623px;
      margin: 30px auto;
      background-repeat: no-repeat;
      background-size: 100%;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .shop {
        width: 100%;
        padding: 4px 10px 10px;
        box-sizing: border-box;
        background: #f1f1f1;
        .content {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          border-radius: 8px;
          background: #fff;
          padding: 0 15px;
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #32333b;
          }
        }
      }
    }
    /deep/.van-overlay {
      top: 54px;
      height: calc(100% - 54px) !important;
    }
  }
</style>
