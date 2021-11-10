export interface AttributeJsonGoods {
  bannerImageList: Array<number>; // banner列表
  skuList: Array<SkuList>; // 商品规格列表
  sub: any[]; // 广告图
  spuId: string; // spuId
  spuName: string; // spu名称
  spuPrice: string; // 商品价格
}

export interface AttributeJsonImage {
  imageInfo: Array<ImageList>; // banner列表
  isAutoPlay: boolean; // 是否自动播放
  isLazy: boolean; // 是否懒加载
  isLoop: boolean; // 是否循环播放
}

export interface AttributeJsonSku {
  buttonName: string; // 按钮名称
}

export interface AttributeJsonButton {
  backgroundColor: string; // 按钮背景色
  buttonName: string; // 按钮名称
  fontColor: string; // 字体颜色
  isJump: boolean; // 是否跳转
  jumpUrl: string; // 跳转地址
}

export interface AttributeJsonText {
  fontColor: string; // 字体颜色
  fontFamily: string; // 字体
  fontItalics: string; // 字体正斜体
  fontSize: string; // 字号
  fontUnline: string; // 字体下划线
  fontWeight: string; // 字重
  href: string; // 链接
  lineHeight: string; // 行距
  textAlign: string; // 对其方式
}

export interface SkuList {
  frequency?: string; // 次数
  mode?: string; // 模式
  maxPrice: number; // 最大价格
  minPrice: number; // 最小价格
  specificationName: string; // 规格名称
}

export interface ImageList {
  imgUrl: string; // 图片地址
  linkUrl: string; // 链接地址
}
