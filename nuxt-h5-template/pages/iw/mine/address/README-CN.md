# 用户收货地址

## 一. 第三方选择地址传参说明

### 1. 链接及入参说明

* 示例链接：https://health.sina.cn/iw/mine/address?refer=https%3A%2F%2Fhealth.sina.cn%2Fpatient_consult_h5%2Fpages%2FconfirmReciptOrder%2FconfirmReciptOrder
  + 本项目路由：/mine/address
  + 入参字段 **refer**，传参形式 **query**
  + 参数使用 **encodeURIComponent** 编码
  + 参数说明：选择地址回调页面
  + 回调页面兜底：https://health.sina.cn/patient_consult_h5/pages/confirmReciptOrder/confirmReciptOrder

### 2. 返回参数说明
* 示例链接：https://health.sina.cn/patient_consult_h5/pages/confirmReciptOrder/?addressId=12345
  + 返回链接地址为初始携带的 **refer** 字段
  + 返回字段 **addressId**，传参形式 **query**
  + 参数说明 选中的地址id
  + 返回跳转方式 **location.replace**
