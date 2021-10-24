/**
 * @description 区分开发和线上,处理不同的路径,除非这个路径不在项目内
 */
import { BASE_URL } from "@/config/link";

const offline = process.env.NODE_ENV === "development";
namespace AppPath {
  export const home: string = offline ? "/iw" : BASE_URL + "/iw";
  export const zsq: string = offline ? "/iw/zsq" : BASE_URL + "/iw/zsq";
  export const zmy: string = offline ? "/iw/zmy" : BASE_URL + "/iw/zmy";
  export const doctors: string = offline ? "/doctors" : BASE_URL + "/zt/doctors";
  export const conAnalysis = "/conAnalysis";
  export const consult: string =
    BASE_URL + "/patient_consult_h5/pages/consolution/consolution?doctorId=";
  export const outpatient: string = BASE_URL + "/outpatient/doctorOutpatientList/";
  export const telConsult: string = BASE_URL + "/zt/phone/consultInfo/";
  export function getFull(path: string) {
    return offline ? path : BASE_URL + path;
  }
  export function getConAnalysisDetail(conAnalysisId: string) {
    let path = AppPath.conAnalysis + `/${conAnalysisId}`;
    const stuffix = ".html";
    if (!path.endsWith(stuffix)) {
      path += stuffix;
    }
    return path;
  }
}
export default AppPath;
