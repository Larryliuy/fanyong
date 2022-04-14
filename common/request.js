/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import store from '@/store/index.js'
export default {
	config: {
		baseUrl: "",
		header: {
			// 'Content-Type': 'application/json;charset=UTF-8',
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: {},
		method: "GET",
		dataType: "json",
		/* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		auth: true,
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.data = {'lang':store.state.language,'environment':store.state.environment, ...options.data}
		options.method = options.method || this.config.method
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.auth = options.auth === false ? false : true
		return new Promise((resolve, reject) => {
			let _config = null
			options.complete = (response) => {
				if (this.interceptor.response) {
					response = this.interceptor.response(response);
				}
				// 统一的响应日志记录
				//_reslog(response)
				resolve(response);
			}
			_config = Object.assign({}, this.config, options)
			if (this.interceptor.request) {
				_config = this.interceptor.request(_config)
				if (_config === false) {
					return reject('请求被拦截');
				}
			}
			// 统一的请求日志记录
			//_reqlog(_config)
			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}
}
/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log("地址：" + req.url)
		if (req.data) {
			console.log("请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	// if (process.env.NODE_ENV === 'development') {
		console.log("响应结果：" + JSON.stringify(res))
	// }
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch (_statusCode) {
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}
