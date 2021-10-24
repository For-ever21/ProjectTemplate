<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon"></div>
  <svg v-else :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>
<script lang="ts">
  // doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
  function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path);
  }
  import { Vue, Prop, Component } from "vue-property-decorator";
  @Component({
    name: "SvgIcon",
  })
  export default class SvgIcon extends Vue {
    // icon的 name
    @Prop({ required: true, type: String }) readonly iconClass!: string;
    // icon的 类名
    @Prop({ required: false, type: String, default: "" }) readonly className!: string;

    get isExternal(): boolean {
      return isExternal(this.iconClass);
    }
    get iconName(): string {
      return `#icon-${this.iconClass}`;
    }
    get svgClass(): string {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    }
    get styleExternalIcon(): Record<string, string> {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
      };
    }
  }
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
  }
</style>
