<!--
 * @Author         : Qiao
 * @Date           : 2021-03-23 17:41:23
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-01 14:06:46
 * @FilePath       : /src/modules/wax/components/addPlan/addLink.vue
 * @Description    : 指定博文用户
-->

<template>
  <div class="addLink">
    <div class="addLink-content">
      <div class="btn">
        <el-button type="primary" @click="addInput" :disabled="num == 10">添加</el-button>
        <span>（最多添加10条链接）</span>
      </div>
      <ul class="table">
        <li class="el-form-item" v-for="(item, index) in weiboInteractUser" :key="index">
          <el-input
            :class="{ error: rules[index] && rules[index].rules }"
            placeholder="请输入博文链接"
            v-model="weiboInteractUser[index]"
            clearable
            @blur="inputChange(index)"
          />
          <i v-if="index != 0" class="el-icon-error" @click="deleteinput(index)"></i>
          <span class="errormsg" v-if="rules[index] && rules[index].rules">
            {{ rules[index].msg }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { checkLinkUrl } from "@/modules/wax/api/advPlan/index";
  @Component({
    name: "addLink",
  })
  export default class AddLink extends Vue {
    @Prop({ required: false, type: String }) readonly links!: string;
    @Prop({ required: false, type: String }) readonly mids!: string;
    private num = 1;
    private weiboInteractUser: Array<string> = [""];
    private weiboInteractMid: Array<string> = [""];
    private rules: any = [
      {
        rules: false,
        msg: "",
      },
    ];
    private mounted() {
      if (this.links && this.mids) {
        this.weiboInteractUser = this.links.split(",");
        this.weiboInteractMid = this.mids.split(",");
      }
    }

    private addInput() {
      if (this.num < 10) {
        this.num++;
        this.weiboInteractUser.push("");
        this.weiboInteractMid.push("");
        this.rules.push({
          rules: false,
          msg: "",
        });
      }
    }
    private deleteinput(index: number) {
      this.num--;
      this.weiboInteractUser.splice(index, 1);
      this.weiboInteractMid.splice(index, 1);
      this.rules.splice(index, 1);
    }

    private inputChange(index: number) {
      const value: any = this.weiboInteractUser[index];
      if (!value) {
        this.rules.splice(index, 1, {
          rules: true,
          msg: "请输入博文链接",
        });
      } else {
        if (!value.includes("http://weibo.com/") && !value.includes("https://weibo.com/")) {
          this.rules.splice(index, 1, {
            rules: true,
            msg: "请输入有效博文链接",
          });
        } else {
          checkLinkUrl({ linkUrl: value })
            .then((res: any) => {
              this.dataPackage(index, res);
              this.rules.splice(index, 1, {
                rules: false,
                msg: "",
              });
            })
            .catch(() => {
              this.rules.splice(index, 1, {
                rules: true,
                msg: "请输入有效博文链接",
              });
            });
        }
      }
    }

    private dataPackage(index: number, res: any) {
      this.rules[`_${index}`] = {
        rules: false,
        msg: "",
      };
      this.weiboInteractMid.splice(index, 1, res.mid);
      this.$emit("inputChange", this.weiboInteractUser, this.weiboInteractMid);
    }
  }
</script>

<style lang="less" scoped>
  .addLink {
    margin-top: 40px;
    background: #eee;
    border-radius: 2px;
    width: 100%;
    padding: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    &-content {
      overflow: hidden;
      width: 816px;
      .btn {
        display: flex;
        align-items: center;
        /deep/.el-button {
          width: 100px;
          margin-right: 10px;
        }
        span {
          font-size: 16px;
          color: #666;
        }
      }
      .table {
        background: #fff;
        margin-top: 24px;
        padding: 24px 4px 4px 24px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
        .el-form-item {
          width: 242px;
          margin-right: 20px;
          position: relative;
          &:nth-of-type(3n) {
            margin-right: 0;
          }
          .error {
            /deep/.el-input__inner {
              border-color: #f56c6c;
            }
          }
          .errormsg {
            color: #f56c6c;
            font-size: 12px;
            line-height: 1;
            padding-top: 4px;
            position: absolute;
            top: 100%;
            left: 0;
          }
          .el-icon-error {
            position: absolute;
            font-size: 16px;
            color: #ff3b30;
            right: -7px;
            top: -7px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
