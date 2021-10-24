<template>
  <van-radio :name="name">
    {{ label }}
    <template #icon="props">
      <img class="radio-icon" :src="props.checked ? activeIcon : inactiveIcon" />
    </template>
  </van-radio>
</template>

<script lang="ts">
  import { Vue, Prop, Component } from "vue-property-decorator";

  @Component({
    name: "IWenRadio",
  })
  export default class IWenRadio extends Vue {
    /**
     * radio 传入的value
     */
    @Prop({ required: true, type: [String, Number] }) readonly name: string | number;
    /**
     * radio 名称
     */
    @Prop({ required: true, type: String }) readonly label: string;
    private activeIcon = require("@/assets/images/icons/radio_checked.png");
    private inactiveIcon = require("@/assets/images/icons/radio_uncheck.png");
  }
</script>

<style>
  .radio-icon {
    width: 14px;
    height: 14px;
  }
</style>
