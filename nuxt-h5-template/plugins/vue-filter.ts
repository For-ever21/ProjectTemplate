import Vue from "vue";
import { numberFormat, numberFormatEn } from "@/utils/numStrUtil";
import { formatToDateTime } from "@/utils/dateUtil";

const filters = {
  // 时间格式转换
  FILTER_YMDHM: (date: string) => {
    return formatToDateTime(date);
  },
  // 万，亿 单位转换
  millionFiltter(val: number) {
    return numberFormat(val);
  },
  // k,m 单位转换
  numberFormatter(num: number) {
    return numberFormatEn(num);
  },
};

// 注册全局 vue 过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, (filters as any)[key]);
});
