<template>
  <div class="navbar">
    <!-- logo -->
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="" />
      <span class="title">广告投放管理平台</span>
    </div>
    <!-- 面包屑 暂时不用 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <el-menu :default-active="activeIndex" class="header-menu" mode="horizontal" router>
      <template v-for="nav in navs">
        <el-menu-item v-if="!nav.children" :key="nav.path" :index="nav.path">
          {{ nav.title }}
        </el-menu-item>
        <el-submenu v-else :key="nav.path" :index="nav.path">
          <template slot="title">{{ nav.title }}</template>
          <template v-for="child in nav.children">
            <el-tooltip
              v-if="child.tooltip"
              :key="child.path"
              class="item"
              effect="dark"
              :content="child.tooltip"
              placement="right"
            >
              <el-menu-item :index="child.path">{{ child.title }}</el-menu-item>
            </el-tooltip>
            <el-menu-item v-else :key="child.path" :index="child.path">
              {{ child.title }}
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
    <div class="action">
      <el-dropdown class="avatar-container action-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <span class="user-name">{{ userName || phone }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided @click.native="editPassword">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import Breadcrumb from "@/components/Breadcrumb/index.vue";
  import { Getter, Action } from "vuex-class";
  import { UserInfo } from "@/store/types";
  @Component({
    components: { Breadcrumb },
  })
  export default class Navbar extends Vue {
    @Getter("getterUserInfo") getterUserInfo!: UserInfo;
    @Action("logout") actionsLogout!: () => void;
    private navs = [
      { path: "/home", title: "概览" },
      { path: "/wax", title: "推广" },
      {
        path: "/assets",
        title: "资产",
        children: [
          {
            path: "/assets/crowdPack",
            title: "自定义人群包管理",
            tooltip: "使用用户数据管理工具扩展定向标签。圈选自定义人群",
          },
        ],
      },
      { path: "/account", title: "账户" },
      { path: "/financing", title: "财务" },
    ];
    get activeIndex() {
      const currentPath = this.$route.path; //获取当前的路由路径
      let activeIndex = undefined; //用于返回期望激活的导航项的index值
      if (currentPath === "/error/404") return "999";
      for (const nav of this.navs) {
        if (currentPath.startsWith(nav.path)) {
          //该导航项指向的路由为当前路由的父路由时。
          if (activeIndex) {
            if (activeIndex.length < nav.path.length) {
              //路径长度越长，说明该路径与当前路径越匹配
              activeIndex = nav.path;
            }
          } else {
            //之所以不直接返回nav.path，是因为我们需要找到路径更加匹配的导航项
            if (nav.children) {
              // 有子菜单的，取当前路径就行了
              activeIndex = currentPath;
            } else {
              activeIndex = nav.path;
            }
          }
        }
      }
      if (!activeIndex) activeIndex = this.navs[0].path; //当当前路由和任一导航项不匹配时，高亮第一个导航项。也就是指定第一个导航项为默认激活的导航项。
      return activeIndex;
    }
    get avatar() {
      return this.getterUserInfo.avatar || require("@/assets/images/avatar_round.png");
    }
    get userName() {
      return this.getterUserInfo.userName;
    }
    get phone() {
      return this.getterUserInfo.phone;
    }

    private handleSelect(index: string) {
      this.$router.push(index);
    }
    private async logout() {
      await this.actionsLogout();
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }

    private editPassword() {
      // 修改密码
      this.$emit("editPasswordDialog", false);
    }
  }
</script>

<style lang="less" scoped>
  .navbar {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    height: 64px;
    width: 100%;
    overflow: hidden;
    // position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      margin: 0 14px 0 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      & > img {
        width: 106px;
        height: 22px;
        margin-right: 21px;
      }
      & > .title {
        font-size: 12px;
        font-weight: 400;
        color: #000000;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: -10px;
          top: 1px;
          width: 1px;
          height: 16px;
          background: #e4e4e4;
        }
      }
    }
    .breadcrumb-container {
      // float: left;
      margin-left: 10px;
      width: 192px;
      /deep/ .el-breadcrumb__item {
        display: flex;
        align-items: center;
      }
    }
    .header-menu {
      height: 64px;
      flex: 1;
      .el-menu-item,
      .el-submenu {
        height: 64px;
        line-height: 64px;
      }
      /deep/.is-active {
        border-bottom-width: 4px;
        font-weight: 600;
        color: #000000;
        .el-submenu__title {
          height: 64px;
          line-height: 64px;
          border-bottom-width: 4px;
        }
      }

      /deep/.el-menu-item {
        padding: 0 36px;
      }
    }
    .action {
      height: 50px;
      min-width: 180px;
      &:focus {
        outline: none;
      }
      .action-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
        cursor: pointer;
        // &.hover-effect {
        //   cursor: pointer;
        //   transition: background 0.3s;
        //   &:hover {
        //     background: rgba(0, 0, 0, 0.025);
        //   }
        // }
      }
      .avatar-container {
        margin-right: 30px;
        float: right;
        .avatar-wrapper {
          display: flex;
          align-items: center;
          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .user-name {
            line-height: 50px;
            font-size: 14px;
            font-weight: 400;
            color: #000000;
            margin: 0 4px;
          }
          .el-icon-arrow-down {
            cursor: pointer;
            font-size: 12px;
          }
        }
      }
    }
  }

  /deep/.avatar-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    &.float {
      color: #000;
      outline: none;
    }
    img {
      width: 40px;
      height: 40px;
      margin-right: 5px;
    }
    .user-name {
      margin-right: 5px;
    }
  }
  /deep/.el-dropdown-menu {
    padding: 0 !important;
    top: 40px !important;
  }
  /deep/.el-dropdown-menu__item--divided {
    margin-top: 0;
    border-top: none;
  }
  /deep/.el-submenu__title {
    line-height: 64px !important;
    height: 64px !important;
  }
</style>
