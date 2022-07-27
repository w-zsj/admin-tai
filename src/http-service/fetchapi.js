import axios from 'axios'
import { Message, Loading, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import 'url-search-params-polyfill';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// 网络方法请求
const fetchMethod = (_url, _config) => {
  console.log(_url, _config);

  // 请求处理
  const headers = {
    "Access-Control-Allow-Origin": "*",
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: store.getters.token ? getToken() : '',
  }
  const { method, params } = _config;

  const request = method === 'get'
    ? service[method](_url, { headers, params })
    : service[method](_url, { ...params }, { headers })

  return request.then((response) => {
    console.log(response);
    const { code, message } = response.data;
    if (code !== 200 && code !== 300005 && code !== 1) {
      Message({
        message: message,
        type: 'error',
        duration: 3 * 1000
      })

      // 特殊代码返回
      if (code === 300005 || code === 1) { // 1 独立站操作成功代码
        return response.data
      }

      // 401:未登录;
      if (code === 401 || code === 601) {
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
      return Promise.reject(message)
    } else {
      return response.data
    }
  })
    .then((res) => {
      console.log(_url, '接口返回', res);
      return res || null;
    })
  // .catch((error) => {
  //   Message({
  //     message: error.message,
  //     type: 'error',
  //     duration: 3 * 1000
  //   })
  //   return Promise.reject(error)
  // });
};

// 匹配URL类型type
const matchUrlSearchParams = (url = '', urlSearchParams = {}) => {
  if (!urlSearchParams) {
    return url.replace(/\/:[^?]+/g, '');
  }
  let u = new URLSearchParams();
  let _url = Object.keys(urlSearchParams).reduce((pre, next) => {
    if (pre.includes(':' + next)) {
      return pre.replace(':' + next, urlSearchParams[next]);
    } else {
      if (urlSearchParams[next] && urlSearchParams[next].constructor === Array) {
        urlSearchParams[next].forEach((value) => {
          u.append(next, value);
        });
      } else {
        u.append(next, urlSearchParams[next]);
      }
      return pre;
    }
  }, url);
  // let u = toQueryString(urlSearchParams);
  _url = _url.replace(/\/:[^?]+/g, '');
  return _url + (u.toString() === '' ? '' : '?' + u);
};

class FetchApi {
  url = '';

  constructor (_url) {
    this.url = _url;
  }

  get = (urlSearchParams, bodyParams, config) => {
    console.log('请求参数', urlSearchParams, bodyParams);
    return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
      method: 'get',
      params: bodyParams,
      // params: JSON.stringify({ ...bodyParams }),
      ...config,
    });
  };

  post = (urlSearchParams, bodyParams, config) => {
    console.log('请求参数', urlSearchParams, bodyParams);
    return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
      method: 'post',
      // params: JSON.stringify({ ...bodyParams }),
      params: bodyParams,
      ...config,
    })
      .then((res) => {
        return res;
      })
      .catch(() => { });
  };

  upload = (urlSearchParams, bodyParams, config) => {
    return fetchMethod(matchUrlSearchParams(this.url, urlSearchParams), {
      method: 'post',
      params: bodyParams,
      ...config,
    });
  };

  delete = (urlSearchParams, config) => {
    return fetchMethod(
      matchUrlSearchParams(this.url, urlSearchParams),
      Object.assign(config, {
        method: 'delete',
      }),
    );
  };

  put = (urlSearchParams, bodyParams, config) => {
    return fetchMethod(
      matchUrlSearchParams(this.url, urlSearchParams),
      Object.assign(config, {
        method: 'put',
        params: JSON.stringify(bodyParams),
      }),
    );
  };

  patch = (urlSearchParams, bodyParams, config) => {
    return fetchMethod(
      matchUrlSearchParams(this.url, urlSearchParams),
      Object.assign(config, {
        method: 'patch',
        params: JSON.stringify(bodyParams),
      }),
    );
  };
}

const fetchResource = (url) => {
  return new FetchApi(url);
};

export { fetchResource };
