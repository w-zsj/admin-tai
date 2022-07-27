import request from '@/utils/request'
export function homeApi(params = {}) {
    return request({
        url: '/getHomeCountInfo',
        method: 'post',
        data: params
    })
}
export function statisticsOrder(data) {
    return request({
        url: '/queryOrderStatisticsList',
        method: 'post',
        data: data
    })
}
// 添加首页管理员数据操作记录
export function addHomeAdminDataLog(data) {
    return request({
        url: '/addHomeAdminDataLog',
        method: 'post',
        data: data
    })
}