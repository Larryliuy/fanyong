const readline = require('readline');
const fs = require('fs');
const { resolve, join, sep } = require('path')
const myConfig = require('../myConfig.js');
var process = require('child_process');

// 处理颜色
let currentColor = {}
const themeColor = myConfig.getConfigObj().themeColor
if (themeColor === 'red') {
	currentColor = require('../colors/red.js')
} else if (themeColor === 'blue') {
	currentColor = require('../colors/blue.js')
} else if (themeColor === 'ka') {
	currentColor = require('../colors/ka.js')
}
// 处理各个国家的版本的货币，即不同的语言
const obj = {
	'ko_pro': 'ko_pro',
	'cn_pro': 'cn_pro'
}
const currency = obj[myConfig.environment] || 'us_pro' // 货币后缀，好匹配不同的图片
/**
 * 需要翻译的
 */
const i18n = {
	ja_pro: {
		'规则介绍': 'ルール紹介'
	},
	ko_pro: {
		'规则介绍': '규칙 소개'
	},
	me_pro: {
		'规则介绍': 'Introducción reglas'
	},
	en_pro: {
		'规则介绍': 'Rule Intro'
	},
	cn_pro: {
		'规则介绍': '规则介绍'
	},
}
const i18nObj = i18n[myConfig.environment] || i18n['en_pro']

/**
 * 修改 pages.json 文件
 */
const rl_pages = readline.createInterface({
	input: fs.createReadStream('../pages.json')
});
let currentLine_pages = 0
let newString_pages = ''
rl_pages.on('line', (line) => {
	currentLine_pages++
	if (currentLine_pages === 27) {
		const tmpstr = line.split(`"text"`)[0]
		line = tmpstr + `"text":"${i18nObj['规则介绍']}",`
	} else if (currentLine_pages === 144) {
		const tmpstr = line.split(`"selectedColor"`)[0]
		line = tmpstr + `"selectedColor":"${currentColor.selectedColor}",`
	}
	// 修改带符号的图片
	else if (currentLine_pages === 160) {
		const tmpstr = line.split(`"iconPath"`)[0]
		line = tmpstr + `"iconPath":"static/tabbar/drawback_${currency}.png",`
	} else if (currentLine_pages === 161) {
		const tmpstr = line.split(`"selectedIconPath"`)[0]
		line = tmpstr + `"selectedIconPath":"static/tabbar/drawback_act_${currency}.png"`
	} else if (currentLine_pages === 177) {
		const tmpstr = line.split(`"navigationBarBackgroundColor"`)[0]
		line = tmpstr + `"navigationBarBackgroundColor":"${currentColor.mainColor}",`
	}
	// 修改跟环境、版本相关的
	else if (currentLine_pages === 153) { // 更换路由
		const tmpstr = line.split(`"pagePath"`)[0]
		if (myConfig.environment === 'ny_pro') {
			line = tmpstr + `"pagePath": "pages/miner/miner",`
		} else {
			line = tmpstr + `"pagePath": "pages/company/company",`
		}
	}
	else if (currentLine_pages === 158) { // 更换路由
		const tmpstr = line.split(`"pagePath"`)[0]
		if (myConfig.environment === 'ny_pro') {
			line = tmpstr + `"pagePath": "pages/energy/energy",`
		} else {
			line = tmpstr + `"pagePath": "pages/drawback/drawback",`
		}
	}
	else if (currentLine_pages === 163) { // 更换路由
		const tmpstr = line.split(`"pagePath"`)[0]
		if (myConfig.environment === 'ny_pro') {
			line = tmpstr + `"pagePath": "pages/company/company",`
		} else {
			line = tmpstr + `"pagePath": "pages/vip/vip",`
		}
	}
	newString_pages += line + '\n'
});

rl_pages.on('close', ()=> {
	console.log('closed')
	fs.writeFile('../pages.json', newString_pages, function(err) {
		if (err) {
			console.error(err);
		}
		console.log(myConfig.environment,' ----------pages.json配置修改成功-------------');
	});
});

/**
 * 修改 manifest.json 文件
 */
const name = myConfig.getConfigObj().name
const env = myConfig.environment
// 获取icon路径映射
const mapEnv =  {
	'cn_pro': '中国版相关',
	'pa_pro': '巴拿马版相关',
	'ps_pro': '1225版本相关ps',
	'mcl_pro': '1226版本相关mcl',
	'de_pro': '德国版相关',
	'ko_pro': '韩国版本相关',
	'me_pro': '墨西哥版本相关',
	'ja_pro': '日本版本相关ja',
	'sw_pro': '瑞典版本相关',
	'ny_pro': '新能源版本',
}
// let routeStr = resolve('./') + mapEnv[env] + '/icon'
const rl_manifest = readline.createInterface({
	input: fs.createReadStream('../manifest.json')
});
let currentLine_manifest = 0
let newString_manifest = ''
rl_manifest.on('line', (line) => {
	currentLine_manifest++
	// 修改 打包时的name
	if (currentLine_manifest === 2) {
		const tmpstr = line.split(`"name"`)[0]
		line = tmpstr + `"name": "${name}",`
	} else if (currentLine_manifest === 167) {
		const tmpstr = line.split(`"title"`)[0]
		line = tmpstr + `"title": "${name}",`
	} else if (currentLine_manifest === 59) {
		const tmpstr = line.split(`"hdpi"`)[0]
		let iconPath = __dirname + sep + mapEnv[env] + sep + 'icons' + sep + '72x72.png'
		iconPath = iconPath.replace(/\\/g,'\\\\')
		console.log(myConfig.environment, iconPath)
		line = tmpstr + `"hdpi": "${iconPath}",`
	} else if (currentLine_manifest === 60) {
		const tmpstr = line.split(`"xhdpi"`)[0]
		let iconPath = __dirname + sep + mapEnv[env] + sep + 'icons' + sep + '96x96.png'
		iconPath = iconPath.replace(/\\/g,'\\\\')
		console.log(myConfig.environment, iconPath)
		line = tmpstr + `"xhdpi": "${iconPath}",`
	} else if (currentLine_manifest === 61) {
		const tmpstr = line.split(`"xxhdpi"`)[0]
		let iconPath = __dirname + sep + mapEnv[env] + sep + 'icons' + sep + '144x144.png'
		iconPath = iconPath.replace(/\\/g,'\\\\')
		console.log(myConfig.environment, iconPath)
		line = tmpstr + `"xxhdpi": "${iconPath}",`
	} else if (currentLine_manifest === 62) {
		const tmpstr = line.split(`"xxxhdpi"`)[0]
		let iconPath = __dirname + sep + mapEnv[env] + sep + 'icons' + sep + '192x192.png'
		iconPath = iconPath.replace(/\\/g,'\\\\')
		console.log(myConfig.environment, iconPath)
		line = tmpstr + `"xxxhdpi": "${iconPath}"`
	} else if (currentLine_manifest === 92) {
		const tmpstr = line.split(`"hdpi"`)[0]
		let iconPath = __dirname + sep + mapEnv[env] + sep + 'android配置' + sep + 'loading_480$762.png'
		iconPath = iconPath.replace(/\\/g,'\\\\')
		console.log(myConfig.environment, iconPath)
		line = tmpstr + `"hdpi": "${iconPath}",`
	} else if (currentLine_manifest === 93) {
		const tmpstr = line.split(`"xhdpi"`)[0]
		let iconPath = __dirname + sep + mapEnv[env] + sep + 'android配置' + sep + 'loading_720$1242.png'
		iconPath = iconPath.replace(/\\/g,'\\\\')
		console.log(myConfig.environment, iconPath)
		line = tmpstr + `"xhdpi": "${iconPath}",`
	} else if (currentLine_manifest === 94) {
		const tmpstr = line.split(`"xxhdpi"`)[0]
		let iconPath = __dirname + sep + mapEnv[env] + sep + 'android配置' + sep + 'loading_1080$1882.png'
		iconPath = iconPath.replace(/\\/g,'\\\\')
		console.log(myConfig.environment, iconPath)
		line = tmpstr + `"xxhdpi": "${iconPath}"`
	}
	newString_manifest += line + '\n'
});

rl_manifest.on('close', ()=> {
	console.log('closed')
	fs.writeFile('../manifest.json', newString_manifest, function(err) {
		if (err) {
			console.error(err);
		}
		console.log(myConfig.environment,' ----------manifest.json配置修改成功-------------');
		
		let cmd = "cli.exe pack --config " + __dirname + sep + mapEnv[env] + sep + "pack.json";
		// cmd = cmd.replace(/\\/g,'\\\\')
		process.exec(cmd, function(error, stdout, stderr) {
			if(error) {
				console.log("error:"+error);
			} else {
				// console.log('打包成功')
			}
		});
	});
});