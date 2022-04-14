<template>
  <page-meta>
    <navigation-bar :title="pageTitle" :front-color="$colors.white" :background-color="$colors.mainColor"/>
  </page-meta>
	<view class="page-box">
		<!-- #ifdef APP-PLUS -->
		<mp-html :content="dataList" />
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view v-html="dataList" class="html-content"></view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: '',
				backHome: false,
				backMine: false,
				pageTitle: '',
				pageOpt: {}
			}
		},
		onLoad(opt) {
			console.log(opt, 'opt onload')
			this.pageOpt = opt
			if (this.environment === 'ko_pro' || this.environment === 'sw_pro' || this.environment === 'ps_pro') {
			    if (opt.from === 'home') {
				  this.backHome = true
				}
				if (opt.from === 'mine') {
				  this.backMine = true
				}
			}
			// uni.setNavigationBarTitle({
			// 	title: opt.name
			// })
			this.pageTitle = opt.name
			this.getDataList(opt.id)
		},
		onBackPress(opt) {
			console.log(opt, this.backHome, this.backHome, 'opt')
			if(this.backHome) {
				uni.switchTab({
					url: '/pages/home/home',
				})
				return true
			} else if(this.backMine) {
        uni.switchTab({
          url: '/pages/mine/mine',
        })
        return true
      }
		},
		methods: {
			getDataList(id){
				this.$http.get('getMsgContent',{id:id}).then(res => {
					if (res && res.data && res.data.code == 200) {
						this.dataList = res.data.data.info.content
						// #ifdef H5
						setTimeout(() => {
							let dom = document.getElementById('tw-target-text')
							console.log(dom, 'dom')
							if(dom) {
								dom.style.whiteSpace = 'pre-wrap'
							}
						},100)
						// #endif
						// if(this.environment === 'ko_pro') {
						// 	let reg = /href="([\s\S+]{1,200})"/
						// 	if(reg.test(this.dataList)) {
						// 		console.log(this.backHome, RegExp.$1, this.dataList, 'backHome')
						// 		const kefuUrl = RegExp.$1
						// 		// #ifdef H5
						// 		if (this.$utils.isIOS() && window.kefuUrlTab) {
						// 		  window.kefuUrlTab.location.href = kefuUrl
						// 		} else {
						// 		  window.open(kefuUrl)
						// 		}
						// 		// #endif
						// 		// #ifdef APP-PLUS
						// 		plus.runtime.openWeb(kefuUrl)
						// 		// #endif
						// 		if(this.backHome) {
						// 			uni.switchTab({
						// 				url: '/pages/home/home',
						// 			})
						// 		} else if(this.backMine) {
						// 			uni.switchTab({
						// 				url: '/pages/mine/mine',
						// 			})
						// 		}
						// 	}
						// }
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		padding: 10px 10px 0;
		background-color: #FFFFFF;
		box-sizing: border-box;
	}
	.page-box {
		.html-content {
		}
	}
	// #ifdef H5
	strong {
		white-space: pre-wrap !important;
	}
	// #endif
</style>
