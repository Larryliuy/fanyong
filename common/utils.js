import Base64 from 'crypto-js/enc-base64'
import Latin1 from 'crypto-js/enc-latin1'
import * as des from './des'

export default class utils {

	/**
	 *
	 * @param num
	 * @returns {string}
	 */
	
	static sk = 'kyrOfCUuXBDCIVH5fSuni4s2rivdu27qrMVSL8PR'
	
	static toThousands(num) {
		if(num && num.toString().indexOf('.') !== -1) {
			let arr = num.toString().split('.')
			return (arr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + arr[1];
		}
		return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	}

	static isAndroid() {
		let ua = navigator.userAgent.toLowerCase()
		return /android/.test(ua)
	}

	static isIOS() {
		let ua = navigator.userAgent.toLowerCase()
		return /iphone|ipad|ipod/.test(ua)
	}
	
	static SPS(str) { // 加密
		let enc = des.des(this.sk, str, 1, 0, null, 1)
		return Base64.stringify(Latin1.parse(enc))
	}
	
	static SPL(str) { // 解密
		let s = Latin1.stringify(Base64.parse(str))
		let d = des.des(this.sk, s, 0, 0, null, 1)
		return d
	}

}