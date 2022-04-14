import {mapState,mapGetters,mapMutations,mapActions} from "vuex"
const mixin = {
	computed: {
		...mapState({
			token: state => state.token,
			userInfo: state => state.userInfo,
			language: state => state.language,
			environment: state => state.environment
		})
	},
	methods: {
		goBack(num=1) {
			uni.navigateBack({
				delta: num
			})
		},
		onJumpPage(url) {
			uni.navigateTo({
				url: url
			});
		},
		openShowToast(e, time) {
			uni.showToast({
				title: e,
				icon:'none',
				mask:true,
				duration: time || 1500
			})
		},
		//延迟执行
		delayPerform(callback,time=800){
			setTimeout(() => {
				callback()
			}, time);
		}
	}
}
export default mixin;