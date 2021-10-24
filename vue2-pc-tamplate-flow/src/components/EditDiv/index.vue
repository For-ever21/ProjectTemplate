<template>
  <div
    class="edit-div"
    v-html="innerText"
    :placeholder="placeholder"
    contenteditable="plaintext-only"
    @keydown.enter="handleKeyDownEnter"
    @keydown.delete="handleKeyDownDelete"
    @focus="handleFocus"
    @blur="handleBlur"
    @input="changeText"
  ></div>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from "vue-property-decorator";
  @Component({
    name: "v-edit-div",
  })
  export default class VEditDiv extends Vue {
    /**
     * @description v-model 数据
     */
    @Prop({ type: String, default: "" }) readonly value!: string;
    /**
     * @description 提示词
     */
    @Prop({ type: String, default: "" }) readonly placeholder!: string;
    /**
     * @description 禁止换行
     */
    @Prop({ type: Boolean, default: false }) readonly nowrap!: boolean;
    /**
     * @description link 链接
     */
    @Prop({ type: Array, required: false, default: () => [] }) readonly link!: Array<{
      text: string;
      link: string;
    }>;
    private innerText = this.value;
    private isLocked = false;
    @Watch("value")
    private valueChange() {
      if (!this.isLocked && !this.innerText) {
        this.innerText = this.value;
      }
    }
    private changeText() {
      // 解决：末尾换行，看不见的<br>，删不掉，造成清空无法出现placeholder文字
      if ((this.$el as HTMLElement).innerText == "<br>") {
        (this.$el as HTMLElement).innerText = "";
      }
      // innerHTML 方法 会将 <>^ 转义成字符实体
      let str = (this.$el as HTMLElement).innerText;
      // 过滤html标签
      str = str.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
      str = str.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
      str = str.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
      str = str.replace(/&nbsp;/gi, ""); //去掉&nbsp;
      this.$emit("input", str);
    }
    private handleKeyDownEnter(e: Event) {
      if (this.nowrap) {
        e.preventDefault();
      }
    }
    private handleKeyDownDelete(e: Event) {
      // 监听删除
      const selection: any = window.getSelection();
      const range: any = selection.getRangeAt(0);
      const innerText = (this.$el as HTMLElement).innerText;
      let caretOffset = 0;
      // 获取光标位置
      if (selection.rangeCount > 0) {
        //选中的区域
        const preCaretRange = range.cloneRange(); //克隆一个选中区域
        preCaretRange.selectNodeContents(this.$el); //设置选中区域的节点内容为当前节点
        preCaretRange.setEnd(range.endContainer, range.endOffset); //重置选中区域的结束位置
        caretOffset = preCaretRange.toString().length;
      }
      // console.log("caretOffset", caretOffset);
      const deleteText = innerText[caretOffset - 1];
      // console.log("deleteText", deleteText);
      const content = innerText.slice(0, caretOffset);
      const endContent = innerText.slice(caretOffset, innerText.length);
      if (deleteText === "]") {
        const reg = /\[[^[]*\](?!\[)$/;
        let charFormatFlag = false;
        const str = content?.replace(reg, (match: string) => {
          const linkList = this.link;
          linkList.forEach((item: any) => {
            if (`[${item.text}]` === match) {
              charFormatFlag = true;
            }
          });
          return charFormatFlag ? "" : match;
        });
        if (charFormatFlag) {
          e.preventDefault();
          const filterContent = str + endContent;
          (this.$el as HTMLElement).innerText = filterContent;
          this.$emit("input", filterContent);
          // 设置光标位置
          const range = document.createRange(); //创建一个选中区域
          range.selectNodeContents(this.$el); //选中节点的内容
          if (this.$el.innerHTML.length > 0) {
            range.setStart(this.$el.childNodes[0], str.length); //设置光标起始为指定位置
          }
          range.collapse(true); //设置选中区域为一个点
          selection.removeAllRanges(); //移出所有的选中范围
          selection.addRange(range); //添加新建的范围
        }
      }
    }
    private focus() {
      (this.$el as any).focus();
    }
    private handleFocus() {
      this.isLocked = true;
      this.$emit("focus");
    }
    private handleBlur() {
      this.isLocked = false;
      // 清掉编辑器自带的br标签
      if ((this.$el as HTMLElement).innerText.indexOf("<br>") > -1) {
        (this.$el as HTMLElement).innerText = (this.$el as HTMLElement).innerText.replace(
          "<br>",
          ""
        );
        this.$emit("input", (this.$el as HTMLElement).innerText);
      }
      this.$emit("blur");
    }
    // TODO: 将 [] 转换为字符实体
    private escape(html: string) {
      let str = html;
      str = str.replace("[", "&lbrack;");
      str = str.replace("]", "&rbrack;");
      return str;
    }
  }
</script>
<style>
  .edit-div {
    width: 100%;
    height: 100%;
    overflow: auto;
    word-break: break-all;
    outline: none;
    user-select: text;
    white-space: pre-wrap;
    text-align: left;
  }
  .edit-div[contenteditable] {
    /* user-modify: read-write-plaintext-only; */
    -webkit-user-modify: read-write-plaintext-only;
  }
  .edit-div[contenteditable]:empty:not(:focus):before {
    content: attr(placeholder);
    display: block;
    color: #ccc;
  }
</style>
