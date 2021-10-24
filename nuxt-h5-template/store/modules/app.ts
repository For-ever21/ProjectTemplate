import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

import { IAppState, ICityObj } from "../types";
@Module({
  namespaced: true,
  stateFactory: true,
  name: "modules/app",
})
export default class App extends VuexModule implements IAppState {
  public device: Device = "desktop";
  public browser: Browser = "browser";
  public chooseCityName = "";
  public chooseCityId = "";
  public localCityName = "";
  public localCityId = "";
  public localLat = 39.5426;
  public localLng = 116.2329;
  public isGpsEnable = false;
  public messageCount = 0;

  @Mutation
  private SET_DEVICE(device: Device) {
    this.device = device;
  }

  @Mutation
  private SET_BROWSER(browser: Browser) {
    this.browser = browser;
  }

  @Mutation
  private SET_CHOOSE_CITY(city: ICityObj) {
    this.chooseCityName = city.cityname || "";
    this.chooseCityId = city.cityId || "";
  }

  @Mutation
  private SET_LOCALTION(city: ICityObj) {
    this.localCityName = city.cityname || "";
    this.localCityId = city.cityId || "";
    this.localLat = city.latitude;
    this.localLng = city.longitude;
  }

  @Mutation
  private SET_GPS_ENABLE(isGpsEnable: boolean) {
    this.isGpsEnable = isGpsEnable;
  }

  @Mutation
  private SET_MESSAGE_COUNT(data: number) {
    this.messageCount = data;
  }

  @Action
  public SetDevice(device: Device) {
    this.SET_DEVICE(device);
  }

  @Action
  public SetBrowser(browser: Browser) {
    this.SET_BROWSER(browser);
  }

  @Action
  public SetChooseCity(data: ICityObj) {
    this.SET_CHOOSE_CITY(data);
  }

  @Action
  public SetLocationCity(data: ICityObj) {
    // TODO: 这里需要调接口 返回自己应用里的城市数据
    // const res = {
    //   cityname: "",
    //   cityId: "",
    // };
    // const positionData = Object.assign(data, res);
    this.SET_LOCALTION(data);
  }

  @Action
  public SetGpsEnable(data: boolean) {
    this.SET_GPS_ENABLE(data);
  }

  @Action
  public SetMessageCount(data: any) {
    this.SET_MESSAGE_COUNT(data);
  }
}
