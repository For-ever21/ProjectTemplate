export interface Account {
  balance: string | number;
  todayCost: string | number;
  waxDayDudget: string | number;
  [propName: string]: any;
}

export interface SetDayDudget {
  dayDudget: string | number;
}

export interface Statistics {
  waittingPlanCount: string | number;
  puttingPlanCount: string | number;
  suspendedPlanCount: string | number;
  notCreativePlanCount: string | number;
  auditCreativeCount: string | number;
  refuseCreativeCount: string | number;
  [propName: string]: any;
}

export interface SaveAdvUser {
  name: string;
  phoneNum: string;
  realName: string;
  fromType: string;
  [propName: string]: any;
}
