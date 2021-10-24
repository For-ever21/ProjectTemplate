export interface INativeService {
  syncCalendar(params: SyncCalendarParams, onSuccess: () => void): void;
}

export interface NativeApiErrorInfo {
  error: Error;
  type: "callNative";
  methodName: string;
  params?: any;
}

export interface SyncCalendarParams {
  id: number;
  title: string;
  deadline: number;
  alarm: number[];
}
