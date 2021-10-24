<template>
  <!-- 骨架屏 -->
  <vue-content-loading :width="323" :height="298" uid="homeArticleSkeleton">
    <circle cx="21" cy="21" r="21" />
    <rect x="52" y="0" rx="4" ry="4" width="64" height="22" />
    <rect x="52" y="26" rx="4" ry="4" width="48" height="17" />
    <rect x="253" y="6" rx="15" ry="15" width="70" height="30" />
    <rect x="0" y="52" rx="4" ry="4" width="323" height="44" />
    <rect x="0" y="100" rx="4" ry="4" width="323" height="20" />
    <rect x="0" y="130" rx="6" ry="6" width="100" height="100" />
    <rect x="110" y="130" rx="6" ry="6" width="100" height="100" />
    <rect x="220" y="130" rx="6" ry="6" width="100" height="100" />
    <rect x="0" y="240" rx="12" ry="12" width="80" height="24" />
    <rect x="86" y="240" rx="12" ry="12" width="80" height="24" />
    <rect x="0" y="278" rx="4" ry="4" width="50" height="24" />
    <rect x="87" y="278" rx="4" ry="4" width="50" height="24" />
    <rect x="174" y="278" rx="4" ry="4" width="50" height="24" />
    <rect x="263" y="278" rx="4" ry="4" width="50" height="24" />
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
