import Vue from "vue";
import SvgIcon from "@/components/SvgIcon/index.vue"; // svg 全局组件
import Empty from "@/components/Empty/index.vue"; // 空状态组件
import HeaderNav from "@/components/HeaderNav/index.vue"; // 顶部导航组件

// 全局组件
const components = {
  SvgIcon,
  Empty,
  HeaderNav,
};

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component);
});

// 预请求svg组件(通过之前的svg-sprite-loader加载)
const req = (require as any).context("@/assets/icons", true, /\.svg$/);
const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
requireAll(req);
