<template>
  <input type="file" ref="inputNode" @change="changeImage($event)" :accept="accept" />
</template>
<script lang="ts">
  import { Vue, Prop, Component, Watch, Ref } from "vue-property-decorator";
  @Component({
    name: "InputFile",
  })
  export default class InputFile extends Vue {
    @Ref() readonly inputNode!: HTMLInputElement;
    // 可上传的文件类型
    @Prop({
      type: String,
      default: () => {
        "image/*";
      },
    })
    readonly acceptFormat!: string;
    // 文件大小最大值
    @Prop({ type: Number, default: 0 }) readonly maxSize!: number;
    // 输出类型
    @Prop({ type: String, default: "" }) readonly outputFormat!: string;
    @Watch("acceptFormat", { immediate: true })
    acceptFormatChange() {
      this.accept = this.acceptFormat;
    }

    private accept = "";
    private base64 = "";
    private file: Blob = new Blob();

    private select() {
      this.inputNode.click();
    }

    private clear() {
      this.inputNode.value = "";
    }

    private changeImage(event: Event) {
      const target = event.target as HTMLInputElement;
      let file: File = (target.files as FileList)[0];
      this.file = file;
      if (this.maxSize) {
        let isLt8M = file.size / 1024 / 1024 < this.maxSize;
        if (!isLt8M) {
          this.$message.error(`上传的图片大小不能超过 ${this.maxSize}MB!`);
          return false;
        }
      }
      if (this.outputFormat == "arraybuffer") {
        this.readAsArrayBuffer((data: any) => {
          this.$emit("change", {
            data: data,
            arraybuffer: data,
          });
        }, this);
      } else {
        this.readAsDataURL((data: any) => {
          this.$emit("change", {
            data: data,
            base64: data,
          });
        }, this);
      }
    }

    private readAsDataURL(callBack: Function, context: Vue) {
      if (this.file) {
        const reader: FileReader = new FileReader();
        reader.onload = function (e) {
          let data = (e.target as FileReader).result;
          callBack && callBack.call(context, data);
        };
        reader.readAsDataURL(this.file);
      }
    }

    private getBlobData() {
      return this.file;
    }

    private readAsArrayBuffer(callBack: Function, context: Vue) {
      if (this.file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          let data = (e.target as FileReader).result;
          callBack && callBack.call(context, data);
        };
        reader.readAsArrayBuffer(this.file);
      }
    }
  }
</script>
