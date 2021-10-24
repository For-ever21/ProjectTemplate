<!--
 * @Author         : Qiao
 * @Date           : 2021-07-29 11:14:46
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-08-12 16:44:12
 * @FilePath       : /components/Search/index.vue
 * @Description    : 新版搜索组件
-->
<template>
  <van-sticky class="iw__header-search homeSearch">
    <div class="iwen_search" :style="{ backgroundColor: background }">
      <div class="search" @click="toSearch">
        <svg-icon icon="search_zz" />
        <input type="text" :placeholder="placeholder" />
      </div>
      <van-badge v-if="messageNum" color="#ea412c" max="99" :content="messageNum">
        <span
          class="vanBadgeImg"
          :class="{ message_black: messageIocn == 'black' }"
          @click="toMessage"
        ></span>
      </van-badge>
      <span
        v-else
        class="message"
        :class="{ message_black: messageIocn == 'black' }"
        @click="toMessage"
      ></span>
    </div>
  </van-sticky>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { getMessageCount } from "@/api/user/userService";
  import { UserModule, AppModule } from "@/store";
  import { SearchPageType } from "@/enums/sensorsEnum";
  import { goLogin } from "@/utils/iwen";
  import { BASE_URL } from "@/config/link";

  @Component({
    name: "HeaderSearch",
  })
  export default class headerSearch extends Vue {
    @Prop({ required: false, type: String, default: "搜索医生、文章" })
    readonly placeholder: string;

    @Prop({ required: false, type: String, default: "search" }) readonly routerName: string;

    @Prop({ required: false, type: Boolean, default: true }) readonly messageShow: boolean;
    @Prop({ required: false, type: String, default: "" }) readonly background: string;
    @Prop({ required: false, type: String, default: "messageIcon_white" })
    readonly messageIocn: string;

    private messageNum: unknown = 0;
    get BASE_URL() {
      return BASE_URL;
    }
    private mounted() {
      if (UserModule.isLogin) this.getMessageNum();
    }

    private getMessageNum() {
      getMessageCount({ token: UserModule.token }).then((res) => {
        this.messageNum = res;
        AppModule.SetMessageCount(res);
      });
    }
    /* 去搜索 */
    private toSearch() {
      let entry: string = "C端首页顶部"; // C端首页顶部、C端找名医页面顶部、C端找社区页面顶部
      switch (
        this.$route.name // index：首页  zmy：找名医 zsq：找社区
      ) {
        case "index":
          entry = SearchPageType.index;
          break;
        case "zmy":
          entry = SearchPageType.zmy;
          break;
        case "zsq":
          entry = SearchPageType.zsq;
          break;
        default:
          entry = SearchPageType.index;
      }
      this.$logger.emit("c_search_1", {
        entry_position: entry,
        search_belong: "C端一级页面",
      });
      this.$router.push({ path: `/iw/search?source=${this.$route.name}` });
    }
    // 去消息列表
    private toMessage() {
      if (UserModule.isLogin) {
        this.$router.push("/iw/msg");
      } else {
        // 神策打点
        let triggerAction = "";
        const name = this.$route.name;
        if (name === "index") {
          triggerAction = "首页";
        } else if (name === "zmy") {
          triggerAction = "找名医";
        } else if (name === "zsq") {
          triggerAction = "找社区";
        }
        goLogin(`${BASE_URL}/iw/msg`, { triggerAction, triggerModule: "消息" });
      }
    }
  }
</script>

<style lang="less">
  .van-sticky {
    width: 100%;
    max-width: 750px;
    left: auto;
    right: auto;
  }
  .iwen_search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 12px 12px;
    z-index: 99999;
    .search {
      flex: 1;
      height: 36px;
      background: #fff;
      padding: 0 16px;
      display: flex;
      align-items: center;
      // box-shadow: 0px 2px 10px 2px rgba(50, 51, 59, 0.1);
      border-radius: 20px;
      flex-shrink: 0;
      border: 1px #e5e5e5 solid;
      .SvgIcon {
        height: 20px;
        width: 20px;
        margin-right: 5px;
        display: inline-block;
      }

      input {
        width: 100%;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        background: transparent;
        &::placeholder {
          color: #999;
        }
      }
    }
    .vanBadgeImg,
    .message {
      width: 24px;
      height: 24px;
      margin-left: 8px;
      display: block;
      background-image: url("@/assets/images/messageIcon_white.png");
      background-size: cover;
      &_black {
        background-image: url("@/assets/images/messageIcon_black.png");
      }
    }
    /deep/.van-badge--fixed {
      top: 12px;
      font-size: 8px;
    }
  }
  .homeSearch {
    .van-sticky {
      background: transparent;
    }
    .van-sticky--fixed {
      height: 68px;
      z-index: 999;
      .iwen_search {
        background: #fff !important;
      }
      .message,
      .vanBadgeImg {
        background-image: url("@/assets/images/messageIcon_black.png") !important;
      }
    }
  }
</style>
