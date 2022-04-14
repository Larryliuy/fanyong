import myConfig from "../myConfig.js"

//设置颜色
let currentColor = {}
const themeColor = myConfig.getConfigObj().themeColor
if (themeColor === 'red') {
	currentColor = require('./red.js')
} else if (themeColor === 'blue') {
	currentColor = require('./blue.js')
} else if (themeColor === 'ka') {
	currentColor = require('./ka.js')
}
export default {
	...currentColor
}