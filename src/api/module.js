import request from '@/utils/request'
// 列表
export function moduleList(data = {}) {
    return request({
        url: '/manager/module/list',
        method: 'post',
        data
    })
}
// 修改状态
export function moduleUpdateStatus({ status, id }) {
    return request({
        url: '/manager/module/updateStatus',
        method: 'post',
        data: { status, id }
    })
}
// 删除
export function moduleDelete(id = '') {
    return request({
        url: '/manager/module/delete',
        method: 'post',
        data: { id }
    })
}
// 新增
export function moduleAdd(data = {}) {
    return request({
        url: '/manager/module/add',
        method: 'post',
        data
    })
}
// 模块详情
export function moduleDetail(id = '') {
    return request({
        url: '/manager/module/detail',
        method: 'post',
        data: { id }
    })
}

// 编辑
export function moduleUpdate(data = {}) {
    return request({
        url: '/manager/module/update',
        method: 'post',
        data
    })
}