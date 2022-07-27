import request from '@/utils/request'
export function upload (data) {
  return request({
    url: 'aliyun/oss/upload',
    method: 'post',
    data: data
  })
}
