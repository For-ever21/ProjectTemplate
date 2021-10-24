<template>
  <!-- 骨架屏 -->
  <vue-content-loading :width="343" :height="91">
    <rect x="0" y="10" rx="4" ry="4" width="71" height="71" />
    <rect x="76" y="12" rx="4" ry="4" width="176" height="22" />
    <rect x="76" y="41" rx="4" ry="4" width="120" height="20" />
    <rect x="272" y="21" rx="15" ry="15" width="70" height="30" />
    <rect x="76" y="67" rx="4" ry="4" width="264" height="17" />
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
