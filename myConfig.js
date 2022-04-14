(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.libName = factory());
}(this, (function () {
	/**
	 * 业务需要配置的
	 * 1、themeColor：  red   blue
	 * 2、在 测试环境可以配置
	 *    localstorage配置 my_environment 可以指定环境，即哪一个版本
	 *     localstorage配置 my_url 可以接口地址
	 */

	// 韩国生产（改成了 波兰）  ko_pro
	// 日本生产 ja_pro
	// 瑞典 sw_pro
	// 德国 de_pro
	// 墨西哥 me_pro
	// mcl 1226项目 mcl_pro
	// ps 1225项目 ps_pro
	// 巴拿马 pa_pro
	// 新能源 ny_pro
	let environment = 'ja_pro'
	let isTest = false
	// 在浏览器环境中
	if (typeof window !== 'undefined' ) {
		isTest = location.origin === 'http://52.76.72.83:86' || process.env.NODE_ENV === 'development'
	}
	if (isTest) {
		environment = uni.getStorageSync('my_environment') || environment
	}
	return {
		/**
		 * 值即为下面的lines线路的key
		 */
		environment: environment,
		// 是否在测试环境中
		isTest: isTest,
		getServerUrl: function () {
			let list = this.getConfigObj().list
			// 是否可以覆盖之前的url
			if (isTest) {
				const url = uni.getStorageSync('my_url')
				if (url) {
					list =  [{url: url}]
				}
			}
			return list
		},
		getBackupServerList: function() {
			return [
					`https://gitlab.com/api/v4/projects/32885253/repository/files/p_${this.environment}/raw?ref=main&private_token=glpat-1Z8Wx5Kmyhc_z1tWvmV6`,
					`https://raw.githubusercontents.com/bebedon/ts/main/p_${this.environment}?access_token=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`,
					`https://gitee.com/bebedon/ts/raw/master/p_${this.environment}?access_token=4eb4a71125011123474eefbb73ce74f6&ref=master`,
				]
		},
		getConfigObj: function() {
			return this.countrys[this.environment]
		},
		countrys: {
			dev: { // 开发环境
				name: 'Harvey Nichols',
				themeColor: 'ka',
				list: [
					{url: 'http://52.76.72.83:81/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 1, // 用于控制默认热更的版本号的
			},
			dev2: { // 测试环境2
				name: 'Harvey Nichols',
				themeColor: 'red',
				list: [
					// {url: 'http://52.76.72.83:83/'},
					{url: 'https://admin.hankpay.com/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 1, // 用于控制默认热更的版本号的
			},
			dev3: { // 新版测试环境
				name: 'Harvey Nichols',
				themeColor: 'red',
				list: [
					{url: 'http://52.76.72.83:89/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 1, // 用于控制默认热更的版本号的
			},
			ko_pro: { // 韩国生产、默认主题 ka
				name: 'MALL OF BERLIN',
				themeColor: 'ka',
				list: [
					{url: 'https://oms.mallofberlin-detax3.com/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 5, // 用于控制默认热更的版本号的
			},
			ja_pro: { // 日本生产、默认主题 ka
				name: 'KRISTIINE',
				themeColor: 'ka',
				list: [
					{url: 'https://oms.kristiine-detax3.com/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 2, // 用于控制默认热更的版本号的
			},
			sw_pro: { // 瑞典、默认主题 ka
				name: 'YunMeng',
				themeColor: 'ka',
				list: [
					// {url: 'https://oms.ionorchard-detax3.com/'},
					{url: 'https://oms.yunmeng-detax3.com/'},
				],
				version: 2, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 10, // 用于控制默认热更的版本号的
			},
			de_pro: {// 德国生产、默认主题 red、H5标题：ATTICA
				name: 'Attica',
				themeColor: 'red',
				list: [
					{url: 'https://oms.attica-detax.com/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 7, // 用于控制默认热更的版本号的
			},
			me_pro: { // 墨西哥、默认主题 ka
				name: 'Steen & Strøm',
				themeColor: 'ka',
				list: [
					{url: 'https://oms.steenstrom-detax.com/'},
				],
				reList: [
					{url: 'https://oms.steenstrom-detax.com/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 5, // 用于控制默认热更的版本号的
			},
			mcl_pro: { // mcl 1226项目、默认主题 ka
				name: 'Mercado Livre',
				themeColor: 'ka',
				list: [
					{url: 'https://www.nffnf.com/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 2, // 用于控制默认热更的版本号的
			},
			ps_pro: { // ps 1225项目、默认主题 ka
				name: 'PARKSON',
				themeColor: 'ka',
				list: [
					{url: ' https://oms.parksongroup-d.com/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 3, // 用于控制默认热更的版本号的
			},
			pa_pro: { // 巴拿马生产、默认主题 blue
				name: 'Supremeship',
				themeColor: 'blue',
				list: [
					{url: 'https://oms.ssdetax4.com/'},
				],
				version: 2, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 4, // 用于控制默认热更的版本号的
			},
			ny_pro: { // 新能源的、默认主题 blue
				name: 'KRISTIINE',
				themeColor: 'blue',
				list: [
					{url: 'http://35.181.165.111:89/'},
				],
				version: 1, //用于清除本地线路lines, 目前的用途
				realCurrentVersion: 1, // 用于控制默认热更的版本号的
			},
		}
	}
})));