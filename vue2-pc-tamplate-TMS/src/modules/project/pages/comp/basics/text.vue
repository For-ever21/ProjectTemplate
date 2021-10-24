<template>
  <section class="text_handle">
    <left-panel class="left-panel">
      <el-divider>基础样式</el-divider>
    </left-panel>
    <right-panel class="right-panel">
      <div>text内容</div>
    </right-panel>
  </section>
</template>
<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import leftPanel from "@/modules/project/component/leftPanel.vue";
  import rightPanel from "@/modules/project/component/rightPanel.vue";
  @Component({
    name: "TextHandle",
    components: { leftPanel, rightPanel },
  })
  export default class TextHandle extends Vue {
    private id = "";
  }
</script>

<style lang="less" scoped>
  .text_handle {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
  }
</style>
