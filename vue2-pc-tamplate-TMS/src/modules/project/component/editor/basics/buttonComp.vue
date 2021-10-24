<template>
  <div :class="{ fixedWrap: code === 'basics-button-fixed' }">
    <section
      class="buttonComp"
      :class="{ fixed: code === 'basics-button-fixed' }"
      @click="$emit('click-event')"
    >
      <van-button
        :square="code === 'basics-button-square'"
        :round="code === 'basics-button-round'"
        :color="attributeJson.backgroundColor"
        type="primary"
        block
        @click="handleClick"
      >
        {{ attributeJson.buttonName }}
      </van-button>
    </section>
  </div>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { AttributeJsonButton } from "../types";
  @Component({
    name: "ButtonComp",
  })
  export default class ButtonComp extends Vue {
    // 组件属性数据
    @Prop({
      required: true,
      type: Object,
      default: () => {
        return {
          backgroundColor: "",
          fontColor: "",
          isJump: "",
          jumpUrl: "",
          buttonName: "",
        };
      },
    })
    readonly attributeJson!: AttributeJsonButton;
    @Prop({ required: true, type: String, default: "" }) readonly code!: string;
    private handleClick() {
      this.$emit("btnClick", "button");
    }
  }
</script>

<style lang="less" scoped>
  .buttonComp {
    width: 100%;
    background: #fff;
    padding: 16px 8px;
    box-sizing: border-box;
    .van-button--primary {
      // background-color: #333ddd;
      width: 100%;
      border: none;
      height: 40px;
      border-radius: 20px;
      background: linear-gradient(135deg, #664ae1 0%, #9471ff 100%);
      color: #fff;
      text-align: center;
      line-height: 40px;
      box-sizing: border-box;
    }
  }
</style>
