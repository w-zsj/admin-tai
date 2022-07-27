import Vue from 'vue';

import 'normalize.css/normalize.css';// A modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n
import VCharts from 'v-charts';
import EasyUI from 'vx-easyui';

import 'vx-easyui/dist/themes/default/easyui.css';
// import 'vx-easyui/dist/themes/icon.css';
import 'vx-easyui/dist/themes/vue.css';
import '@/styles/index.scss' // global c

import App from './App';
import router from './router';
import store from './store';

import '@/icons'; // icon
import '@/permission'; // permission control
import VueClipboard from 'vue-clipboard2';


Vue.use(VueClipboard);

Vue.use(EasyUI);
Vue.use(ElementUI, { locale });
Vue.use(VCharts);

Vue.config.productionTip = false

window.$vue = new Vue({
  el: '#app',
  data: {
    keepAliveWhiteList: []
  },
  router,
  store,
  template: '<App/>',
  components: { App }
})
