/**
 * 蓝色主题的颜色
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.libName = factory());
}(this, (function () {
	return {
		key: 'blue',
		mainColor: '#0000ff',
		white: '#FFFFFF',
		selectedColor: '#0000ff',
		f4f4: '#F4F4F4',
		button1: '#2d8cf0',
		button2: '#57a3f3',
		bg1: '#075fbd',
		arrow: '#eeeeee',
		btnBg: 'linear-gradient(90deg, #1668c1, #1468c5)',
		jianbian10: '#79a3cf',
		jianbian11: '#295f99',
		jianbian20: '#478dd9',
		jianbian21: '#1668c1',
		jianbian30: '#FDC744',
		jianbian31: '#FDA336',
		jianbian40: '#2f85e3',
		jianbian41: '#1468c5',
		jianbian50: '#197fef',
		jianbian51: '#086ddb',
		jianbian60: '#073e7a',
		jianbian61: '#0e75e7',
		jianbian70: '#1e81ef',
		jianbian71: '#0671e9',
	}
})));