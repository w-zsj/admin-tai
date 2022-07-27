/*
 * @Author: Ayan
 * @Date: 2022-06-10 15:17:51
 * @LastEditors: Ayan
 * @LastEditTime: 2022-07-12 10:30:05
 * @Description: file not
 */
import Cookies from "js-cookie";
const SupportKey = 'supportKey';
export function getSupport () {
  return Cookies.get(SupportKey)
}

export function setSupport (isSupport) {
  return Cookies.set(SupportKey, isSupport, { expires: 3 })
}

export function setCookie (key, value, expires) {
  return Cookies.set(key, value, { expires: expires })
}

export function getCookie (key) {
  return Cookies.get(key)
}
