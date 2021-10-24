<template>
  <!-- 骨架屏 -->
  <vue-content-loading :width="343" :height="110">
    <circle cx="27" cy="27" r="27" />
    <rect x="66" y="2" rx="4" ry="4" width="180" height="25" />
    <rect x="66" y="33" rx="4" ry="4" width="56" height="20" />
    <rect x="274" y="11" rx="15" ry="15" width="70" height="30" />
    <rect x="66" y="59" rx="4" ry="4" width="276" height="34" />
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
