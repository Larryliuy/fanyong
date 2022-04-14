/**
 * 多语言的操作
 */
import myConfig from '../myConfig.js'

// 是哪一种语言
let locale = 'cn'
// 根据操作系统默认设置语言
let localeLanguageCode = ''
// #ifdef H5
localeLanguageCode = navigator.language.toLowerCase()
// #endif
// #ifdef APP-PLUS
try {
	const res = uni.getSystemInfoSync();
	localeLanguageCode = res.language;
} catch (e) {
	// error
}
// #endif
if (/^zh-/.test(localeLanguageCode) || localeLanguageCode === 'zh') { // 中文(中国大陆简体)、中文（中国台湾，繁体）
	locale = 'cn'
} else if (/^ko-/.test(localeLanguageCode) || localeLanguageCode === 'ko') { // 韩文
	locale = 'ko'
} else if (/^ja-/.test(localeLanguageCode) || localeLanguageCode === 'ja') { // 日文
	locale = 'ja'
} else if (/^es-/.test(localeLanguageCode) || localeLanguageCode === 'es') { // 西班牙语
	locale = 'es'
} else if (/^it-/.test(localeLanguageCode) || localeLanguageCode === 'it') { // 意大利
	locale = 'ly'
} else if (/^id-/.test(localeLanguageCode) || localeLanguageCode === 'id') { // 印度尼西亚语言
	locale = 'nc'
} else if (/^pt-/.test(localeLanguageCode) || localeLanguageCode === 'pt') { // 巴西葡萄牙语
	locale = 'pt'
} else if (/^pt-/.test(localeLanguageCode) || localeLanguageCode === 'tr') { // 巴西葡萄牙语
	locale = 'tr'
} else { // 不识别的都为英语
	locale = 'en'
}

console.log(myConfig, 'myConfig.environment')
if(myConfig.environment === 'cn_pro') {
	locale = 'cn'
} else if(myConfig.environment === 'ko_pro') {
	locale = locale === 'ko' ? 'ko' : 'en'
} else if(myConfig.environment === 'ja_pro') {
	locale = 'ja'
} else if(myConfig.environment === 'sw_pro') {
	locale = 'sw'
} else if(myConfig.environment === 'me_pro') {
	locale = 'es'
} else if(myConfig.environment === 'pa_pro') {
	locale = 'en'
} else if(myConfig.environment === 'ps_pro' && locale === 'cn') {
	locale = 'en'
} else if (myConfig.environment === 'de_pro') {
	if (locale === 'de') {
		locale = 'de'
	} else if (locale === 'ly') {
		locale = 'ly'
	} else {
		locale = 'en'
	}
}

// 用户设置了哪一种语言
const language = uni.getStorageSync('language')
if (language) {
	locale = language
}

// 设置测试环境中的语言
if (myConfig.isTest || myConfig.environment === 'dev') {
	// locale = 'cn'
}
console.log(locale, 'locale')
export default {
	locale
}