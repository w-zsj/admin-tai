import { getToken } from '@/utils/auth' // 验权
import { Message } from 'element-ui';

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 单个文件下载
export const download = (api, param, fileName) => {
  if (typeof api !== 'function') throw new TypeError('api must be a function');
  api(param)
    .then((res) => {
      if (res.code === -1) {
        Message.error('导出失败！');
        return;
      }
      const blob = new Blob([res]);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (e) => {
        const a = document.createElement('a');
        a.download = fileName;
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    })
    .catch((e) => {
      Message.error('导出失败！');
    });
};

// 文件下载-兼容其它格式文件
export const downloadFormData = (api, params, fileName) => {
  const url = process.env.BASE_API + api; // 文件下载路径
  const token = getToken();
  const form = document.createElement('form');
  form.setAttribute("method", "get");
  form.setAttribute("token", token);
  form.setAttribute("name", "theForm");
  form.setAttribute("target", "_self");
  form.setAttribute('style', 'display:none');
  form.setAttribute("action", url);
  document.body.appendChild(form);
  params.fileName = fileName;
  Object.keys(params).forEach(key => {
    const newInput = document.createElement('input');
    newInput.setAttribute('type', 'hidden');
    newInput.setAttribute('name', key);
    newInput.setAttribute('value', params[key])
    form.appendChild(newInput);
  })
  form.submit();
  document.theForm.parentNode.removeChild(form);
}

function curring(fn) {
  const inner = (args = []) => {
    return args.length >= fn.length ? fn(...args) : (...userArgs) => inner([...args, ...userArgs]);  // 递归返回函数
  }
  return inner();
}
function isType(typing, val) {
  return Object.prototype.toString.call(val) === `[object ${typing}]`;
}
const typeArr = ['String', 'Number', 'Boolean', 'Null', 'Undefined', 'Function', 'Object', 'Array', 'Date', 'RegExp'];
// 数据类型检测工具函数
export const typeCheckUtil = {};
typeArr.forEach(type => {
  typeCheckUtil['is' + type] = curring(isType)(type);
})
