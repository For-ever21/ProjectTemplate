<template>
  <section v-show="skuShow" class="skuComp">
    <van-overlay :show="skuShow" />
    <div class="sku-popup van-popup van-popup--round van-popup--bottom">
      <i
        role="button"
        tabindex="0"
        class="van-icon van-icon-cross van-popup__close-icon van-popup__close-icon--top-right"
        @click="handleClose"
      ></i>
      <div class="price">
        <div class="min">
          <small>¥</small>
          <span>{{ price }}</span>
          <small>起</small>
        </div>
      </div>
      <div class="spec_item">
        <div class="spec_title">商品名称</div>
        <div class="spec_options">
          <span
            v-for="(item, index) in filterSkuList"
            :key="index"
            :class="[index === 0 ? 'spec_option active' : 'spec_option']"
          >
            {{ item.specificationName }}
          </span>
          <span v-if="!filterSkuList.length">请填写规格名称</span>
        </div>
      </div>
      <div class="spec_item">
        <div class="spec_title">所选门店</div>
        <div class="spec_shop">
          <span>请选择服务门店</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div class="spec_item">
        <div class="spec_title">服务时间</div>
        <div class="spec_options">
          <span class="spec_option active">更多时间</span>
        </div>
      </div>
      <div class="spec_item">
        <div class="spec_title">消费方式</div>
        <div class="spec_options">
          <span class="spec_option active">电子券</span>
        </div>
      </div>
      <div class="footer">
        <div class="btn">{{ attributeJson.buttonName }}</div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Watch, Prop } from "vue-property-decorator";

  import projectStore from "@/modules/project/store";

  import { AttributeJsonSku } from "../types";

  @Component({
    name: "SkuComp",
  })
  export default class SkuComp extends Vue {
    @Prop({ required: false, type: Boolean, default: false }) readonly preview!: boolean;
    @Prop({
      required: true,
      type: Object,
      default: () => {
        return {
          buttonName: "",
        };
      },
    })
    readonly attributeJson!: AttributeJsonSku;
    private skuShow = false;
    @Watch("compActive", { immediate: true })
    compActiveChange(category: string) {
      if (category === "sku") {
        this.skuShow = true;
      } else {
        this.skuShow = false;
      }
    }
    get compActive() {
      return projectStore.getCompActive;
    }
    get price() {
      let price = 0;
      this.skuList.forEach((item: any) => {
        if (item.minPrice > price) {
          price = item.minPrice;
        }
      });
      return price;
    }
    get goodsComp() {
      return projectStore.getTemplateComp[0] || {};
    }
    get skuList() {
      return this.goodsComp.attributeJson?.skuList || [];
    }
    get filterSkuList() {
      return this.skuList.filter((item: any) => item.specificationName);
    }
    private handleClose() {
      if (this.preview) {
        this.skuShow = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  .skuComp {
    position: absolute;
    width: 373px;
    height: 100%;
    bottom: 0;
    .van-overlay {
      position: relative;
    }
    &.active {
      border: 1px solid transparent !important;
    }
    .sku-popup {
      position: absolute;
      // height: 400px;
      width: 373px;
      z-index: 1;
      padding: 10px 15px 20px;
      box-sizing: border-box;
      .price {
        height: 33px;
        line-height: 33px;
        font-size: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 8px;
        .min {
          color: #ff3500;
          & > small {
            font-size: 16px;
          }
          & > span {
            margin: 0 2px;
          }
        }
      }
      .spec_item {
        margin-bottom: 24px;
        .spec_title {
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #32333b;
          line-height: 22px;
          margin-bottom: 16px;
        }
        .spec_options {
          display: flex;
          flex-direction: row;
          color: #32333b;
          .spec_option {
            padding: 8px 15px;
            border-radius: 32px;
            background: #efefef;
            margin-right: 10px;
            &.active {
              background: #f0edfc;
              border: 1px solid #664ae1;
              color: #664ae1;
            }
          }
        }
        .spec_shop {
          background: #efefef;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          border-radius: 8px;
          padding: 0 15px;
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #32333b;
          }
        }
      }
      .footer {
        padding-top: 16px;
        box-sizing: border-box;
        .btn {
          height: 42px;
          background: linear-gradient(135deg, #664ae1 0%, #9471ff 100%);
          border-radius: 21px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 42px;
          text-align: center;
        }
      }
    }
  }
</style>
