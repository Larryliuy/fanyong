/**
 * 红色主题的颜色
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.libName = factory());
}(this, (function () {
	return {
		key: 'red',
		mainColor: '#B30101',
		white: '#FFFFFF',
		selectedColor: '#FFC24F',
		f4f4: '#F4F4F4',
		button1: '#F14424',
		button2: '#E92B2B',
		bg1: '#E82C2B',
		arrow: '#626161',
		btnBg: 'linear-gradient(90deg, #F14424, #E92B2B)',
		jianbian10: '#FE7A0E',
		jianbian11: '#FD3E3D',
		jianbian20: '#FA8A65',
		jianbian21: '#FA5B4B',
		jianbian30: '#FDC744',
		jianbian31: '#FDA336',
		jianbian40: '#FE0F7C',
		jianbian41: '#F30212',
		jianbian50: '#E92725',
		jianbian51: '#B30709',
		jianbian60: '#FD9C81',
		jianbian61: '#FF716B',
		jianbian70: '#FFAE3E',
		jianbian71: '#FE681E',
	}
})));