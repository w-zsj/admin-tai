/*
 * @Author: Ayan
 * @Date: 2022-06-10 15:17:51
 * @LastEditors: Ayan
 * @LastEditTime: 2022-06-23 14:13:12
 * @Description: file not
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userType: state => state.user.userType,
  channel: state => state.user.channel,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers
}
export default getters
