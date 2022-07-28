import request from '@/utils/request'
// 添加首页管理员数据操作记录
export function addHomeAdminDataLog(params = {}) {
    return request({
        url: '/addHomeAdminDataLog',
        method: 'post',
        data: params
    })
}
// 获取首页统计信息
export function getHomeCountInfo(data) {
    return request({
        url: '/getHomeCountInfo',
        method: 'post',
        data: data
    })
}
// 查询订单统计
export function queryOrderStatisticsList(data) {
    return request({
        url: '/queryOrderStatisticsList',
        method: 'post',
        data: data
    })
}