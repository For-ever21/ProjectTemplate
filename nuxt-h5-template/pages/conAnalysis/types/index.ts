import ConsultcaseModel from "@/api/home/model/consultcaseModel";

// 如果是图片和文字一起发  图片不需要显示时间
export type TConsultDialogItemCommon = Pick<
  ConsultcaseModel.IConsultShareDialogs,
  "postTime" | "isQuest"
> & {
  id: string;
  showTime: boolean;
};

export interface IPreview {
  src: string;
  w?: number;
  h?: number;
}
export type ConsultDialogItemType =
  | ({
      type: "text";
      content: string;
    } & TConsultDialogItemCommon)
  | ({
      type: "img";
      picIds: string[];
      previewList: IPreview[];
      picShieldEd?: boolean;
    } & TConsultDialogItemCommon)
  | ({
      type: "voice";
      src: string;
    } & TConsultDialogItemCommon);
