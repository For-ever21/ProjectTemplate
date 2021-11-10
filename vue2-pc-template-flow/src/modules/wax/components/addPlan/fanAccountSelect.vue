<!--
 * @Author         : Qiao
 * @Date           : 2021-03-23 16:16:32
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-04-07 14:42:49
 * @FilePath       : /src/modules/wax/components/addPlan/fanAccountSelect.vue
 * @Description    : 粉丝选择组件
-->

<template>
  <div class="fanAccountSelect" v-loading="loading">
    <div class="fanAccountSelect-content">
      <el-input placeholder="输入关键字搜索" v-model="params.key" class="input">
        <el-button slot="append" :disabled="!params.key" @click="init">搜索</el-button>
      </el-input>
      <div class="table">
        <div class="left nodata" v-if="list.length == 0">
          <template v-if="search && params.key && !loading">
            <span class="tip">没有搜索到相关粉丝账号，换个关键字试试吧～</span>
          </template>
          <template v-if="!search && !params.key">
            <span class="tip">请输入关键词进行搜索～</span>
          </template>
        </div>
        <div class="left" v-else>
          <div class="title">
            <el-checkbox
              :disabled="select.length >= 20"
              :indeterminate="isIndeterminate"
              v-model="selectAll"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <p class="exchange" v-if="list.length == 10 || params.page != 1" @click="next">
              换一批
            </p>
          </div>
          <div class="list">
            <el-checkbox-group v-model="select" @change="handleCheckedChange">
              <el-checkbox
                v-for="item in list"
                :key="item.id"
                :disabled="select.length >= 20"
                :label="item.id"
              >
                <div class="li">
                  <el-avatar :size="60" :src="item.avatar" />

                  <span class="wbnickname">{{ item.name }}</span>
                  <span class="fansnum">粉丝数：{{ item.number }}</span>
                  <div class="cleckbox" v-if="select.length < 20">
                    <img v-if="select.includes(item.id)" src="@/assets/images/checked-icon.png" />
                    <img v-else src="../../images/wx.png" />
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="right">
          <div class="top">
            <span>已选（{{ select.length }}/20）</span>
            <span v-if="select.length" class="clear pointer" title="清空" @click="clear">
              清空
            </span>
          </div>
          <ul>
            <template v-for="value in select">
              <li :key="value">
                <span>{{ value | nameFiltter }}</span>
                <i class="el-icon-close pointer" title="删除" @click="deleteItem(value)"></i>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { getSimilarUids } from "@/modules/wax/api/advPlan";
  @Component({
    name: "fanAccountSelect",
    filters: {
      nameFiltter(value: string) {
        return value.split("%")[1];
      },
    },
  })
  export default class FanAccountSelect extends Vue {
    @Prop({ required: true, type: String }) readonly data!: string;
    private loading = false;
    private search = false;
    private isIndeterminate = true;
    private params = {
      key: "",
      page: 1,
      pageSize: 10,
    };
    private selectAll = false;

    private list: any = [];

    get select() {
      let arr: any = [];
      if (this.data) {
        arr = this.data.split(",");
      } else {
        arr = [];
      }
      return arr;
    }

    set select(val) {
      this.$emit("update:data", val.join(","));
    }
    private mounted() {
      this.getCurrentSecondNnm();
    }

    private init() {
      if (!this.params.key)
        return this.$message({
          message: "请输入关键字进行搜索",
          type: "error",
        });
      this.loading = true;
      this.search = true;
      getSimilarUids(this.params)
        .then((res: any) => {
          this.loading = false;
          if (res) {
            this.loading = false;
            this.packageData(res);
            if (res.length < 10 && this.params.page != 1) this.params.page = 0;
          } else {
            this.list = [];
          }
        })
        .catch(() => {
          this.list = [];
          this.loading = false;
          this.$message({
            message: "获取指定粉丝账号列表失败！请稍后再试",
            type: "error",
          });
        });
    }
    private packageData(res: Array<string>) {
      this.list = [];
      res.forEach((item: string) => {
        const arr = item.split("%");
        this.list.push({ name: arr[1], avatar: arr[2], number: arr[3], id: item });
      });
      this.getCurrentSecondNnm();
    }
    private next() {
      this.params.page++;
      this.init();
    }
    private checkItem(id: any) {
      const arr = this.select;
      if (arr.length >= 20) return;
      const num = arr.indexOf(id);
      if (num > -1) arr.splice(num, 1);
      else arr.push(id);
      this.getCurrentSecondNnm();
      this.$emit("update:data", arr.join(","));
    }

    // 全选判断
    private getCurrentSecondNnm() {
      let num = 0;
      for (const item of this.list) {
        if (this.select.includes(item.id)) num++;
      }
      this.selectAll = num === this.list.length;
      this.isIndeterminate = num > 0 && num < this.list.length;
    }

    //清空
    private clear() {
      this.$emit("update:data", "");
      this.selectAll = false;
    }

    // 全选
    private handleCheckAllChange(val: any) {
      /*
       * 全选时：将this.secondList 中未添加到到this.allSelect中的dictId全部添加
       * 取消全选：将this.allSelect 存在的 this.secondList 的 dictId全部删除
       */
      const addArr: any[] = this.select; // 用来 储存新增后的数据
      const resetArr: any[] = this.select; // 用户储存取消全选之后的数据
      this.list.forEach((item: any) => {
        const num = this.select.indexOf(item.id);
        if (num == -1 && val && addArr.length != 20) addArr.push(item.id);
        else if (num > -1 && !val) resetArr.splice(num, 1);
      });
      // this.allSelect = val ? addArr : resetArr;
      if (val) this.$emit("update:data", addArr.join(","));
      else this.$emit("update:data", resetArr.join(","));
      this.isIndeterminate = false;
    }
    // 单选
    private handleCheckedChange() {
      this.getCurrentSecondNnm();
    }

    // 删除
    private deleteItem(id: string) {
      const arr = this.select;
      const index = arr.indexOf(id);
      if (index > -1) arr.splice(index, 1); // 确保需要删除的这一条存在
      this.$emit("update:data", arr.join(","));
      this.getCurrentSecondNnm();
    }
  }
</script>

<style lang="less" scoped>
  .fanAccountSelect {
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
      /deep/.el-button {
        width: 100px;
        background: @default-color;
        font-size: 14px;
        color: #fff;
      }
      .input {
        width: 1026px;
        /deep/.el-button {
          width: 100px;
          background: @default-color;
          border-radius: 0 4px 4px 0;
          font-size: 14px;
          color: #fff;
        }
      }
      .table {
        margin-top: 24px;
        display: flex;
        align-items: center;

        .left {
          width: 766px;
          min-height: 384px;
          background-color: #fff;
          padding: 24px 4px 24px 24px;
          box-sizing: border-box;
          box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
          &.nodata {
            height: 384px;
            box-sizing: border-box;
            box-shadow: none;
            display: flex;
            align-items: center;
            .tip {
              display: block;
              width: 100%;
              text-align: center;
              font-size: 16px;
              color: #999;
            }
          }
          .title {
            display: flex;
            align-items: center;
            font-size: 16px;
            padding-right: 64px;
            /deep/.el-checkbox__label {
              font-size: 16px;
              margin-left: 5px;
            }
            p {
              margin-left: 12px;
              cursor: pointer;
              color: #1677ff;
            }
          }
          .list {
            display: flex;
            flex-wrap: wrap;
            /deep/.el-checkbox {
              margin: 20px 10px 0 0;
            }
            /deep/.el-checkbox__input {
              display: none;
            }
            /deep/.el-checkbox__label {
              padding-left: 0px;
            }
            .li {
              cursor: pointer;
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 135px;
              height: 135px;
              border-radius: 4px;
              border: 1px solid #dcdfe6;
              overflow: hidden;
              padding: 14px;
              box-sizing: border-box;
              .wbnickname {
                width: 100%;
                margin-top: 10px;
                color: #333;
                font-size: 14px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-align: center;
              }
              .fansnum {
                font-size: 12px;
                color: #666;
                text-align: center;
              }
              .cleckbox {
                position: absolute;
                right: 6px;
                top: 6px;
                width: 16px;
                height: 16px;
                img {
                  width: 100%;
                  height: auto;
                }
              }
            }
          }
        }
        .right {
          width: 236px;
          height: 384px;
          box-sizing: border-box;
          margin-left: 24px;
          overflow: hidden;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          display: flex;
          flex-direction: column;
          background: #fff;
          .top {
            height: 54px;
            background: rgba(102, 74, 225, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 17px 24px;
            box-sizing: border-box;
            font-size: 14px;
            color: #333;
            .clear {
              color: #1677ff;
            }
          }
          ul {
            flex: 1;
            overflow-y: auto;
            li {
              padding: 0 24px;
              display: flex;
              align-items: center;
              border-bottom: 1px solid #dcdfe6;
              box-sizing: border-box;
              height: 54px;
              justify-content: space-between;
              font-size: 14px;
              color: #999;
              span {
                flex: 1;
                white-space: nowrap;
                width: 126px;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #666;
              }
            }
          }
        }
      }
    }
  }
</style>
