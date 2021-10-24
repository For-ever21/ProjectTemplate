namespace ConsultcaseModel {
  export interface IDoctorServiceStatus {
    isFree: boolean;
    isOpen: boolean;
    price: number;
    serviceTime?: number;
  }
  export interface IDoctorInfo {
    avatarUrl: string;
    blockCurrentUser: boolean;
    departId: string;
    departments: string;
    drServiceCard: {
      consult: IDoctorServiceStatus;
      outpatient: IDoctorServiceStatus;
      telephone: IDoctorServiceStatus;
    };
    hospitalLevel: string;
    id: string;
    medicalInstitutions: string;
    realName: string;
    titles: string;
  }
  export interface IDoctorArticleList {
    questionTitle: string;
    questionId: string;
  }
  export interface IDepartArticleList {
    questionTitle: string;
    questionId: string;
    drRealName: string;
    drTitle: string;
  }
  export interface IConsultShareDialogs {
    content: string;
    picIds: string[];
    postTime: string;
    isQuest: boolean;
    replyMsgType: "1" | "2" | "3";
    voiceLength: number;
    voiceUrl: string;
    picShieldEd: boolean;
  }
  export interface IConsultShareInfo {
    dialogs: IConsultShareDialogs[];
    drId: string;
    id: string;
    needHelp: string;
    postTime: string;
    questionId: string;
    seoTitle: string;
    description: string;
    seoDescription: string;
    seoNeedHelp: string;
  }
}
export default ConsultcaseModel;
