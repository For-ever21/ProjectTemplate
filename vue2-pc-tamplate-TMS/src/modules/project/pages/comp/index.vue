<template>
  <section class="content">
    <template v-for="(item, index) in templateComp">
      <component
        v-show="editorActiveIndex === index"
        class="comp"
        :is="translateCompName(item.category)"
        :key="index"
        :data="item"
      />
    </template>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import { CompCodeEnum } from "@/modules/project/enum";
  import projectStore from "@/modules/project/store";

  import imageHandle from "./basics/image.vue";
  import textHandle from "./basics/text.vue";
  import buttonHandle from "./basics/button.vue";
  import skuHandle from "./marketing/sku.vue";
  @Component({
    name: "CompHandle",
    components: {
      imageHandle,
      textHandle,
      buttonHandle,
      skuHandle,
    },
  })
  export default class CompHandle extends Vue {
    get templateComp() {
      return projectStore.getTemplateComp;
    }
    get editorActiveIndex() {
      return projectStore.getEditorActiveIndex;
    }
    get compActive() {
      return projectStore.getCompActive;
    }
    get basicsImageDefault() {
      return CompCodeEnum["basics-image-default"];
    }
    @Watch("compActive", { immediate: true })
    compActiveChange(val: string) {
      for (let i = 0; i < this.templateComp.length; i++) {
        if (
          this.templateComp[i].category === val &&
          this.templateComp[this.editorActiveIndex].category !== val
        ) {
          projectStore.editorActiveIndexAction(i);
          return;
        }
      }
    }
    private mounted() {
      const formRefsList: any = projectStore.getFormRefsList;
      this.$children.forEach((item) => {
        formRefsList.push(item.$refs.ruleForm);
      });
      projectStore.formRefsListAction(formRefsList);
    }
    private translateCompName(category: string) {
      const categoryMap: any = {
        image: "imageHandle",
        text: "textHandle",
        button: "buttonHandle",
        sku: "skuHandle",
      };
      return categoryMap[category] || "";
    }
  }
</script>

<style lang="less" scoped>
  .content {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
  }
</style>
