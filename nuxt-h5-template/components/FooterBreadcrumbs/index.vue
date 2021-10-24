<template>
  <div class="footer-breadcrumbs">
    <span v-for="(item, index) in mergeList" :key="index">
      <a class="breadcrumb" :class="[{ last: index == mergeList.length - 1 }]" :href="item.href">
        {{ item.name }}
      </a>
      <span v-if="index !== mergeList.length - 1" class="sign">&gt;</span>
    </span>
  </div>
</template>
<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import AppPath from "@/utils/iwen/appPath";

  export interface IFooterBreadcrumbsList {
    name: string;
    href?: string;
  }
  @Component<FooterBreadcrumbs>({
    name: "FooterBreadcrumbs",
  })
  export default class FooterBreadcrumbs extends Vue {
    @Prop({ default: () => [] })
    readonly list: IFooterBreadcrumbsList[];

    get mergeList() {
      const result: IFooterBreadcrumbsList[] = [{ name: "爱问健康", href: AppPath.home }];
      this.list.forEach((item) => {
        result.push({
          href: "javascript:;",
          ...item,
        });
      });
      return result;
    }
  }
</script>
<style lang="less">
  .footer-breadcrumbs {
    font-size: 12px;
    line-height: 16px;

    .breadcrumb,
    .sign {
      color: #999999;
    }
    .breadcrumb {
      &.last {
        color: rgba(98, 54, 255, 1);
      }
    }
    .sign {
      margin: 0 2px;
    }
  }
</style>
