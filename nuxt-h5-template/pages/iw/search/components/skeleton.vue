<template>
  <!-- 骨架屏 -->
  <vue-content-loading :height="330">
    <circle cx="22" cy="22" r="22" />
    <rect x="52" y="5" rx="4" ry="4" width="90" height="18" />
    <rect x="52" y="26" rx="4" ry="4" width="48" height="14" />
    <rect x="350" y="5" rx="12" ry="12" width="48" height="28" />
    <rect x="0" y="50" rx="4" ry="4" width="100" height="20" />
    <rect x="0" y="80" rx="4" ry="4" width="100%" height="40" />
    <rect x="0" y="135" rx="4" ry="4" width="120" height="120" />
    <rect x="140" y="135" rx="4" ry="4" width="120" height="120" />
    <rect x="280" y="135" rx="4" ry="4" width="120" height="120" />
    <rect x="0" y="265" rx="4" ry="4" width="60" height="24" />
    <rect x="100" y="265" rx="4" ry="4" width="60" height="24" />
    <rect x="0" y="300" rx="4" ry="4" width="60" height="24" />
    <rect x="100" y="300" rx="4" ry="4" width="60" height="24" />
    <rect x="200" y="300" rx="4" ry="4" width="60" height="24" />
    <rect x="300" y="300" rx="4" ry="4" width="60" height="24" />
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
