<template>
  <!-- 骨架屏 -->
  <vue-content-loading :height="190">
    <circle cx="32" cy="32" r="32" />
    <rect x="74" y="5" rx="4" ry="4" width="120" height="20" />
    <rect x="74" y="35" rx="4" ry="4" width="180" height="18" />
    <rect x="74" y="63" rx="4" ry="4" width="220" height="14" />
    <rect x="74" y="95" rx="4" ry="4" width="100%" height="50" />
    <rect x="74" y="160" rx="4" ry="4" width="200" height="25" />
    <rect x="344" y="160" rx="12" ry="12" width="56" height="25" />
  </vue-content-loading>
</template>
<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";
  import VueContentLoading from "vue-content-loading";
  @Component({
    name: "Skeleton",
    components: {
      VueContentLoading,
    },
  })
  export default class Skeleton extends Vue {}
</script>
