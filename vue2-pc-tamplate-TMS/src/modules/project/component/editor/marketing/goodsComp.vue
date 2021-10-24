<template>
  <section class="goodsComp" @click="$emit('click-event')">
    <div class="banner">
      <van-swipe class="my-swipe" autoplay="3000" @change="onChange">
        <van-swipe-item v-for="(item, index) in attributeJson.bannerImageList" :key="index">
          <van-image :src="item" />
        </van-swipe-item>
        <template #indicator>
          <div class="custom-indicator">
            {{ current + 1 }}/{{ attributeJson.bannerImageList.length }}
          </div>
        </template>
      </van-swipe>
    </div>
    <!-- 广告位 -->
    <div
      class="ad"
      :class="{ active: editorActiveIndex === 1 && !preview, pointer: preview }"
      @click.stop="handleClickAd"
    >
      <van-image :src="subAttributeJson.imageInfo[0].imgUrl" alt="广告图" />
    </div>
    <!-- SPU信息详情 -->
    <div class="detail">
      <div class="wrap">
        <div v-if="price" class="price">
          <div class="min">
            <small>¥</small>
            <span>{{ price }}</span>
            <small>起</small>
          </div>
          <!-- <div class="max">原价2333</div> -->
        </div>
        <div class="name">{{ attributeJson.spuName }}</div>
        <!-- <div class="spec">
          <div class="spec_item">
            <div class="label">型号</div>
            <div class="value">菲洛嘉青春加强型</div>
          </div>
          <el-divider direction="vertical" />
          <div class="spec_item">
            <div class="label">计量</div>
            <div class="value">2ml</div>
          </div>
        </div> -->
      </div>
    </div>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";

  import { AttributeJsonGoods } from "../types";
  import projectStore from "@/modules/project/store";
  import { Toast } from "vant";

  @Component({
    name: "GoodsComp",
  })
  export default class GoodsComp extends Vue {
    // 组件属性数据
    @Prop({
      required: true,
      type: Object,
      default: () => {
        return {
          bannerImageList: [],
          skuList: [],
          sub: [],
          spuId: "",
          spuName: "",
          spuPrice: "",
        };
      },
    })
    readonly attributeJson!: AttributeJsonGoods;
    @Prop({ required: true, type: String, default: "" }) readonly code!: string;
    @Prop({ required: false, type: Boolean, default: false }) readonly preview!: boolean;
    private current = 0;
    private price = 0;
    get editorActiveIndex() {
      return projectStore.getEditorActiveIndex;
    }
    @Watch("attributeJson.skuList", { deep: true })
    skuListChange() {
      let price = this.attributeJson.skuList[0]?.minPrice;
      this.attributeJson.skuList.forEach((item: any) => {
        if (item.minPrice) {
          if (item.minPrice < price) {
            price = item.minPrice;
          }
        }
      });
      this.price = price;
    }
    get subAttributeJson() {
      return this.attributeJson.sub[0].attributeJson;
    }
    private onChange(index: number) {
      this.current = index;
    }
    private handleClickAd() {
      if (this.preview) {
        Toast(`跳转图片链接： ${this.subAttributeJson.imageInfo[0].linkUrl}`);
      } else {
        // 广告位 视为一个图片组件
        if (this.$route.name !== "compIndex") {
          this.$router.push({
            name: "compIndex",
          });
        }
        projectStore.editorActiveIndexAction(1);
        projectStore.compActiveAction("image");
      }
    }
  }
</script>

<style lang="less" scoped>
  .goodsComp {
    .banner {
      width: 100%;
      height: 375px;
      .my-swipe .van-swipe-item {
        font-size: 20px;
        line-height: 375px;
        height: 375px;
        text-align: center;
        .van-image {
          width: 100%;
          height: 100%;
        }
      }
      .custom-indicator {
        position: absolute;
        right: 5px;
        bottom: 5px;
        padding: 5px 12px;
        font-size: 12px;
        color: #fff;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
      }
    }
    .ad {
      width: 100%;
      height: 70px;
      box-sizing: border-box;
      border: 1px solid transparent;
      &.active {
        border: 1px solid #333ddd;
      }
      .van-image {
        width: 100%;
        height: 100%;
      }
    }
    .detail {
      width: 100%;
      background: #f1f1f1;
      padding: 8px;
      box-sizing: border-box;
      .wrap {
        background: #fff;
        padding: 16px;
        border-radius: 8px;
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
          .max {
            margin-left: 12px;
            color: #999;
            position: relative;
            font-size: 14px;
            &::after {
              content: "";
              border-bottom: 1px solid #999;
              position: absolute;
              width: 100%;
              left: 0;
              top: 16px;
            }
          }
        }
        .name {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #111111;
          line-height: 22px;
        }
        .spec {
          margin-top: 16px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .el-divider--vertical {
            margin: 0 16px;
          }
          .spec_item {
            .label {
              color: #999;
              margin-bottom: 4px;
            }
            .value {
              color: #32333b;
              height: 20px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
</style>
