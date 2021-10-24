<template>
  <div class="content">
    <!-- 微博正文-->
    <div class="main_content" v-html="previewContent"></div>
    <div v-if="data && data.length > 140" class="expand_content" @click="handleExpandContent">
      <span>{{ showMore ? "收起全文" : "展开全文" }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  @Component({
    name: "WeiboContent",
  })
  export default class WeiboContent extends Vue {
    /**
     * @description 微博正文数据
     */
    @Prop({ type: String, required: true, default: "" }) readonly data!: string;
    /**
     * @description link 链接
     */
    @Prop({ type: Array, required: false, default: () => [] }) readonly link!: Array<{
      text: string;
      link: string;
    }>;
    private showMore = false;
    private showMoreText = "展开全文";
    private entityMap = {
      escape: {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      },
      unescape: {
        "&amp;": "&",
        "&apos;": "'",
        "&gt;": ">",
        "&lt;": "<",
        "&quot;": '"',
      },
    };
    private entityReg = {
      escape: RegExp("[" + Object.keys(this.entityMap.escape).join("") + "]", "g"),
      unescape: RegExp("(" + Object.keys(this.entityMap.unescape).join("|") + ")", "g"),
    };
    get previewContent() {
      // content 转换为 html 字符
      let content = "";
      if (this.showMore) {
        content = this.data;
      } else {
        content = this.data.slice(0, 140);
      }
      // 空格和换行符转换成HTML标签
      content = content.replace(/\n/g, "<br>");
      content = content.replace(/\r\n/g, "<br>");
      // content = content.replace(/ /g, "&nbsp;");

      const str = content?.replace(/\[(.+?)\]/g, (match: string, p1: string) => {
        const emoijList = require("@/modules/wax/components/advCreative/emoij.json");
        const linkList = this.link;
        let charFormat = "";
        emoijList.forEach((item: any) => {
          if (item.title === p1) {
            charFormat = `<img src="/static/images/emoij/${item.icon}" />`;
          }
        });
        linkList.forEach((item: any) => {
          if (item.text === p1) {
            charFormat = `<a href="${item.link}" target="blank" style="color: #1677ff" class="link"><img src="/static/images/link.png" />${item.text}</a>`;
          }
        });
        if (!charFormat) charFormat = match;
        return charFormat;
      });
      return str;
    }
    // 展开全文
    private handleExpandContent() {
      if (this.showMore) {
        // 收起操作
        this.showMore = false;
      } else {
        // 展开操作
        this.showMore = true;
      }
    }
    // 将HTML转义为实体
    private escape(html: string) {
      if (typeof html !== "string") return "";
      return html.replace(this.entityReg.escape, (match) => {
        return (this.entityMap.escape as any)[match];
      });
    }
    // 将实体转回为HTML
    private unescape(str: string) {
      if (typeof str !== "string") return "";
      return str.replace(this.entityReg.unescape, (match) => {
        return (this.entityMap.unescape as any)[match];
      });
    }
  }
</script>

<style lang="less" scoped>
  .content {
    font-size: 14px;
    color: #333333;
    line-height: 19px;
    margin-bottom: 10px;
    .main_content {
      line-height: 22px;
      word-wrap: break-word;
    }
    .expand_content {
      color: #ff8140;
      display: inline;
      cursor: pointer;
    }
  }
</style>
