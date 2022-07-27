import { typeCheckUtil } from './index.js';
// date.js
export function formatDate(time, fmt) {
  let date;
  if (typeCheckUtil.isDate(time)) {
    date = time;
  } else {
    time = time.replace(/-/g, "/");
    date = new Date(time);
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}


const isDate = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
}


function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export function str2Date(dateStr, separator) {
  if (!separator) {
    separator = "-";
  }
  let dateArr = dateStr.split(separator);
  let year = parseInt(dateArr[0]);
  let month;
  //处理月份为04这样的情况
  if (dateArr[1].indexOf("0") == 0) {
    month = parseInt(dateArr[1].substring(1));
  } else {
    month = parseInt(dateArr[1]);
  }
  let day = parseInt(dateArr[2]);
  let date = new Date(year, month - 1, day);
  return date;
}

// 比较时分秒大小 如果time2大于time1 返回true 否则 返回false
export function compareTime(time1, time2) {
  if (time_to_sec(time2) - time_to_sec(time1) > 0) {
    return true;
  }
  return false;
}

//将时分秒转为时间戳
function time_to_sec(time) {
  if (time !== null) {
    var s = "";
    var hour = time.split(":")[0];
    var min = time.split(":")[1];
    var sec = time.split(":")[2];
    s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    return s;
  }
}
