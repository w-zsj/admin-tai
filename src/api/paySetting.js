import request from '@/utils/request'
export function payList(params) {
    return request({
        url: '/config/pay/list',
        method: 'post',
        data: params
    })
}
export function payUpdate(params) {
    return request({
        url: '/config/pay/update',
        method: 'post',
        data: params
    })
}
export function coinList(params) {
    return request({
        url: '/coin/list',
        method: 'post',
        data: params
    })
}
export function coinOperate(params) {
    return request({
        url: '/coin/operate',
        method: 'post',
        data: params
    })
}
