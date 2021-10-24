<template>
  <section class="textComp" @click="$emit('click-event')">
    <span>文本</span>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { AttributeJsonText } from "../types";
  @Component({
    name: "TextComp",
  })
  export default class TextComp extends Vue {
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
    readonly attributeJson!: AttributeJsonText;
    @Prop({ required: true, type: String, default: "" }) readonly code!: string;
  }
</script>

<style lang="less" scoped>
  .textComp {
    width: 100%;
    background: #fff;
    padding: 16px 8px;
    box-sizing: border-box;
  }
</style>
