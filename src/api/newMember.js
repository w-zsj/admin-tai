/*
 * @Author: zhangsanjun 
 * @Date: 2022-07-25 10:36:01 
 * @Last Modified by:   zhangsanjun 
 * @Last Modified time: 2022-07-25 10:36:01 
 */

import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/newPromotion/list',
    method: 'post',
    data: params
  })
}
export function updateStatus(params) {
  return request({
    url: '/newPromotion/update/status',
    method: 'post',
    data: params
  })
}
export function deleteFlash(params) {
  return request({
    url: '/newPromotion/delete',
    method: 'post',
    data: params
  })
}
export function createFlash(data) {
  return request({
    url: '/newPromotion/create',
    method: 'post',
    data: data
  })
}
export function updateFlash(data) {
  return request({
    url: '/newPromotion/update',
    method: 'post',
    data: data
  })
}
export function queryFlashDetail(data) {
  return request({
    url: '/newPromotion/detail',
    method: 'post',
    data: data
  })
}
