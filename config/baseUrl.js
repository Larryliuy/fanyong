import myConfig from "../myConfig.js"

export default {
	// serverUrl: myConfig.getConfigObj().list,
	serverUrl: myConfig.getServerUrl(),
	backupServerUrls: myConfig.getBackupServerList(),
	socketUrl: '',
	logoImg: (lang) => `/static/imgs/logo_${lang}.png`
}
