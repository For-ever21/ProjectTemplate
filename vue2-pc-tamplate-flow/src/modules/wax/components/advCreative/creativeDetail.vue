<template>
  <div class="creative-detail">
    <div class="card">
      <div class="header">创意信息</div>
      <div class="content">
        <div class="item">
          <div class="label">创意名称</div>
          <div class="value">{{ data.name }}</div>
        </div>
        <div class="item">
          <div class="label">创意状态</div>
          <div class="value">{{ data.auditResultStatus | auditResultStatusFilter }}</div>
        </div>
        <div class="item">
          <div class="label">创意创建时间</div>
          <div class="value">{{ data.createTime }}</div>
        </div>
        <div class="item">
          <div class="label">广告类型</div>
          <div class="value">{{ data.createMode | createModeFilter }}</div>
        </div>
        <div class="item" v-if="data.createMode === '20' || data.createMode === '30'">
          <div class="label">广告创意</div>
          <div class="value">
            <el-button
              style="width: auto; marginBottom: 10px"
              type="primary"
              :disabled="data.auditResultStatus !== '2'"
              @click="handlePreview(data.previewUrl)"
            >
              预览
            </el-button>
            <PreviewWeiboCard :data="data" :link="link" />
          </div>
        </div>
        <section v-if="data.createMode === '10'">
          <div class="item">
            <div class="label">创意样式</div>
            <div class="value">{{ data.creativeType | creativeTypeFilter }}</div>
          </div>
          <div class="item">
            <div class="label">微博正文</div>
            <div class="value">
              <WeiboContent :data="data.content" :link="link" />
            </div>
          </div>
          <section v-if="data.creativeType === 'blog'">
            <!-- 图文 -->
            <div class="item">
              <div class="label">博文配图</div>
              <div class="value many">
                <!-- <img v-for="item in data.pics" :key="item" :src="item" /> -->
                <el-image
                  v-for="item in data.pics"
                  :key="item"
                  :src="item"
                  :z-index="3000"
                  :preview-src-list="data.pics"
                />
              </div>
            </div>
          </section>
          <section v-if="data.creativeType === 'feed_activity'">
            <!-- 图文card -->
            <div class="item">
              <div class="label">Card图片</div>
              <div class="value">
                <img :src="data.cardPic" alt="" />
              </div>
            </div>
          </section>
          <section v-if="data.creativeType === 'feed_video'">
            <!-- 视频card -->
            <div class="item">
              <div class="label">Card视频</div>
              <div class="value">
                <video x5-video-player-type="h5-page" controlslist="nodownload" controls>
                  <source :src="data.cardVideoLink" type="video/mp4" />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              </div>
            </div>
            <div class="item">
              <div class="label">Card视频封面</div>
              <div class="value">
                <img :src="data.cardPic" alt="" />
              </div>
            </div>
            <div class="item">
              <div class="label">Card视频按钮</div>
              <div class="value">{{ data.cardVideoButton | cardButtonFilter }}</div>
            </div>
          </section>
          <section
            v-if="data.creativeType === 'feed_video' || data.creativeType === 'feed_activity'"
          >
            <div class="item">
              <div class="label">Card标题</div>
              <div class="value">{{ data.cardTitle }}</div>
            </div>
            <div class="item">
              <div class="label">Card描述</div>
              <div class="value">{{ data.cardDesc }}</div>
            </div>
            <div class="item">
              <div class="label">Card按钮</div>
              <div class="value">{{ data.cardButton | cardButtonFilter }}</div>
            </div>
            <div class="item">
              <div class="label">Card链接</div>
              <div class="value">{{ data.cardLink }}</div>
            </div>
          </section>
        </section>

        <div class="item">
          <div class="label">落地页链接</div>
          <div class="value">{{ data.landingPageLink || "--" }}</div>
        </div>
        <div class="item">
          <div class="label">发布状态</div>
          <div class="value">
            <el-checkbox v-model="data.publicState" disabled :true-label="1" :false-label="0">
              只用于广告展示
            </el-checkbox>
          </div>
        </div>
        <div class="item">
          <div class="label">评论</div>
          <div class="value">{{ data.commentState | commentStateFilter }}</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="header">广告系列和计划信息</div>
      <div class="content">
        <div class="item">
          <div class="label">系列名称</div>
          <div class="value">{{ data.seriesName }}</div>
        </div>
        <div class="item">
          <div class="label">系列ID</div>
          <div class="value">{{ data.seriesId }}</div>
        </div>
        <div class="item">
          <div class="label">计划名称</div>
          <div class="value">{{ data.planName }}</div>
        </div>
        <div class="item">
          <div class="label">计划ID</div>
          <div class="value">{{ data.planId }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import PreviewWeiboCard from "@/modules/wax/components/advCreative/previewWeiboCard.vue";
  import WeiboContent from "./weiboContent.vue";
  @Component({
    name: "CreativeDetail",
    components: { PreviewWeiboCard, WeiboContent },
    filters: {
      creativeTypeFilter(val: string) {
        switch (val) {
          case "blog":
            return "图文";
          case "feed_activity":
            return "图文card";
          case "feed_video":
            return "视频card";
          default:
            return "--";
        }
      },
      auditResultStatusFilter(val: string) {
        switch (val) {
          case "1":
            return "审核中";
          case "2":
            return "审核通过";
          case "3":
            return "审核拒绝";
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
      commentStateFilter(val: number) {
        switch (val) {
          case 0:
            return "关闭";
          case 1:
            return "开启";
          default:
            return "--";
        }
      },
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
    },
  })
  export default class CreativeDetail extends Vue {
    /**
     * @description 数据源
     */
    @Prop({ type: Object, required: true }) readonly data!: Record<string, any>;

    get link() {
      try {
        return JSON.parse(this.data.weiBoContentLink || "");
      } catch (error) {
        return [];
      }
    }

    // 已审博文和微博博文的 预览
    private handlePreview(previewUrl: string) {
      window.open(previewUrl, "_blank");
    }
  }
</script>

<style lang="less" scoped>
  .creative-detail {
    background: #ffffff;
    border-radius: 4px 4px 0px 0px;
    border: 1px solid #eeeeee;
    .card {
      .header {
        background: #efedfc;
        height: 44px;
        padding-left: 24px;
        line-height: 44px;
        font-weight: 500;
        color: #333333;
      }
      & > .content {
        padding: 20px 24px;
        & > .item {
          &:last-child {
            margin-bottom: 0;
          }
        }
        .item {
          display: flex;
          flex-direction: row;
          margin-bottom: 12px;

          .label {
            width: 140px;
            font-weight: 400;
            color: #666666;
            flex-shrink: 0;
          }
          .value {
            // margin-left: 140px;
            font-weight: 400;
            color: #333333;
            & > img,
            & > video {
              width: 500px;
              height: 250px;
              border: 1px solid #f5f5f5;
              object-fit: contain;
            }
            &.many {
              width: 400px;
              & > .el-image {
                width: 104px;
                height: 104px;
                border: 1px solid #f5f5f5;
                border-radius: 4px;
                margin: 0 10px 10px 0;
              }
            }
          }
        }
      }
    }
  }
</style>
