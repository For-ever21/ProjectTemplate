<template>
  <a class="home_articleItem" @click="goArticleDetail()">
    <div class="doctorInfo">
      <van-image
        class="headimg"
        lazy-load
        :src="articleDetail.doctorPhoto || ''"
        :alt="`${articleDetail.realName}${articleDetail.titles}`"
      >
        <template v-slot:error>
          <img
            src="@/assets/images/default/avatar_round.png"
            :alt="`${articleDetail.realName}${articleDetail.titles}`"
          />
        </template>
      </van-image>
      <div class="no">
        <span class="realName van-ellipsis">{{ articleDetail.realName }}</span>
        <span class="titles van-ellipsis">{{ articleDetail.titles }}</span>
      </div>

      <button
        v-show="!articleDetail.isAttention"
        class="like"
        @click.stop="toAttention(articleDetail.doctorId)"
      >
        关注
      </button>
    </div>

    <p ref="title" class="title van-multi-ellipsis--l3">{{ articleDetail.content | textTrim }}</p>
    <!-- <p
      v-if="articleDetail.content && titleLine < 3"
      class="extractContentText"
      :class="{ 'van-ellipsis': titleLine == 2, 'van-multi-ellipsis--l2': titleLine == 1 }"
    >
      {{ articleDetail.content | textTrim }}
    </p> -->
    <ul
      v-if="
        articleDetail.cover ||
          (articleDetail.extractContentImageAddressList &&
            articleDetail.extractContentImageAddressList.length > 0)
      "
      class="imgList"
    >
      <li>
        <van-image lazy-load :src="articleDetail.cover" :alt="articleDetail.title">
          <template v-slot:error>
            <img src="@/assets/images/default/avatar_round.png" :alt="articleDetail.title" />
          </template>
        </van-image>
      </li>
      <li v-for="(item, index) in articleDetail.extractContentImageAddressList" :key="index">
        <van-image lazy-load :src="item" :alt="articleDetail.title">
          <template v-slot:error>
            <img src="@/assets/images/default/avatar_round.png" :alt="articleDetail.title" />
          </template>
        </van-image>
      </li>
    </ul>
    <ul v-if="articleDetail.tagIds" class="tags">
      <li v-for="(item, index) in articleDetail.tagIds.split(',')" :key="index">{{ item }}</li>
    </ul>
    <client-only>
      <ul class="foor">
        <li>
          <SvgIcon icon="look" />
          <span>{{ articleDetail.readCount | millionFiltter }}</span>
        </li>

        <li>
          <SvgIcon icon="share" />
          <span>转发</span>
        </li>

        <li>
          <SvgIcon icon="comment" />
          <span>评论</span>
        </li>

        <!-- <li v-if="!articleDetail.isCollect">
          <SvgIcon icon="collect" />
          <span>收藏</span>
        </li> -->

        <li>
          <SvgIcon icon="collect_active" />
          <span class="ysc">已收藏</span>
        </li>
      </ul>
    </client-only>
  </a>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";
  import { Toast } from "vant";
  import { addDoctorPatient } from "@/api/home/homeService";
  import { UserModule } from "@/store";
  import { MyFavoritesItem } from "@/api/mine/mineModel";
  import { BASE_URL } from "@/config/link";

  @Component({
    name: "articleItem",
    filters: {
      textTrim(value: string) {
        if (value) return value.trim();
      },
    },
  })
  export default class articleItem extends Vue {
    @Prop({ required: false, type: Object, default: {} }) readonly articleDetail: MyFavoritesItem;

    private userinfo = {};
    private titleLine = 1;

    // 判断是否登录
    get isLogin() {
      return UserModule.isLogin;
    }

    // 用户id
    get userId() {
      return UserModule.userId;
    }

    private mounted() {
      this.$nextTick(() => {
        // 计算文章标题所占几行，保证标题和正文加起来不超过3行
        const titleHeight = (this.$refs.title as HTMLElement).clientHeight;
        const titleLineHeight = parseFloat(
          window
            .getComputedStyle(this.$refs.title as HTMLElement, null)
            .getPropertyValue("line-height")
        );
        this.titleLine = Math.round(titleHeight / titleLineHeight);
      });
    }

    private toAttention(drId: string) {
      const params = {
        drId, // 医生id
        userId: UserModule.userId, // 用户id
      };
      addDoctorPatient(params)
        .then(() => {
          this.$emit("addDoctorPatient", drId);
        })
        .catch(() => {
          Toast.fail("关注失败！");
        });
    }

    private goArticleDetail() {
      window.location.href = `${BASE_URL}/awyh/art/${this.articleDetail.contentId}.html`;
    }
  }
</script>

<style lang="less">
  .home_articleItem {
    font-family: PingFangSC-Regular, PingFang SC;
    display: block;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    padding: 10px;
    margin-top: 9px;

    .doctorInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .headimg {
        width: 42px;
        height: 42px;
        border-radius: 100%;
        overflow: hidden;
        margin-right: 10px;
        flex-shrink: 0;
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
        width: 200px;
        .realName {
          font-size: 16px;
          color: #333;
          line-height: 22px;
        }

        .titles {
          margin-top: 4px;
          font-size: 12px;
          color: #999;
          line-height: 17px;
        }
      }

      .like {
        padding: 0 11px;
        height: 24px;
        border-radius: 15px;
        border: 1px solid #eee;
        font-size: 12px;
        color: #999;
        background: transparent;
      }
    }

    .title {
      margin-top: 8px;
      font-size: 16px;
      color: #333;
      line-height: 22px;
      word-wrap: break-word;
    }

    .extractContentText {
      word-wrap: break-word;
      margin-top: 4px;
      font-size: 14px;
      color: #999;
      line-height: 20px;
    }

    .imgList {
      margin-top: 10px;
      display: flex;
      align-items: center;
      overflow: hidden;

      li {
        width: 100px;
        height: 100px;
        border-radius: 6px;
        flex-shrink: 0;
        margin-right: 8px;
        overflow: hidden;
        .van-image,
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:nth-child(n + 4) {
          display: none;
        }
      }
    }

    .tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      li {
        padding: 0 10px;
        line-height: 24px;
        background: #f8f8f8;
        border-radius: 12px;
        font-size: 12px;
        color: #666;
        margin-top: 10px;
        margin-right: 10px;

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
</style>
