<!--
 *                        ::
 *                       :;J7, :,                        ::;7:
 *                       ,ivYi, ,                       ;LLLFS:
 *                       :iv7Yi                       :7ri;j5PL
 *                      ,:ivYLvr                    ,ivrrirrY2X,
 *                      :;r@Wwz.7r:                :ivu@kexianli.
 *                     :iL7::,:::iiirii:ii;::::,,irvF7rvvLujL7ur
 *                    ri::,:,::i:iiiiiii:i:irrv177JX7rYXqZEkvv17
 *                 ;i:, , ::::iirrririi:i:::iiir2XXvii;L8OGJr71i
 *               :,, ,,:   ,::ir@mingyi.irii:i:::j1jri7ZBOS7ivv,
 *                  ,::,    ::rv77iiiriii:iii:i::,rvLq@huhao.Li
 *              ,,      ,, ,:ir7ir::,:::i;ir:::i:i::rSGGYri712:
 *            :::  ,v7r:: ::rrv77:, ,, ,:i7rrii:::::, ir7ri7Lri
 *           ,     2OBBOi,iiir;r::        ,irriiii::,, ,iv7Luur:
 *         ,,     i78MBBi,:,:::,:,  :7FSL: ,iriii:::i::,,:rLqXv::
 *         :      iuMMP: :,:::,:ii;2GY7OBB0viiii:i:iii:i:::iJqL;::
 *        ,     ::::i   ,,,,, ::LuBBu BBBBBErii:i:i:i:i:i:i:r77ii
 *       ,       :       , ,,:::rruBZ1MBBqi, :,,,:::,::::::iiriri:
 *      ,               ,,,,::::i:  @arqiao.       ,:,, ,:::ii;i7:
 *     :,       rjujLYLi   ,,:::::,:::::::::,,   ,:i,:,,,,,::i:iii
 *     ::      BBBBBBBBB0,    ,,::: , ,:::::: ,      ,,,, ,,:::::::
 *     i,  ,  ,8BMMBBBBBBi     ,,:,,     ,,, , ,   , , , :,::ii::i::
 *     :      iZMOMOMBBM2::::::::::,,,,     ,,,,,,:,,,::::i:irr:i:::,
 *     i   ,,:;u0MBMOG1L:::i::::::  ,,,::,   ,,, ::::::i:i:iirii:i:i:
 *     :    ,iuUuuXUkFu7i:iii:i:::, :,:,: ::::::::i:i:::::iirr7iiri::
 *     :     :rk@Yizero.i:::::, ,:ii:::::::i:::::i::,::::iirrriiiri::,
 *      :      5BMBBBBBBSr:,::rv2kuii:::iii::,:i:,, , ,,:,:i@petermu.,
 *           , :r50EZ8MBBBBGOBBBZP7::::i::,:::::,: :,:,::i;rrririiii::
 *               :jujYY7LS0ujJL7r::,::i::,::::::::::::::iirirrrrrrr:ii:
 *            ,:  :@kevensun.:,:,,,::::i:i:::::,,::::::iir;ii;7v77;ii;i,
 *            ,,,     ,,:,::::::i:iiiii:i::::,, ::::iiiir@xingjief.r;7:i,
 *         , , ,,,:,,::::::::iiiiiiiiii:,:,:::::::::iiir;ri7vL77rrirri::
 *          :,, , ::::::::i:::i:::i:i::,,,,,:,::i:i:::iir;@Secbone.ii:::
 -->
<!--
 * @Author         : Qiao
 * @Date           : 2021-03-05 14:15:25
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-05 15:55:26
 * @FilePath       : \components\FooterBreadcrumbs2\index.vue
 * @Description    : 底部面包屑&快捷链接
-->

<template>
  <div class="iwen_footerBreadcrumbs2">
    <ul class="crumbs">
      <li v-for="(item, index) in crumbs" :key="index">
        <a :href="item.linkUrl">
          <h1 v-if="item.hasH1">{{ item.title }}</h1>
          <span v-else>{{ item.title }}</span>
        </a>
        <span>&gt;</span>
      </li>
    </ul>
    <div class="linkList">
      <a v-for="(item, index) in linkList" :key="index" :href="item.linkUrl">
        {{ item.title }}
      </a>
    </div>
    <p>@2019爱问医联科技(深圳) 有限公司版权所有</p>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from "vue-property-decorator";
  import { getLocalUrl } from "@/utils/iwen";
  import { BASE_URL } from "@/config/link";

  @Component({
    name: "FooterBreadcrumbs2",
  })
  export default class FooterBreadcrumbs2 extends Vue {
    /**
     * @description 面包屑数据
     */
    @Prop({ required: false, type: Array, default: () => [] }) readonly crumbsData: any;
    @Prop({
      required: false,
      type: Array,
      default: () => [
        { title: "找社区", linkUrl: getLocalUrl("/iw/zsq") },
        { title: "找名医", linkUrl: getLocalUrl("/iw/zmy") },
        { title: "找科室", linkUrl: `${BASE_URL}/zt/departs` },
        { title: "回到首页", linkUrl: getLocalUrl() },
      ],
    })
    readonly linkList: any;
    @Prop({ type: Boolean, default: true }) readonly showLinks: boolean;
    get crumbs() {
      return this.crumbsData;
    }
  }
</script>

<style lang="less">
  .iwen_footerBreadcrumbs2 {
    width: 100%;
    padding: 20px 16px;
    box-sizing: border-box;
    overflow: hidden;
    .crumbs {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 22px;
      li {
        display: flex;
        align-items: center;
        a {
          color: #999;
          & > h1 {
            font-size: 12px;
            margin: 0;
            padding: 0;
          }
        }
        span {
          color: #999;
          margin: 0 2px;
          line-height: 20px;
        }
        &:nth-last-of-type(1) {
          & > span {
            // color: #664ae1;
            display: none;
          }
        }
      }
    }
    .linkList {
      padding: 20px 16px 0;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      a {
        font-size: 12px;
        border: 1px solid #ececec;
        color: #999;
        padding: 3px 9px;
        line-height: 16px;
        margin-right: 10px;
        border-radius: 11px;
        &:nth-last-of-type(1) {
          margin-right: 0;
        }
      }
    }
    p {
      margin-top: 10px;
      font-size: 12px;
      color: #ccc;
      text-align: center;
    }
  }
</style>
