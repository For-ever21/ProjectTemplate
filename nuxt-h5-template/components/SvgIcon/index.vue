<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon SvgIcon"
    v-on="$listeners"
  ></div>
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :href="iconName" />
  </svg>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";

  @Component({
    name: "SvgIcon",
  })
  export default class SvgIcon extends Vue {
    @Prop({ required: true, type: String }) readonly icon: string;
    @Prop({ required: false, type: String || Number }) readonly className: string;
    @Prop({ required: false, type: String, default: "" }) readonly description: string;

    get isExternal() {
      return /^(https?:|mailto:|tel:)/.test(this.icon);
    }
    // 通过iconClass 获取svg文件名
    get iconName() {
      return `#icon-${this.icon}`;
    }
    get svgClass() {
      if (this.className) {
        return "SvgIcon " + this.className;
      } else {
        return "SvgIcon";
      }
    }
    // 返回url请求位置
    get styleExternalIcon() {
      return {
        mask: `url(${this.svgClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.svgClass}) no-repeat 50% 50%`,
      };
    }
  }
</script>

<style>
  .SvgIcon {
    width: 24px;
    height: 24px;
    fill: currentColor;
    overflow: hidden;
  }

  .svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
  }
</style>
