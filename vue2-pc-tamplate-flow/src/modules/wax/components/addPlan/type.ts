
/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 */

/*
 * @Author         : Qiao
 * @Date           : 2021-03-27 14:03:04
 * @LastEditors    : Qiao
 * @LastEditTime   : 2021-03-27 14:03:39
 * @FilePath       : /src/modules/wax/components/addProgram/type.ts
 * @Description    : 组件传输数据interface
 */

export type CheckBoxGroupType = "region" | "lifeState" | "interest";

export interface CheckBoxGroupOption {
  firstTitle?: string; //一级选择项 title
  secondTitle?: string; //二级选择项 title
  storage?: boolean; // 数据是否缓存
  max?: number; // 最大选择数控制
  api: string; // 数据请求API
  [propName: string]: any;
}
