<template>
  <section class="article_handle">
    <left-panel class="left-panel">
      <el-divider>基础样式</el-divider>
    </left-panel>
    <right-panel class="right-panel">
      <div>按钮内容</div>
    </right-panel>
  </section>
</template>
<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import leftPanel from "@/modules/project/component/leftPanel.vue";
  import rightPanel from "@/modules/project/component/rightPanel.vue";
  @Component({
    name: "ArticleHandle",
    components: { leftPanel, rightPanel },
  })
  export default class ArticleHandle extends Vue {
    private id = "";
  }
</script>

<style lang="less" scoped>
  .article_handle {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
  }
</style>
