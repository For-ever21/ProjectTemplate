<template>
  <section class="sidebar">
    <ul class="menu">
      <li
        class="menu-item"
        :class="{ 'is-active': activeName === 'template' }"
        @click="handleClickItem('template')"
      >
        <svg-icon :iconClass="activeName === 'template' ? 'template_active' : 'template'" />
        <span>模板</span>
      </li>
      <li class="submenu">
        <div
          class="submenu__title"
          :class="{ 'is-active': activeName === 'compIndex' }"
          @click="handleClickItem('compIndex')"
        >
          <svg-icon :iconClass="activeName === 'compIndex' ? 'component_active' : 'component'" />
          <span>组件</span>
        </div>
        <ul class="menu--inline">
          <li
            v-for="item in compRouterOptions"
            :key="item.name"
            class="menu-item--inline"
            :class="{ 'is-active': compActive === item.name }"
            @click="handleClickCompItem(item.name)"
          >
            {{ item.title }}
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>
<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import projectStore from "@/modules/project/store";
  @Component({
    name: "LayoutSidebar",
  })
  export default class LayoutSidebar extends Vue {
    private name = "新建活动名称";
    private activeName = "template";
    private subVisible: Record<string, any> = {};
    @Watch("$route")
    routechange(to: any) {
      this.activeName = to.name || "";
    }
    get compActive() {
      return projectStore.getCompActive;
    }
    get compRouterOptions() {
      const compRoutes = this.compRouteArr();
      let compArr = projectStore.getTemplateComp;
      // 去重
      const map = new Map();
      compArr = compArr.filter((item: any) => !map.has(item.category) && map.set(item.category, 1));
      const filterCompRouterOptions: any[] = [];
      compArr.forEach((item: any) => {
        compRoutes.forEach((citem) => {
          if (item.category === citem.name) {
            filterCompRouterOptions.push(citem);
          }
        });
      });
      return filterCompRouterOptions;
    }
    private handleClickItem(name: string) {
      if (this.activeName === name) {
        return false;
      }
      if (!projectStore.getTemplateComp.length) {
        this.$message.error("未获取到有效的模板信息，无法操作组件");
        return false;
      }
      this.activeName = name;
      if (this.activeName === "compIndex") {
        projectStore.commitCompActive("image");
      } else {
        projectStore.commitCompActive("");
        projectStore.commitEditorActiveIndex(0);
      }
      this.$router.push({
        name,
      });
    }
    private handleClickCompItem(name: string) {
      if (this.activeName !== "compIndex") {
        this.$router.push({
          name: "compIndex",
        });
      }
      projectStore.commitCompActive(name);
    }
    private compRouteArr(): any[] {
      const arr = [
        { name: "image", title: "图片" },
        { name: "sku", title: "预约组件" },
        { name: "button", title: "按钮" },
        { name: "shop", title: "门店" },
        { name: "location", title: "定位" },
        { name: "form", title: "表单" },
        { name: "text", title: "文本" },
        { name: "map", title: "地图" },
        { name: "video", title: "视频" },
        { name: "article", title: "文章" },
      ];
      return arr;
    }
  }
</script>

<style lang="less" scoped>
  .sidebar {
    position: relative;
    z-index: 2;
    width: 60px;
    background: #fafafa;
    height: 100%;
    border-right: 1px solid #e5e5e5;
    font-size: 12px;
    color: #333333;
    box-sizing: border-box;
    .menu,
    .menu--inline {
      position: relative;
      margin: 0;
      padding-left: 0;
      list-style: none;
    }
    .menu {
      .submenu {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .submenu__title {
          width: 60px;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          &.is-active {
            color: #ffffff;
            background: #333ddd;
            position: relative;
            &::after {
              content: "";
              width: 0px;
              height: 0px;
              border-color: transparent #333ddd;
              border-width: 0 4px 6px 0;
              border-style: solid;
              position: absolute;
              right: 0;
              bottom: -6px;
            }
            &:hover {
              background: #333ddd;
              opacity: 0.8;
            }
          }
          .svg-icon {
            width: 20px;
            height: 20px;
            margin-bottom: 5px;
          }
          &:hover {
            background: #f0edfc;
          }
        }
        .menu--inline {
          padding: 12px 0;
        }
        .menu-item--inline {
          width: 50px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e5e5e5;
          margin-bottom: 20px;
          box-sizing: border-box;
          &.is-active {
            color: #ffffff;
            background: #333ddd;
            &:hover {
              background: #333ddd;
              opacity: 0.8;
            }
          }
          &:hover {
            background: #f0edfc;
          }
        }
      }
      & > .menu-item {
        width: 60px;
        height: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .svg-icon {
          width: 20px;
          height: 20px;
          margin-bottom: 3px;
        }
        &.is-active {
          color: #ffffff;
          background: #333ddd;
          position: relative;
          &:hover {
            background: #333ddd;
            opacity: 0.8;
          }
          &::after {
            content: "";
            width: 0px;
            height: 0px;
            border-color: transparent #333ddd;
            border-width: 0 4px 6px 0;
            border-style: solid;
            position: absolute;
            right: 0;
            bottom: -6px;
            // border-radius: 50%;
          }
        }
        &:hover {
          background: #f0edfc;
        }
      }
    }
  }
</style>
