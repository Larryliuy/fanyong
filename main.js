import Vue from 'vue'
import App from './App'
import baseUrl from '@/config/baseUrl.js'
import AsyncError from '@/components/asyncError/asyncError.vue'
Vue.prototype.$baseUrl = baseUrl;
import $mixin from '@/mixin/index.js'
Vue.mixin($mixin);
// 挂载 vueX
import store from '@/store'
Vue.prototype.$store = store;
//挂载请求接口
import http from '@/config/requestConfig.js'
Vue.prototype.$http = http;
import colors from '@/colors/index.js'
import myConfig from './myConfig.js'
Vue.prototype.$colors = {...colors, themeColor: myConfig.getConfigObj().themeColor};
Vue.prototype.$name = myConfig.getConfigObj().name
import utils from '@/common/utils.js'
Vue.prototype.$utils = utils
import VueI18n from 'vue-i18n'
import locales from '@/locales/index.js'
Vue.use(VueI18n);
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.component('AsyncError', AsyncError);
const i18n = new VueI18n({
	locale: locales.locale, //初始化,保证刷新页面也保留
	messages: {
		'cn': require('./locales/cn.js').lang, //简体
		'tc': require('./locales/tc.js').lang, //繁体
		'en': require('./locales/en.js').lang, //英文
		'ko': require('./locales/ko.js').lang, //韩文
		'ja': require('./locales/ja.js').lang, //日本
		'sw': require('./locales/sw.js').lang, //瑞典
		'es': require('./locales/es.js').lang, //西班牙语
		'ly': require('./locales/ly.js').lang, //意大利语
		'nc': require('./locales/nc.js').lang, //印尼语
		'pt': require('./locales/pt.js').lang, //巴西葡萄牙语
		'tr': require('./locales/tr.js').lang, //土耳其
		'de': require('./locales/de.js').lang, //德语
	}
})

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	i18n,
	store,
  ...App
})
app.$mount()