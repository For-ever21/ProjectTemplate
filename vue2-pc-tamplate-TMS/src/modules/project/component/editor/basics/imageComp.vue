<template>
  <section class="imageComp" @click="$emit('click-event')">
    <van-image
      v-for="(item, index) in attributeJson.imageInfo"
      :class="{ pointer: preview }"
      :key="index"
      :src="item.imgUrl"
      :lazy-load="Boolean(attributeJson.isLazy)"
      @click="handleClick(item)"
    />
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { AttributeJsonImage } from "../types";
  import { Toast } from "vant";

  @Component({
    name: "ImageComp",
  })
  export default class ImageComp extends Vue {
    @Prop({
      required: true,
      type: Object,
      default: () => {
        return {
          imageInfo: [],
          isAutoPlay: "",
          isLazy: "",
          isLoop: "",
        };
      },
    })
    readonly attributeJson!: AttributeJsonImage;
    @Prop({ required: true, type: String, default: "" }) readonly code!: string;
    @Prop({ required: false, type: Boolean, default: false }) readonly preview!: boolean;
    private handleClick(item: Record<string, any>) {
      if (this.preview) {
        Toast(`跳转图片链接： ${item.linkUrl}`);
      }
    }
  }
</script>

<style lang="less" scoped>
  .imageComp {
    width: 100%;
    min-height: 48px;
    .van-image {
      width: 100%;
      min-height: 48px;
    }
  }
</style>
