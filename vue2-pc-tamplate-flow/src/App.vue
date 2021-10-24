<template>
  <div id="app">
    <router-view :key="key" />
  </div>
</template>

<script>
  export default {
    computed: {
      key() {
        // 来保证路由切换时都会重新渲染触发钩子了 应该编辑，新增进行切换，钩子不触发
        return this.$route.name !== undefined
          ? this.$route.name + +new Date()
          : this.$route + +new Date();
      },
    },
  };
</script>

<style lang="less"></style>
