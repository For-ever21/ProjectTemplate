import { VuexModule, getModule, Module, Mutation, Action } from "vuex-module-decorators";
import store from "@/store";
import { TemplateDetailRes } from "@/modules/project/api/model";

// interface ObjectArray {
//   [index: number]
// }
// dynamic: true: 动态创建动态模块,即new Vuex.Store({})里面不用注册的.空着就行,
// store,当前模块注册到store上.也可以写在getModule上,即getModule(AppStore,store)
@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "project",
})
class Project extends VuexModule {
  public activityInfo = {}; // 活动form信息
  public templateInfo: TemplateDetailRes | {} = {}; // 选中的模板基础信息
  public templateComp: any = []; // 选中的模板的组件信息
  public compActive = ""; // 当前选中的组件
  public editorActiveIndex = 0; // 编辑器内 选中的组件index 默认勾选商品详情
  public formRefsList: any[] = []; // 各个表单的refs集合

  // getter
  get getActivityInfo() {
    return this.activityInfo;
  }
  get getTemplateInfo() {
    return this.templateInfo;
  }
  get getTemplateComp() {
    return this.templateComp;
  }
  get getCompActive() {
    return this.compActive;
  }
  get getEditorActiveIndex() {
    return this.editorActiveIndex;
  }
  get getFormRefsList() {
    return this.formRefsList;
  }

  @Mutation
  commitActivityInfo(data: Record<string, any>): void {
    this.activityInfo = data;
  }
  @Mutation
  commitTemplateInfo(data: TemplateDetailRes): void {
    this.templateInfo = data;
  }
  @Mutation
  commitTemplateComp(data: Array<any>): void {
    this.templateComp = data;
  }
  @Mutation
  commitCompActive(data: string): void {
    this.compActive = data;
  }
  @Mutation
  commitEditorActiveIndex(data: number): void {
    this.editorActiveIndex = data;
  }
  @Mutation
  commitFormRefsList(data: []): void {
    this.formRefsList = data;
  }

  @Action
  public async templateInfoAction(data: TemplateDetailRes): Promise<void> {
    this.commitTemplateInfo(data);
  }
  @Action
  public async templateCompAction(data: Array<any>): Promise<void> {
    this.commitTemplateComp(data);
  }
  @Action
  public async compActiveAction(data: string): Promise<void> {
    this.commitCompActive(data);
  }
  @Action
  public async editorActiveIndexAction(data: number): Promise<void> {
    this.commitEditorActiveIndex(data);
  }
  @Action
  public async formRefsListAction(data: []): Promise<void> {
    this.commitFormRefsList(data);
  }
}

// 使用getModule: 对类型安全的访问
const projectStore = getModule<Project>(Project);
export default projectStore;
