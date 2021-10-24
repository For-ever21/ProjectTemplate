export enum PageEnum {
  // basic login path
  BASE_LOGIN = "/login",
  // basic home path
  BASE_HOME = "/home",
  // error page path
  ERROR_PAGE = "/exception",
  // error log page path
  ERROR_LOG_PAGE = "/error-log/list",
}

/**
 * 搜索页-热门搜索关键词
 * @description
 * history => 历史搜索
 * doctor => 热搜医生
 * keyword => 热搜推荐
 */
export enum HotSearchKeyword {
  history = "历史搜索",
  doctor = "热搜医生",
  keyword = "热搜推荐",
}

/**
 * 搜索结果页-类型tab
 * @description
 * recommend => 0(推荐)
 * doctors => 1(医生)
 * communitys => 2(社区)
 * articles => 3(科普文章)
 * cases => 4(咨询案例)
 */
export enum SearchTabType {
  recommend = "0",
  doctors = "1",
  communitys = "2",
  articles = "3",
  cases = "4",
}
