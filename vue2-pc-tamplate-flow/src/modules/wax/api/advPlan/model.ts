type OpenStatus = 0 | 1;

export interface FindProgramPage {
  createTimeMax?: string; // 创建时间最大值
  createTimeMin?: string; // 创建时间最小值
  id?: string; // 计划id
  name?: string; // 计划名称
  pageNum: number; // 页码
  pageSize: number; // 每页大小
  seriesId?: string; // 系列id
  seriesName?: string; // 系列名称
  status?: string; // 计划状态
  // target?: string; // 营销目标
}

export interface Exchange {
  key?: "";
  page: number;
  pageSize: number;
}

export interface SimplePlanSeriesRes {
  planId: string;
  planName: string;
  seriesId: string;
  seriesName: string;
  userId: string;
}
// 列表页修改出价、日预算
export interface EditPrice {
  cpmPrice: string | number;
  dayBudget: string | number;
  id: string;
  userId?: string;
}

export interface ChangeOpenStatus {
  id: string;
  openStatus?: number;
}

export interface PageOnePlanUserActionHourStatistic {
  pId: string;
  endDs: string;
  endHh: string;
  pageNum: string;
  pageSize: string;
  startDs: string;
  startHh: string;
}
