import http from "@/utils/http";
import { ExportFinanceFlow, FindFinanceFlowPage } from "./model";

// 新增人群包信息
export function findFinanceFlowPage(data: FindFinanceFlowPage) {
  return http.post("/findFinanceFlowPage", data);
}

export function exportFinanceFlow(data: ExportFinanceFlow) {
  return http.get("/exportFinanceFlow", data);
}

// 文件导出
export const exportFinanceFlowUrl = "/exportFinanceFlow";
