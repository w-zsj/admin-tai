import request from '@/utils/request'

// 会员列表
export function fetchList (data) {
  return request({
    url: 'memberVip/queryMember',
    method: 'post',
    data: data
  })
}

// 添加兑换码
export function addVipCode (data) {
  return request({
    url: 'memberVipCode/add',
    method: 'post',
    data: data
  })
}

// 兑换码列表
export function fetchVipCodeList (data) {
  return request({
    url: 'memberVipCode/query',
    method: 'post',
    data: data
  })
}

// 导出兑换码列表
export function exportVipCodeList (data) {
  return request({
    url: 'memberVipCode/downloadUmsMemberVipCode',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 批量生成兑换码
export function importPhoneList (data) {
  return request({
    url: 'memberVipCode/uploadPhoneCreateVipCode',
    method: 'post',
    data: data
  })
}