/*
 * @Author: TerryMin
 * @Date: 2021-09-08 17:16:19
 * @LastEditors: Ayan
 * @LastEditTime: 2022-07-04 14:16:48
 * @Description: file not
 */
import { fetchResource } from './fetchapi';

const API_HOST = '';
// /api
const SERVICE_NAME = '';

export const Resource = {
  // 枚举
  dict: fetchResource(`${API_HOST}/dict/:type`),
  /**
   * 登录
   */
  admin: fetchResource(`${API_HOST}/admin/:type`),

  // 角色
  role: fetchResource(`${API_HOST}/role/:type`),

  // 询盘
  inquiry: fetchResource(`${API_HOST}/inquiry/:type`),

  // 首页
  home: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/home/:type`),

  // 商品管理
  product: fetchResource(`${API_HOST}/product/:type`),

  // 商品参数
  productAttribute: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/productAttribute/:type`),

  // 商品类目
  productCategory: fetchResource(`${API_HOST}/productCategory/:type`),

  // 商品分类
  productClassify: fetchResource(`${API_HOST}/productClassify/:type`),

  // 订单管理
  order: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/order/:type`),

  // 权益中心
  equity: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/equity/:type`),

  // 活动营销
  advertise: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/home/advertise/:type`),

  // 优惠券管理
  coupon: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/coupon/:type`),

  // 退货管理
  returnApply: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/returnApply/:type`),

  // 权益礼包管理
  equityBag: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/equityBag/:type`),

  // 权益礼包购买记录
  equityBagOrder: fetchResource(`${API_HOST}${SERVICE_NAME}/manager/equityBagOrder/:type`),

  /**
   * 不需要token接口
   */
  noTokenList: fetchResource(`${API_HOST}${SERVICE_NAME}/nt/:type`),

  // 首页banner
  homeBannerPicture: fetchResource(`${API_HOST}${SERVICE_NAME}/nt/homePage/:type`),

  // 企业人才
  organizationTalents: fetchResource(`${API_HOST}${SERVICE_NAME}/nt/talents/:type`),


};
