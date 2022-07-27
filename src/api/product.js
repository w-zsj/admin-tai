/*
 * @Author: your name
 * @Date: 2021-08-25 10:34:20
 * @LastEditTime: 2022-02-22 10:15:52
 * @LastEditors: Ayan
 * @Description: In User Settings Edit
 * @FilePath: \project\mall-admin-web\src\api\product.js
 */
import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params: params
  })
}

export function fetchSimpleList(params) {
  return request({
    url: '/product/simpleList',
    method: 'get',
    params: params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/product/update/deleteStatus',
    method: 'post',
    params: params
  })
}

export function updateNewStatus(params) {
  return request({
    url: '/product/update/newStatus',
    method: 'post',
    params: params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url: '/product/update/recommendStatus',
    method: 'post',
    params: params
  })
}

export function updatePublishStatus(params) {
  return request({
    url: '/product/update/publishStatus',
    method: 'post',
    params: params
  })
}

export function createProduct(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data: data
  })
}

export function updateProduct(data) {
  return request({
    url: '/product/update',
    method: 'post',
    data: data
  })
}

export function getProduct(data) {
  return request({
    url: '/product/updateInfo',
    method: 'post',
    data: data
  })
}
export function getClassifyProductList(data) {
  return request({
    url: '/product/getClassifyProductList',
    method: 'post',
    data: data
  })
}

// 根据分类、商品名查询商品规格信息（秒杀活动配商品）
export function getSkuList(data) {
  return request({
    url: '/product/getSkuList',
    method: 'post',
    data: data
  })
}

