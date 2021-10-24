/**
 * @description 记录各个项目的路径，便于统一管理
 */
import env from "./env";

/**
 * @description 公司整体网站的根路径
 * @enum 本项目路径 /iw --- 项目名：c-platform-h5-nuxt
 * @enum 社区项目路径 /c --- 项目名：sass-client-h5
 * @enum m型社区项目路径 /m --- 项目名：m-sass-client-h5
 * @enum 旧版-基础项目路径 /zt --- 项目名：aiwen-user-h5
 * @enum 图文咨询项目路径 /patient_consult_h5 --- 项目名：graphic-consultation-patient-h5
 * @enum 患端登录地址 /customer-login --- 项目名：aiwen-patient-member
 */
export const BASE_URL = env.BASE_URL;

/**
 * @description JSP项目 老链接
 */
export const JSP_URL = {
  personalService: `${BASE_URL}/personal/service`,
  feedback: `${BASE_URL}/personal/feedback`,
  doctor: `${BASE_URL}/personal/doctor`,
  editUserInfo: `${BASE_URL}/userAuth/userCenter/index?callBackUrl=${encodeURIComponent(
    BASE_URL + "/iw"
  )}`,
  commonwealActivity: `${BASE_URL}/commonwealActivity/detail/`, // 公益活动基础链接
  articleDeatil: `${BASE_URL}/awyh/art/`, // 文章详情页
  lessonIntro: `${BASE_URL}/lesson/intro/`, // 课程介绍基础链接
  serialIntro: `${BASE_URL}/serial/intro/`, // 系列课主页基础链接
  subscribeIndex: `${BASE_URL}/index`,
  recommenrIndex: `${BASE_URL}/index/index?card=1`,
  dairyIndex: `${BASE_URL}/index/index?card=2`,
  scienceIndex: `${BASE_URL}/index/index?card=2`,
  patientIndex: `${BASE_URL}/index/index?card=2`,
  caseIndex: `${BASE_URL}/index/index?card=2`,
  subjectIndex: `${BASE_URL}/index?card=6&swiper_num=7`,
  courseIndex: `${BASE_URL}/index?card=7`,
  videoIndex: `${BASE_URL}/index?card=8`,
  activityIndex: `${BASE_URL}/commonwealIndex/index`,
  weiTalkIndex: `${BASE_URL}/weiTalkIndex/index`,
  weiTalkDetail: `${BASE_URL}/weiTalkDetail/detail/`,
  consultDetail: `${BASE_URL}/conAnalysis/`,
  subjectDetail: `${BASE_URL}/popSubject/detail/`, // 专题详情

  // 医生部分
  docConsult: `${BASE_URL}/consult/index?drId=`,
  docOrder: `${BASE_URL}/outpatient/doctorOutpatientList/`,
  docAchievement: `${BASE_URL}/doctor/achievement/`,
};
