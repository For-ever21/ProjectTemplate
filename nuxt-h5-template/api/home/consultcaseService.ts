import { $axios } from "@/utils/request/api";
import ConsultcaseModel from "./model/consultcaseModel";
namespace ConsultcaseService {
  export const doctorinfo = (doctorId: string): Promise<ConsultcaseModel.IDoctorInfo> =>
    $axios.request({
      url: "/iw/p/h5/consultcase/doctorinfo",
      method: "get",
      params: {
        doctorId,
      },
    });

  export const consultShareHot = (
    doctorId: string,
    departId: string,
    questionId: string
  ): Promise<ConsultcaseModel.IDoctorArticleList[]> =>
    $axios.request({
      url: "/iw/p/h5/consultcase/consultShareHot",
      method: "get",
      params: {
        doctorId,
        departId,
        questionId,
      },
    });

  export const consultShareSimple = (
    doctorId: string,
    departId: string,
    questionId: string
  ): Promise<ConsultcaseModel.IDepartArticleList[]> =>
    $axios.request({
      url: "/iw/p/h5/consultcase/consultShareSimple",
      method: "get",
      params: {
        doctorId,
        departId,
        questionId,
      },
    });

  export const consultShareInfo = (id: string): Promise<ConsultcaseModel.IConsultShareInfo> =>
    $axios.request({
      url: "/iw/p/h5/consultcase/consultShareInfo",
      method: "get",
      params: {
        id,
      },
    });
}

export default ConsultcaseService;
