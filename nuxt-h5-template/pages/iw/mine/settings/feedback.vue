<template>
  <transition name="index">
    <!-- 此页面不做SEO -->
    <client-only>
      <section class="feedback">
        <HeaderNav title="意见反馈" />
        <div class="app_wrapper_inner">
          <div class="text">
            <p class="lab">
              <span class="title">填写留言</span>
              <span class="num">{{ content.length }}/500</span>
            </p>
            <textarea
              v-model="content"
              placeholder="请详细描述您遇到的问题和建议以便我们更好的帮助您"
              @input="textareChange"
            ></textarea>
          </div>

          <div class="uploadImg">
            <p class="lab">
              <span class="title">上传图片（选填）</span>
              <span class="num">{{ imgKeys.length }}/4</span>
            </p>
            <ul class="imgList">
              <li
                v-for="(img, index) in imgKeys"
                :key="index"
                :style="{ background: 'url(' + img + ') no-repeat center center / cover' }"
                @click="showImg(img)"
              >
                <img
                  class="del"
                  src="../images/subscribe_delete@2x.png"
                  alt=""
                  @click.stop="deiImg(index)"
                />
              </li>
              <li v-if="imgKeys.length < 4" class="upload">
                <span class="add">+</span>
                <input type="file" accept="image/*" @change="handleUploadImg($event)" />
              </li>
            </ul>
          </div>

          <div class="phone">
            <p class="lab">
              <span class="title">联系电话</span>
            </p>
            <!--<input
          type="tel"
          v-model="phone"
          @input="phoney"
          maxlength="11"
          placeholder="请输入您的手机号便于我们与你联系"/>-->

            <input
              v-model="phone"
              type="tel"
              maxlength="11"
              placeholder="请输入您的手机号便于我们与你联系"
            />
          </div>

          <div class="save">
            <van-button
              type="primary"
              :loading="submitLoading"
              :disabled="!content || !phone"
              @click="handleSubmit"
            >
              提 交
            </van-button>
          </div>

          <van-overlay class-name="showImg" :show="!!imgSrc" z-index="9999" @click="imgSrc = ''">
            <div class="showImg_content"></div>
            <img :src="imgSrc" />
          </van-overlay>
        </div>
        <nuxt-link class="fixBackHome" to="/iw/">
          <i class="backToIndex"></i>
        </nuxt-link>
      </section>
    </client-only>
  </transition>
</template>

<script lang="ts">
  import { Vue, Component } from "vue-property-decorator";

  import { uploadImg } from "@/api/baseService";
  import { saveFeedback } from "@/api/user/userService";

  import { Toast } from "vant";

  @Component({
    name: "Feedback",
  })
  export default class Feedback extends Vue {
    private submitLoading: boolean = false;
    private content: string = "";
    private phone: string = "";
    private imgSrc: string = "";
    private appToken: string = "";

    private imgKeys: Array<any> = [];

    private created() {
      this.appToken = (this.$route.query as any).appToken || "";
    }

    private textareChange() {
      if (this.content.length > 500) this.content = this.content.substr(0, 500);
    }

    private handleUploadImg(e: any) {
      // 上传头像
      const file = e.target.files[0];
      const data = {
        data: { fileName: "image" },
        name: "image",
        file,
      };
      this.uploadSubmit(data);
    }
    private uploadSubmit(data: any) {
      uploadImg(data)
        .then((res) => {
          this.imgKeys.push(res.url);
        })
        .catch(() => {
          Toast.fail("上传失败");
        });
    }
    // 展示图片大图
    private showImg(img: string) {
      this.imgSrc = img;
    }

    // 删除对应图片
    private deiImg(index: number) {
      this.imgKeys.splice(index, 1);
    }
    private phoney() {
      if (this.phone.length < 11) return;
      if (!/^1[3-9][0-9]{9}$/.test(this.phone)) Toast.fail("请输入正确的手机号");
    }
    // 保存反馈信息
    private handleSubmit() {
      if (!/^1[3-9][0-9]{9}$/.test(this.phone)) return Toast.fail("请输入正确的手机号");
      const params = {
        content: this.content,
        phone: this.phone,
        imgKeys: this.imgKeys.join(";"),
        status: 1,
      };
      this.submitLoading = true;
      saveFeedback(params)
        .then(() => {
          Toast.success("提交成功");
          this.submitLoading = false;
          if (this.appToken) window.iwenJSNativeBridge.goBack();
          else this.$router.back();
        })
        .catch((err: any) => {
          Toast.fail(err.message);
          this.submitLoading = false;
        });
    }
  }
</script>

<style scoped lang="less">
  .feedback {
    .app_wrapper_inner {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;

      .text {
        width: 100%;

        textarea {
          padding: 8px 10px;
          box-sizing: border-box;
          margin-top: 20px;
          width: 100%;
          height: 90px;
          background: #f8f8fa;
          border-radius: 6px;
          border: none;
          font-size: 18px;
          font-weight: 400;
          color: #333;
          line-height: 20px;

          &::placeholder {
            color: #999;
            font-size: 16px;
          }
        }
      }

      .uploadImg {
        margin-top: 20px;

        .imgList {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          li {
            width: 80px;
            height: 80px;
            background: #f8f8fa;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 20px 0 0;

            .del {
              position: absolute;
              right: -4px;
              top: -4px;
              z-index: 2;
              width: 16px;
              height: 16px;
            }

            .add {
              position: relative;
              z-index: 1;
              color: #ccc;
              opacity: 0.49;
              font-size: 50px;
              //font-weight: bold;
            }

            input {
              display: block;
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              z-index: 3;
              opacity: 0;
            }
          }
        }
      }

      .phone {
        margin-top: 20px;

        input {
          margin-top: 20px;
          display: block;
          width: 100%;
          height: 48px;
          background: #f8f8fa;
          border-radius: 4px;
          padding: 13px 10px;
          box-sizing: border-box;
          color: #333;
          font-size: 18px;
          line-height: 23px;

          &::placeholder {
            font-size: 16px;
            color: #bbb;
          }
        }
      }

      .lab {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
          font-size: 18px;
          line-height: 25px;
          display: flex;
          align-items: center;

          &.tip {
            &:before {
              display: flex;
              content: "*";
              color: #ed3833;
            }
          }
        }

        .num {
          font-size: 14px;
          color: #999;
          line-height: 20px;
        }
      }
    }

    .save {
      margin-top: 40px;
      width: 100%;
      height: 50px;

      button {
        width: 100%;
        height: 100%;
        background: #664ae1;
        border-radius: 25px;
        font-size: 17px;
        font-weight: 400;
        color: #fff;
        line-height: 24px;
        border: none;

        &:disabled {
          background: #e6e6e6;
        }
      }
    }

    .showImg {
      display: flex;
      align-items: center;
      justify-content: center;

      &_content {
        img {
          max-width: 90%;
          max-height: 90%;
        }
      }
    }
  }
</style>
