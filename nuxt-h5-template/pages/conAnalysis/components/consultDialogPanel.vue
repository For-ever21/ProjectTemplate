<template>
  <div class="consult-dialog-panel">
    <client-only>
      <Previewer ref="previewer" :list="previewList" />
    </client-only>

    <div v-for="dialogs in generateList" :key="dialogs.id" class="dialog-block">
      <div v-show="dialogs.showTime" class="dialog-time">{{ dialogs.postTime | FILTER_YMDHM }}</div>
      <div v-if="dialogs.isQuest" class="dialog-box-wrap quest">
        <div class="dialog-box">
          <!-- 患者不能发语音 -->
          <div
            v-if="dialogs.type === 'text'"
            class="dialog-box-text"
            v-html="dialogs.content"
          ></div>
          <div v-if="dialogs.type === 'img'" class="dialog-box-img">
            <!-- 患者不展示图片 -->
            <div class="desc">用户上传了图片</div>
            <div class="tip">
              <i class="icon-eye-close"></i>
              部分信息和图片因保护患者隐私已被医生屏蔽
            </div>
          </div>
          <div class="tail"></div>
        </div>
      </div>
      <div v-else class="dialog-box-wrap doctor">
        <div class="avator-wrap">
          <img
            :src="mergeDoctorData.avatarUrl"
            :alt="mergeDoctorData.realName + mergeDoctorData.titles"
          />
        </div>
        <div class="dialog-box" :class="dialogs.type">
          <div
            v-if="dialogs.type === 'text'"
            class="dialog-box-text"
            v-html="dialogs.content"
          ></div>
          <div v-if="dialogs.type === 'img'" class="dialog-box-img">
            <img
              v-for="(imgSrc, imgIndex) in dialogs.picIds"
              :key="imgIndex"
              :src="imgSrc"
              :alt="consultShareInfo.seoTitle"
              @click="showPreviewer(dialogs.previewList, imgIndex)"
            />
          </div>
          <div v-if="dialogs.type === 'voice'" class="dialog-box-voice">
            <audio :src="dialogs.src" controls controlsList="nodownload"></audio>
          </div>
          <div class="tail"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  import ConsultcaseModel from "@/api/home/model/consultcaseModel";
  import { IPreview, ConsultDialogItemType } from "../types";

  @Component<ConsultDialogPanel>({
    name: "ConsultDialogPanel",
  })
  export default class ConsultDialogPanel extends Vue {
    @Prop({ default: () => ({}) })
    consultShareInfo: ConsultcaseModel.IConsultShareInfo;

    @Prop({ default: () => ({}) })
    doctorData: ConsultcaseModel.IDoctorInfo;

    docotrAvatarUrl: string = require("@/assets/images/default/bg_head_doctor.png");
    shieldImg: string = require("@/assets/images/shield.png");
    previewList: IPreview[] = [];
    showPreviewer(previewList: IPreview[], index: number) {
      this.previewList = previewList;
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.previewer.show(index);
      });
    }
    get mergeDoctorData() {
      const obj = { ...this.doctorData };
      if (!obj.avatarUrl) {
        obj.avatarUrl = this.docotrAvatarUrl;
      }
      return obj;
    }
    get generateList() {
      /**
       * 语音、文字、图片都单独显示
       *
       * 文字和图片可能共存
       */
      const generateList: ConsultDialogItemType[] = [];
      this.consultShareInfo.dialogs.forEach((item, index) => {
        const comoonData = {
          isQuest: item.isQuest,
          postTime: item.postTime,
          showTime: true,
        };
        if (item.replyMsgType === "2") {
          generateList.push({
            ...comoonData,
            type: "voice",
            src: item.content,
            id: "voice" + index,
          });
        } else {
          if (item.content) {
            generateList.push({
              ...comoonData,
              type: "text",
              content: item.content,
              id: "text" + index,
            });
          }
          if (item.picShieldEd) {
            // 存在缺省图
            if (!item.picIds) {
              item.picIds = [];
            }
            if (item.picIds[item.picIds.length - 1] !== this.shieldImg) {
              item.picIds.push(this.shieldImg);
            }
          }

          if (item.picIds && item.picIds.length > 0) {
            generateList.push({
              ...comoonData,
              type: "img",
              picIds: item.picIds,
              previewList: item.picIds.map((src) => ({
                src,
              })),
              id: "img" + index,
              showTime: !item.content,
            });
          }
        }
      });
      return generateList;
    }
    private mounted() {}
  }
</script>
<style lang="less">
  .consult-dialog-panel {
    font-size: 12px;

    .dialog-block {
      margin-bottom: 20px;
      .dialog-time {
        font-size: 12px;
        line-height: 18px;
        text-align: center;

        color: #999999;

        margin-bottom: 16px;
      }
      .dialog-box-wrap {
        &.quest {
          text-align: right;
          padding-right: 10px;
          .dialog-box {
            background: #efecfb;
            max-width: 100%;
          }
          .tail {
            top: 6px;
            right: -10px;
            border-top-color: #efecfb !important;
          }
          .dialog-box-img {
            .desc {
              line-height: 20px;
              text-align: left;
            }
            .tip {
              text-align: left;
              font-size: 12px;
              color: #999;
              line-height: 17px;
              .icon-eye-close {
                display: inline-block;
                position: relative;
                width: 12px;
                height: 12px;
                top: 2px;
                background: url("~@/assets/images/icons/eye_close@2x.png") no-repeat;
                background-size: contain;
              }
            }
          }
        }
        &.doctor {
          text-align: left;
          font-size: 0;
          .avator-wrap {
            vertical-align: top;
            width: 48px;
            height: 48px;
            display: inline-block;
            margin-right: 16px;

            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }
          .dialog-box {
            background-color: #f5f5f7;

            max-width: calc(100% - 70px);
            &.img {
              padding: 5px 5px;
              max-width: 190px;
            }
            &.voice {
              padding: 5px 5px;
              audio {
                display: block;
                max-width: 100%;
                height: 54px;
                &:focus {
                  border: none;
                  outline: none;
                }
              }
            }
          }
          .dialog-box-img {
            position: relative;
            z-index: 12;
            font-size: 0;
            line-height: 1;
            img {
              display: inline-block;
              width: 80px;
              height: 80px;
              flex-shrink: 0;
              margin: 5px;

              border-radius: 6px;
            }
          }
          .tail {
            top: -2px;
            left: -10px;
            border-bottom-color: #f5f5f7 !important;
          }
        }
        .dialog-box {
          position: relative;
          border-radius: 18px 20px 20px 18px;
          padding: 10px 16px;
          display: inline-block;
          min-height: 30px;
          .dialog-box-text {
            font-size: 14px;
            color: #333333;
            line-height: 20px;
            word-break: break-all;
            a {
              color: #664ae1 !important;
              &:link,
              &:visited,
              &:focus,
              &:active {
                color: #664ae1 !important;
              }
            }
          }

          .tail {
            width: 0;
            height: 0;
            position: absolute;
            border: 12px solid transparent;
          }
        }
      }
    }
  }
</style>
