import http from '@/common/request.js'
// import baseUrl from "./baseUrl.js"
import store from '@/store'

//设置baseUrl
http.config.baseUrl = ''
//设置请求前拦截器
http.interceptor.request = (config) => {
	let token =store.state.token
	// if (!token) {
	// 	uni.reLaunch({
	// 		url: "/pages/login/login"
	// 	})
	// 	return false;
	// }else{
		// config.header['token']=token;
		if (token) {
			config.header['token']=token;
		}
	// }
	return config;
}
//设置请求结束后拦截器
http.interceptor.response = (response) => {
	if (response && response.data && response.data.code === 600) {
		store.commit('clearUserInfo')
		uni.reLaunch({
			url: "/pages/ip/limit"
		})
		return false;
	}
	if (response && response.data && response.data.code === 401) {
		store.commit('clearUserInfo')
		uni.reLaunch({
			url: "/pages/login/login"
		})
		return false;
	}
	//判断返回状态 执行相应操作
	return response;
}
export default http;