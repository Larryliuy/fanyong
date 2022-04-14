import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
// import baseUrl from "@/config/baseUrl.js"
import http from '@/config/requestConfig.js'
import locales from '@/locales/index.js'

import myConfig from '../myConfig.js'

const store = new Vuex.Store({
	state: {
		token: uni.getStorageSync('token') || '',
		userInfo: {},
		language: locales.locale,
		environment: myConfig.environment,
		vipList: [],
		
		walletInfo: {
			aliName: {}, // 支付宝
			bankInfo: [], // 银行卡
			qbInfo: {}, // usdt
			wxInfo: {}, // 微信
			qb_address: {},
			clabe: {}, // clabe，类似支付宝、微信
		},
		drawback: '',
		payDeatil: {},
	},
	mutations: {
		saveToken(state, data) {
			state.token =data
			uni.setStorageSync("token", data);
		},
		saveUserInfo(state) {
			http.get('getUserInfo').then(res => {
				if (res && res.data && res.data.code == 200) {
					console.log('用户信息==>', JSON.parse(JSON.stringify(res.data.data.info)))
					state.userInfo =res.data.data.info
				}
			});
		},
		clearUserInfo(state) {
			state.token = '';
			state.userInfo = {};
			uni.removeStorageSync("token");
			uni.reLaunch({
				url: '/pages/login/login'
			})
		},
		setLanguage(state, data) {
			console.log(data, 'data')
			state.language = data.data;
			uni.setStorageSync("language", data.data);
			if(data.cb) {
				data.cb()
			}
		},
		//vip列表
		getVipList(state, callback) {
			http.get('userLevel').then(res => {
				if (res && res.data && res.data.code == 200) {
					console.log('getVipList res===>', JSON.parse(JSON.stringify(res.data.data.list)))
					state.vipList = res.data.data.list
				}
				callback && callback(res)
			});
		},

		//银行卡
		getwalletInfo(state) {
				http.get('getUserQblist').then(res => {
					if (res && res.data && res.data.code === 200) {
						// state.walletInfo = res.data.data
						// 补全数据结构
						const tmpObj = res.data.data
						if (!tmpObj.aliName || tmpObj.aliName.length === 0) {
							tmpObj.aliName = {}
						}
						if (!tmpObj.bankInfo) {
							tmpObj.bankInfo = []
						}
						if (!tmpObj.qbInfo) {
							tmpObj.qbInfo = {}
						}
						if (!tmpObj.wxInfo) {
							tmpObj.wxInfo = {}
						}
						if (!tmpObj.qb_address) {
							tmpObj.qb_address = {}
						}
						if (!tmpObj.clabe|| tmpObj.clabe.length === 0) {
							tmpObj.clabe = {}
						}
						state.walletInfo = tmpObj
					}
				});
		},
		//前往订单列表
		finishOrder(state,data) {
			state.drawback =data
			console.log(state.drawback);
		},
		sePayDeatil(state,data) {
			state.payDeatil =data
		},
	}
})

export default store;
