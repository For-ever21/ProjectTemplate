<template>
  <section class="project">
    <Header />
    <div class="container">
      <Sidebar />
      <Editor />
      <keep-alive>
        <!-- 这里控制左侧，右侧两个面板的内容 -->
        <router-view class="tool_panel" :key="key" />
      </keep-alive>
    </div>
  </section>
</template>
<script lang="ts">
  import Header from "@/modules/project/layout/components/header.vue";
  import Sidebar from "@/modules/project/layout/components/sidebar.vue";
  import Editor from "@/modules/project/component/editor/index.vue";
  import { Component, Vue } from "vue-property-decorator";
  @Component({
    name: "Layout",
    components: { Header, Sidebar, Editor },
  })
  export default class Layout extends Vue {
    get cachedViews() {
      return []; // 这里存储 keep-alive 的路由表
    }
    get key() {
      return this.$route.path;
    }
  }
</script>

<style lang="less" scoped>
  .project {
    width: 100%;
    min-width: 1180px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .container {
      display: flex;
      flex-direction: row;
      height: calc(100% - 60px);
      .tool_panel {
        position: absolute;
        height: calc(100% - 60px);
      }
    }
  }
</style>
