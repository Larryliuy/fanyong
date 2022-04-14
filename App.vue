<script>
	import {mapMutations} from 'vuex'
	import http from '@/config/requestConfig.js'
	import baseUrl from "@/config/baseUrl.js"
	import myConfig from '@/myConfig.js'

	export default {
		onLaunch: function() {
			http.config.baseUrl = baseUrl.serverUrl[0].url
			if(!uni.getStorageSync('deduplication')) {
				this.deduplicationLines()
			}
			// 用于加密github远端api
			// let uurl = 'https://oms.ionorchard-detax3.com/'
			// console.log(this.$utils.SPS(JSON.stringify({"tid":10,"env":"ca_pro","CfgKey":"Num4Tid10ylc","list":[{"url":uurl,"weight":99}]})), 'SPS', uurl)
			// APP端检测版本更新
			// #ifdef APP-PLUS
			this.updateVersion()
			// #endif
			console.log('App Launch', myConfig.getConfigObj())
			let configInfo = myConfig.getConfigObj()
			const currentVersion = configInfo.version
			const localVersion = uni.getStorageSync('version')
			console.log(localVersion, 'localVersion')
			if (localVersion) {
				if (currentVersion > localVersion) {
					console.log('清空lines')
					uni.removeStorage({key: 'lines'})
					uni.setStorage({key: 'version', data: currentVersion})
				}
			} else {
				uni.setStorage({key: 'version', data: currentVersion})
			}
			console.log('http.config.baseUrl===》', http.config.baseUrl)
			// 线路列表
			let list = uni.getStorageSync('lines') || []
			console.log('保存的线路 list ===>', list)
			if (!(list && list.length > 0)) {
				list = baseUrl.serverUrl
				uni.setStorage({key: 'lines', data: list})
			} else { // 合并list
				const newArr = []
				list.forEach(obj1 => {
					baseUrl.serverUrl.forEach(obj2 => {
						if (obj1.url !== obj2.url) {
							newArr.push(obj2)
						}
					})
				})
				list = newArr.concat(list)
				console.log(list, 'list1')
			}
			const tmpFunc = (index) => {
				http.config.baseUrl = list[index].url
				this.getVipList((res) => {
					console.log('getVipList ===>', res)
					// 接口不通的情况
					if (!(res && res.data && res.data.code == 200)) {
						console.error('该域名不通===>', list[index].url, '  index===>', index, '  next===>', list[index+1])
						if (list[index+1]) {
							tmpFunc(index+1)
						} else {
							console.log('内置的和本地的接口都不通 ===>')
							// 内置接口都不通删除本地存的内置接口
							let tmpArr = []
							list.forEach(obj1 => {
								baseUrl.serverUrl.forEach(obj2 => {
									if (obj1.url !== obj2.url) {
										tmpArr.push(obj1)
									}
								})
							})
							uni.setStorage({key: 'lines', data: tmpArr})
							// 配置的接口都不通的情况下去请求github等远程接口
							this.getApis()
						}
					} else {
						console.error('选出的域名为===>', list[index].url, '  index===>', index)
						if (index > 0) {
							uni.reLaunch({
								url: '/pages/home/home'
							});
							// 交换位置，即权重
							// const list0 = JSON.parse(JSON.stringify(list[0]))
							// list[0] = list[index]
							// list[index] = list0
							// uni.setStorage({key: 'lines', data: list})
						}
						this.storeUrlToLines(list[index].url)
					}
				})
			}
			tmpFunc(0)
			for (let i=0;i<5;i++) {
			    let barObj = {
				  index: i,
				  text: this.$t(`t_${i}`)
				}
				if (i === 2) { //退税icon需要更换
					//需要单独处理的icon
					const obj = {
						'ko_pro': 'ko_pro',
						'cn_pro': 'cn_pro'
					}
					barObj = {
						index: i,
						text: this.$t(`t_${i}`),
						iconPath: `static/tabbar/drawback_${obj[this.environment] || 'us_pro'}.png`,
						selectedIconPath: `static/tabbar/drawback_act_${obj[this.environment] || 'us_pro'}.png`
				    }
				}
				const isNy = (this.environment === 'ny_pro')
				if (isNy) {
					if(i === 1) {
						barObj.text = this.$t(`t_5`)
					}
					if(i === 2) {
						barObj.text = this.$t(`t_6`)
					}
					if(i === 3) {
						barObj.text = this.$t(`t_1`)
					}
				}
				uni.setTabBarItem(barObj)
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['getVipList', 'getVersion']),
			getApis(){
				console.log('getApis 去拿github远端的接口地址 === 》')
				const apis = baseUrl.backupServerUrls
				let i = 0
				const tmpFunc = (index) => {
					console.log(index, 'tmpFunc')
					uni.request({
					  url: apis[index],
					  method: 'GET',
					  success: res => {
						if (res && res.statusCode === 200) {
						  console.log(res.data, 'github')
						  const lineInfo = JSON.parse(this.$utils.SPL(res.data))
						  console.log(lineInfo, 'lineInfo')
						  if (lineInfo.list && lineInfo.list.length > 0) {
							this.testUrls(lineInfo.list)
						  } else {
							  if (apis[index + 1]) {
								tmpFunc(index + 1)
							  } else {
								http.config.baseUrl = baseUrl.serverUrl[0].url
							  }
						  }
						} else {
							// this.openShowToast(res.data)
							console.log(res.data, 'error')
							if (apis[index + 1]) {
								tmpFunc(index + 1)
							} else {
								// console.log('远端域名不通===》',apis[index])
							}
						  }
					  },
					  complete: () => {
						uni.hideLoading();
					  }
					});
				}
				tmpFunc(i)
			},
			testUrls(list){
				let i = 0
				const tmpFunc = (index) => {
					http.config.baseUrl = list[index].url
					// 通过getVipList探测接口是否是通的
					this.getVipList((res) => {
						console.log('getVipList ===>', res)
						// 接口不通的情况
						if (!(res && res.data && res.data.code == 200)) {
							console.error('远端 === 该域名不通===>', list[index].url, '  index===>', index)
							if (list[index + 1]) {
								tmpFunc(index + 1)
							} else {
								// 所有的远程api都不通的情况下GG了。H5端可以快速发部修改，APP端可以修改远端接口地址先用着，然后再更新APP
							}
						} else {
							console.error('远端 === 该选出的域名为===>', list[index].url, '  index===>', index)
							//选出了有用的域名则存入lines
							this.storeUrlToLines(list[index].url)
						}
					})
				}
				tmpFunc(i)
			},
			storeUrlToLines(url) {
				let localList = uni.getStorageSync('lines') || []
				console.log(JSON.stringify(localList), 'localList1')
				let exist = false
				if (localList && localList.length > 0) {
					for(let i = 0; i < localList.length; i++) {
						if(localList[i].url === url) {
							console.log('exist')
							exist = true
							break
						}
					}
				}
				if (!exist) {
					localList = [{url: url}].concat(localList)
					console.log(JSON.stringify(localList), 'localList2')
					uni.setStorage({key: 'lines', data: localList})
				}
			},
			// 检查是否更新版本
			updateVersion() {
				// 这里用一个常量定义（每次修改版本号将设置里面的版本号手动更新）
        const configInfo = myConfig.getConfigObj()
				let realCurrentVersion = uni.getStorageSync('realCurrentVersion') || configInfo.realCurrentVersion;
				// let localV = uni.getStorageSync('realCurrentVersion')
				console.log(realCurrentVersion, 'localRealCurrentVersion')
				const that = this;
				//plus.runtime.getProperty(),获取本机安装的版本信息
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					let currentVersion = widgetInfo.version.replace(/\./g, ""); //获取当前版本号
					console.log(widgetInfo, 'widgetInfo')
					that.$http.get('app_update').then((res) => {
						console.error(res, 'update_version res ')
						if (res && res.data && res.data.code == 200) {
							console.log(res.data, 'res.data')
							const info = res.data.data.list
							let newVersion = info.android_version;
							if (uni.getSystemInfoSync().platform === 'ios') {
								newVersion = info.ios_version;
							}
							let downloadUrl = info.app_update_file;
							console.log(realCurrentVersion, newVersion, 'newVersion')
							if (realCurrentVersion && realCurrentVersion < newVersion) {
								uni.showModal({
									title: that.$t('xf_500'),
									content: that.$t('xf_501'),
									success: function(res) {
										if (res.confirm) {
											uni.downloadFile({
												url: downloadUrl,
												success: (downloadResult) => {
													plus.runtime.install(
														downloadResult.tempFilePath,
														{ force: true },
														function() {
															// 应用热重启，重新启动进入首页。
															console.log(newVersion, 'newVersion')
															uni.setStorageSync('realCurrentVersion', newVersion)
															plus.runtime.restart();
															uni.showModal({
																title: that.$t('xf_502'),
																content: that.$t('xf_503'),
																success: function(res) {
																	if (res.confirm) {
																		console.log('用户点击确定');
																	} else if(res.cancel)                 {
																		console.log('用户点击取消');
																	}
																}
															});
															// uni.hideToast();
														},
														function(e) {
															uni.showToast({
																title: that.$t('xf_504'),
																icon: 'none'
															})
														})
												},
												fail: (err) => {
													console.log(err)
													uni.showToast({
														title: that.$t('xf_505'),
														icon: 'none'
													})
												}
											})
										} else if (res.cancel) {
											uni.showToast({
												title: that.$t('xf_506'),
												icon: 'none'
											})
										}
									}
								})
							} else {
								uni.setStorageSync('realCurrentVersion', newVersion)
							}
						} else {
							console.error(res, 'error res')
							if (res.data) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}
					})
				})
			},
			deduplicationLines() {
				let localList = uni.getStorageSync('lines') || []
				let obj = {}
				let tmp = []
				if(localList) {
					localList.map((item,index) => {
						!obj[item.url] && (obj[item.url] = item)
					})
					for(let item in obj) {
						tmp.push(obj[item])
					}
					uni.setStorage({key: 'lines', data: tmp})
					uni.setStorage({key: 'deduplication', data: true})
				}
				console.log(obj,tmp, 'deduplicationLines')
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("/static/common.scss");
	@import url("/static/iconfont.css");
	/* #ifdef H5 */
	.uni-tabbar__icon {
		margin-top: 1px !important;
	}
	.uni-tabbar__label {
		line-height: 10px !important;
		padding-top: 0px !important;
		width: 105%;
	}
	/* #endif */
	.uni-app {
		background-color: #FFFFFF;
	}
	.uni-app--showtabbar{
		overflow-x: hidden;
	}
</style>
