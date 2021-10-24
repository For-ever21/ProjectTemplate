export interface IAppState {
  device: Device; // 当前应用所在设备名
  browser: Browser; // 当前应用的浏览器类型
  chooseCityName: string; // 当前选择的城市
  chooseCityId: string; // 当前选择的城市id
  localCityName: string; // 当前定位的城市
  localCityId: string; // 当前定位的城市id
  localLat: Number; // 定位的纬度
  localLng: Number; // 定位的经度
  isGpsEnable: Boolean; // GPS功能是否启用
  messageCount: Number; // 消息 数量
}

export interface ICityObj {
  latitude: number; // 纬度
  longitude: number; // 经度
  cityname?: string; // 城市名
  cityId?: string; // 城市id
  province?: string; // 省份名
  district?: string; // 区名
  street?: string; // 街道名
  streetNumber?: string; // 街道号
}
