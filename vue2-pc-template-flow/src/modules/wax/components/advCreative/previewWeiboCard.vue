<template>
  <div class="previewWeiboCard">
    <!-- 微博博文返回数据格式 -->
    <section v-if="from === 'weibo'">
      <div class="container">
        <div class="avatar">
          <img v-if="data.profileImage" :src="data.profileImage" />
          <img v-else src="../../images/weibo_head.gif" />
        </div>
        <div class="contain">
          <div class="nickname">{{ data.nickName }}</div>
          <div class="from">{{ data.publicTime }} 来自&nbsp;&nbsp;{{ data.nickName }}</div>
          <WeiboContent :data="data.text" :link="link" />
          <div class="content_extend">
            <!-- 单张图片 -->
            <div v-if="data.pics && data.pics.length === 1" class="one_pic">
              <el-image :src="data.pics[0]" :preview-src-list="data.pics" />
            </div>
            <!-- 多张图片 -->
            <div v-if="data.pics && data.pics.length > 1" class="many_pic">
              <el-image
                v-for="(item, index) in data.pics.split(',')"
                :key="index"
                :src="item"
                :preview-src-list="data.pics.split(',')"
              />
            </div>
            <!-- 图文card -->
            <!-- <div
            v-if="data.creativeType === 'feed_activity'"
            class="pic_card"
            @click.prevent="goCardLink"
          >
            <div v-if="data.cardPic" class="img_wrap">
              <el-image :src="data.cardPic" />
            </div>
            <div v-if="data.cardTitle || data.cardDesc" class="action">
              <div class="card_title">{{ data.cardTitle }}</div>
              <div class="card_desc">{{ data.cardDesc }}</div>
              <div v-if="data.cardButton !== 0" class="card_btn">
                <div class="btn_inner">
                  {{ data.cardButton | cardButtonFilter }}
                </div>
              </div>
            </div>
          </div> -->
            <!-- 视频card -->
            <!-- <div
            v-if="data.creativeType === 'feed_video'"
            class="video_card"
            @click.prevent="goCardLink"
          >
            <video
              v-if="data.cardVideoLink"
              x5-video-player-type="h5-page"
              :poster="data.cardVideoPic"
              controlslist="nodownload"
              controls
            >
              <source :src="data.cardVideoLink" type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
            <div v-if="data.cardTitle || data.cardDesc" class="action">
              <div class="card_title">{{ data.cardTitle }}</div>
              <div class="card_desc">{{ data.cardDesc }}</div>
              <div v-if="data.cardButton !== 0" class="card_btn">
                <div class="btn_inner">
                  {{ data.cardButton | cardButtonFilter }}
                </div>
              </div>
            </div>
          </div> -->
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="item">
          <img src="@/modules/wax/images/star.png" />
          <span>收藏</span>
        </div>
        <div class="item">
          <img src="@/modules/wax/images/share.png" />
          <span>{{ data.reposts | seperateNull }}</span>
        </div>
        <div class="item">
          <img src="@/modules/wax/images/comment.png" />
          <span>{{ data.comments | seperateNull }}</span>
        </div>
        <div class="item">
          <img src="@/modules/wax/images/good.png" />
          <span>{{ data.attitudes | seperateNull }}</span>
        </div>
      </footer>
    </section>
    <!-- 后台接口返回数据格式 -->
    <section v-if="from === 'custom'">
      <div class="container">
        <div class="avatar">
          <img src="../../images/weibo_head.gif" />
        </div>
        <div class="contain">
          <div class="nickname">{{ headerName }}</div>
          <div class="from">1分钟前来自&nbsp;&nbsp;{{ headerName }}</div>
          <WeiboContent :data="data.content" :link="link" />
          <div class="content_extend">
            <!-- 单张图片 -->
            <div
              v-if="data.creativeType === 'blog' && data.pics && data.pics.length === 1"
              class="one_pic"
            >
              <el-image :src="data.pics[0]" :preview-src-list="data.pics" />
            </div>
            <!-- 多张图片 -->
            <div
              v-if="data.creativeType === 'blog' && data.pics && data.pics.length > 1"
              class="many_pic"
            >
              <el-image
                v-for="(item, index) in picsFilter(data.pics)"
                :key="index"
                :src="item"
                :preview-src-list="data.pics"
              />
            </div>
            <!-- 图文card -->
            <div v-if="data.creativeType === 'feed_activity'" class="pic_card">
              <div v-if="data.cardPic" class="img_wrap">
                <el-image :src="data.cardPic" />
              </div>
              <div v-if="data.cardTitle || data.cardDesc" class="action">
                <div class="left">
                  <div class="card_title">{{ data.cardTitle }}</div>
                  <div class="card_desc">{{ data.cardDesc }}</div>
                </div>
                <div v-show="data.cardButton !== 0" class="card_btn" @click="goCardLink">
                  {{ data.cardButton | cardButtonFilter }}
                </div>
              </div>
            </div>
            <!-- 视频card -->
            <div v-if="data.creativeType === 'feed_video'" class="video_card">
              <video
                v-if="data.cardVideoLink"
                :poster="data.cardVideoPic"
                controlslist="nodownload"
                controls
              >
                <source :src="data.cardVideoLink" type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
              </video>
              <div v-if="data.cardTitle || data.cardDesc" class="action">
                <div class="left">
                  <div class="card_title">{{ data.cardTitle }}</div>
                  <div class="card_desc">{{ data.cardDesc }}</div>
                </div>
                <div v-if="data.cardButton !== 0" class="card_btn" @click="goCardLink">
                  {{ data.cardButton | cardButtonFilter }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="footer">
        <div class="item">
          <img src="@/modules/wax/images/star.png" />
          <span>收藏</span>
        </div>
        <div class="item">
          <img src="@/modules/wax/images/share.png" />
          <span>转发</span>
        </div>
        <div class="item">
          <img src="@/modules/wax/images/comment.png" />
          <span>评论</span>
        </div>
        <div class="item">
          <img src="@/modules/wax/images/good.png" />
          <span>赞</span>
        </div>
      </footer>
    </section>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { Getter } from "vuex-class";
  import { UserInfo } from "@/store/types";
  import WeiboContent from "./weiboContent.vue";
  @Component({
    name: "PreviewWeiboCard",
    components: { WeiboContent },
    filters: {
      cardButtonFilter(val: number) {
        switch (val) {
          case 0:
            return "无";
          case 1:
            return "参与";
          case 2:
            return "购买";
          case 3:
            return "下载";
          case 4:
            return "预约";
          case 5:
            return "试用";
          case 6:
            return "查看";
          default:
            return "--";
        }
      },
      cardVideoButtonFilter(val: number) {
        switch (val) {
          case 0:
            return "无";
          case 1:
            return "立即参与";
          case 2:
            return "立即购买";
          case 3:
            return "立即下载";
          case 4:
            return "立即预约";
          case 5:
            return "立即试用";
          case 6:
            return "查看详情";
          default:
            return "--";
        }
      },
      createModeFilter(val: string) {
        switch (val) {
          case "10":
            return "新建创意";
          case "20":
            return "已审创意";
          case "30":
            return "微博博文";
          default:
            return "--";
        }
      },
    },
  })
  export default class PreviewWeiboCard extends Vue {
    @Getter("getterUserInfo") userInfo!: UserInfo;
    /**
     * @description 数据源
     */
    @Prop({ type: Object, required: true }) readonly data!: Record<string, any>;
    /**
     * @description 数据从哪来 自建custom，微博weibo
     */
    @Prop({ type: String, default: "custom" }) readonly from!: string;
    /**
     * @description link 链接
     */
    @Prop({ type: Array, required: false, default: () => [] }) readonly link!: Array<{
      text: string;
      link: string;
    }>;
    get headerName() {
      return this.userInfo.realName || this.userInfo.userName || "爱问医生";
    }
    // 跳转微博card链接
    private goCardLink() {
      if (this.data.cardLink) {
        window.open(this.data.cardLink, "_blank");
      } else {
        this.$message.warning("请输入有效的card链接");
      }
    }
    // 过滤空数据的 array
    private picsFilter(arr: any) {
      return arr.filter((item: any) => {
        return item;
      });
    }
  }
</script>

<style lang="less" scoped>
  .previewWeiboCard {
    background: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    border: 1px solid #dcdfe6;
    line-height: 1;
    width: 592px;
    box-sizing: border-box;
    z-index: 1;
    max-height: 800px;
    overflow: auto;
    .container {
      padding: 16px 20px 16px 20px;
      display: flex;
      flex-direction: row;
      .avatar {
        flex-shrink: 0;
        width: 42px;
        height: 42px;
        margin-right: 8px;
        & > img {
          width: 100%;
          height: 100%;
          border-radius: 25px;
          border: 1px solid #eeeeee;
        }
      }
      .contain {
        display: flex;
        flex-direction: column;
        flex: 1;
        .nickname {
          height: 19px;
          font-size: 14px;
          font-weight: bold;
          color: #333333;
          line-height: 19px;
          margin: 6px 0;
        }
        .from {
          height: 16px;
          font-size: 12px;
          color: #999999;
          line-height: 16px;
          margin-bottom: 6px;
        }
        .content_extend {
          .one_pic {
            .el-image {
              width: 104px;
              height: 104px;
              border: 1px solid #f5f5f5;
            }
          }
          .many_pic {
            width: 400px;
            .el-image {
              width: 104px;
              height: 104px;
              border-radius: 8px;
              border: 1px solid #f5f5f5;
              margin: 0 8px 8px 0;
              &:nth-child(3n) {
                margin-right: 0;
              }
            }
          }
          .pic_card {
            width: 100%;
            cursor: pointer;
            .img_wrap {
              width: 500px;
              height: 250px;
              background: #f2f2f5;
              position: relative;
              &::after {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                border: 1px solid rgba(0, 0, 0, 0.05);
              }
              .el-image {
                width: 100%;
                height: 100%;
              }
            }
          }
          .video_card {
            cursor: pointer;
            position: relative;
            box-sizing: border-box;
            border: 1px solid rgba(0, 0, 0, 0.05);
            & > video {
              width: 500px;
              height: 250px;
              object-fit: contain;
            }
          }
          .action {
            background: #f2f2f5;
            padding: 10px 16px;
            // height: 110px;
            box-sizing: border-box;
            display: flex;
            border: 1px solid rgba(0, 0, 0, 0.05);
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            .card_title {
              height: 30px;
              font-size: 22px;
              color: #333333;
              line-height: 30px;
              margin-bottom: 10px;
            }
            .card_desc {
              height: 19px;
              font-size: 14px;
              color: #999999;
              line-height: 19px;
              margin-bottom: 10px;
            }

            .card_btn {
              // display: inline-block;
              width: 70px;
              height: 23px;
              background: #ff8140;
              box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
              border-radius: 2px;
              color: #fff;
              margin-bottom: 10px;
              text-align: center;
              line-height: 23px;
              font-size: 12px;
            }
          }
        }
      }
    }
    .footer {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 44px;
      border-top: 1px solid #f2f2f5;
      .item {
        width: 25%;
        height: 16px;
        font-size: 12px;
        color: #808080;
        line-height: 14px;
        text-align: center;
        position: relative;
        &:not(:last-child)::after {
          content: "";
          width: 1px;
          height: 22px;
          background: #d8d8d8;
          position: absolute;
          right: 0;
          top: -3px;
        }
        & > img {
          width: 14px;
          height: 14px;
          margin-right: 5px;
        }
      }
    }
  }
</style>
