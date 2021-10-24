<template>
  <a
    v-exp-dot="formatArticleType(articleDetail.type)"
    :data-dot="articleDetail.id"
    :data-index="index"
    class="home_articleItem"
    @click="handleClickItem"
  >
    <div class="doctorInfo">
      <van-image
        class="headimg"
        lazy-load
        :src="articleDetail.doctorHeadImg || ''"
        :alt="`${articleDetail.realName}${articleDetail.professionLevel}`"
      >
        <template v-slot:error>
          <img
            src="@/assets/images/default/avatar_round.png"
            :alt="`${articleDetail.realName}${articleDetail.professionLevel}`"
          />
        </template>
      </van-image>
      <div class="no">
        <span class="drName">{{ articleDetail.realName }}</span>
        <span class="drTitles">{{ articleDetail.professionLevel }}</span>
      </div>

      <button
        v-show="!articleDetail.isAttention && articleDetail.type != 'SUBSCRIPTION'"
        class="like"
        @click.stop="toAttention(articleDetail.drId)"
      >
        关注
      </button>
    </div>
    <p
      v-if="articleDetail.title"
      ref="title"
      class="title van-multi-ellipsis--l2"
      v-html="titleEscape"
    ></p>
    <p
      v-if="articleDetail.title"
      ref="title"
      class="extractContentText van-multi-ellipsis--l3"
      v-html="contentEscape"
    ></p>
    <ul class="imgList">
      <template v-if="articleDetail.contentImgList && articleDetail.contentImgList.length > 1">
        <li v-for="(item, index) in articleDetail.contentImgList" :key="index">
          <van-image lazy-load :show-loading="false" :src="item" :alt="articleDetail.title">
            <template v-slot:error>
              <img src="@/assets/images/default/avatar_round.png" :alt="articleDetail.title" />
            </template>
          </van-image>
        </li>
      </template>
      <template v-else-if="articleDetail.cover">
        <li>
          <van-image
            lazy-load
            :show-loading="false"
            :src="articleDetail.cover"
            :alt="articleDetail.title"
          >
            <template v-slot:error>
              <img src="@/assets/images/default/avatar_round.png" :alt="articleDetail.title" />
            </template>
          </van-image>
        </li>
      </template>
    </ul>
    <ul v-if="articleDetail.tags && articleDetail.tags.length > 0" class="tags">
      <li v-for="(item, index) in articleDetail.tags" :key="index">{{ item }}</li>
    </ul>
  </a>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { Toast } from "vant";
  import { addDoctorPatient } from "@/api/home/homeService";
  import { UserModule } from "@/store";
  import { goLogin } from "@/utils/iwen";
  import { IArticleItem, ArticleType } from "@/api/home/model/homeModel";

  @Component({
    name: "articleItem",
    filters: {
      textTrim(value: string) {
        if (value) return value.replace(/&nbsp;/g, " ").trim();
      },
    },
  })
  export default class articleItem extends Vue {
    @Prop({ required: false, type: Object, default: {} }) readonly articleDetail: IArticleItem;
    @Prop({ default: 1, type: String }) articleType: ArticleType;
    @Prop({ default: 0, type: Number }) index: number;
    private userinfo = {};

    // 判断是否登录
    get isLogin() {
      return UserModule.isLogin;
    }

    // 用户id
    get userId() {
      return UserModule.userId;
    }

    // 标题特殊标签转义符优化
    get titleEscape() {
      return this.scape(this.articleDetail.title);
    }
    // 内容特殊标签转义符优化
    get contentEscape() {
      return this.scape(this.articleDetail.content);
    }

    private toAttention(drId: string) {
      if (!this.isLogin) {
        // 跳转登录页
        goLogin(undefined, { triggerAction: "患端-文章详情页", triggerModule: "关注" });
        return false;
      }
      const params = {
        drId, // 医生id
        userId: this.userId, // 用户id
      };
      addDoctorPatient(params)
        .then(() => {
          this.$emit("addDoctorPatient", drId);
        })
        .catch(() => {
          Toast.fail("关注失败！");
        });
    }

    private link(url: string) {
      window.location.href = url;
    }

    private formatArticleType(val: ArticleType) {
      const sj = {
        SUBSCRIPTION: "订阅",
        RECOMMEND: "推荐",
        POPULAR_SCIENCE: "科普文章",
        DIARY: "诊间日记",
        PATHOLOGICAL_ANALYSIS: "病例分析",
      };
      return sj[val] || "";
    }
    private handleClickItem() {
      const params = {
        information_flow_position: "C端首页",
        information_flow_type: "文章",
        search_channel: this.formatArticleType(this.articleDetail.type),
        doc_id: this.articleDetail.id, // 首页文章id
        information_flow_sort: this.index, // 对象在信息流的排序
      };
      this.$logger.emit("c_information_flow_click", params);
      window.location.href = this.articleDetail.linkUrl;
    }
    private scape(value: string): string {
      return value.replace(/&nbsp;/g, " ").trim();
    }
  }
</script>

<style lang="less">
  .home_articleItem {
    font-family: PingFangSC-Regular, PingFang SC;
    display: block;
    background: #fff;
    overflow: hidden;
    padding: 16px 0;
    border-bottom: 1px solid #eee;
    .doctorInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .headimg {
        width: 42px;
        height: 42px;
        border-radius: 100%;
        overflow: hidden;
        margin-right: 8px;
        img,
        .van-image {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }

      .no {
        flex: 1;
        display: flex;
        flex-direction: column;

        .drName {
          font-size: 16px;
          font-weight: 400;
          color: #32333b;
          line-height: 22px;
        }

        .drTitles {
          margin-top: 4px;
          font-size: 12px;
          font-weight: 400;
          color: #999;
          line-height: 17px;
        }
      }

      .like {
        padding: 0 21px;
        height: 30px;
        font-size: 14px;
        font-weight: 600;
        color: #664ae1;
        background: #f0edfc;
        border-radius: 15px;
        border: none;
      }
    }

    .title {
      // margin-top: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #32333b;
      line-height: 26px;
      margin-bottom: 8px;
      word-break: break-all;
    }

    .extractContentText {
      font-size: 14px;
      font-weight: 400;
      color: #999;
      line-height: 22px;
      margin-bottom: 8px;
      word-break: break-all;
    }

    .imgList {
      // margin-top: 8px;
      display: flex;
      align-items: center;
      overflow: hidden;

      li {
        width: 109px;
        height: 109px;
        border-radius: 8px;
        flex-shrink: 0;
        margin-right: 8px;
        overflow: hidden;
        border: #e5e5e5 1px solid;
        .van-image,
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:nth-child(n + 4) {
          display: none;
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }

    .tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      margin-top: 16px;
      height: 24px;
      overflow: hidden;
      li {
        padding: 0 12px;
        line-height: 24px;
        background: #f8f8f8;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 400;
        color: #666;

        margin-right: 16px;

        &:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }

    .foor {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;

      li {
        display: flex;
        align-items: center;
        // width: 63px;

        .SvgIcon {
          width: 24px;
          height: 24px;
          margin-right: 2px;
        }

        span {
          white-space: nowrap;
          font-size: 12px;
          color: #999;
          line-height: 17px;

          &.ysc {
            color: #856ee7;
          }
        }
      }
    }
  }
  .coverImg {
    width: 100%;
    height: 196px;
    background-position: center;
    background-size: cover;
    background-image: url("@/assets/images/default/avatar_round.png");
    margin-top: 10px;
    overflow: hidden;
    border-radius: 8px;
    border: #e5e5e5 1px solid;
    div {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
    }
  }
</style>
