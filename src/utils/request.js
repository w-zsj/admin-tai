/*
 * @Author: Ayan
 * @Date: 2022-06-10 15:17:51
 * @LastEditors: Ayan
 * @LastEditTime: 2022-06-28 09:58:30
 * @Description: file not
 */
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // config.headers['Access-Control-Allow-Origin'] = "*";
  if (config.baseUrl) {
    config.baseURL = config.baseUrl; // 特定baseURL
  }
  if (!config.noToken && store.getters.token) { // noToken：判断接口是否无需携带token
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况行修改
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
    * code为非200是抛错 可结合自己业务进行修改
    */
    const res = response.data;
    if (res.code && res.code !== 1) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })

      // 401:未登录;
      if (res.code === 401) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
