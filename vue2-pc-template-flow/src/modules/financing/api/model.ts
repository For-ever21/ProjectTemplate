export interface Params {
  accountBody: string;
  accountId: string;
  amountType: string;
  endTime: string;
  financeSubject: string;
  startTime: string;
}

export interface ExportFinanceFlow extends Params {
  token: string;
}

export interface FindFinanceFlowPage extends Params {
  pageNum: number;
  pageSize: number;
}
