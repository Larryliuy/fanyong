<template>
  <page-meta>
    <navigation-bar :title="pageTitle" :front-color="$colors.white" :background-color="$colors.mainColor"/>
  </page-meta>
	<view class="page-box">
		<uni-list :border="false">
			<uni-list-item :title="item.title" :ellipsis="1" showArrow :to="`./content?name=${item.title}&id=${item.id}`"
				v-for="(item,index) in dataList" :key="index"/>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				type: 1,
				toDetai: false,
        opt: {},
        pageTitle: '',
			}
		},
		onLoad(opt) {
			console.log(opt, 'opt content')
			this.type = opt.type
      this.opt = opt
			if ((this.environment === 'ko_pro' || this.environment === 'sw_pro') &&
          (opt.type === '1' || opt.type === '3' || opt.type === '5') && (opt.from === 'home' || opt.from === 'mine'))
			{
				this.toDetai = true
			}
			if (this.environment === 'ps_pro' && opt.type === '1') {
				this.toDetai = true
			}
      // uni.setNavigationBarTitle({
      // 	title: opt.name
      // })
      this.pageTitle = opt.name
			this.getDataList()
		},
		onPullDownRefresh() {
			this.getDataList()
		},
		methods: {
			getDataList(){
				this.$http.get('get_msg',{type:this.type}).then(res => {
					uni.stopPullDownRefresh()
					if (res && res.data && res.data.code == 200) {
						this.dataList =res.data.data.list
						console.log(this.from, this.dataList[0], 'get_msg')
						if (this.dataList[0]) {
							if(this.toDetai) {
								let url = `./content?name=${this.dataList[0].title}&id=${this.dataList[0].id}&from=${this.opt.from}`
								this.onJumpPage(url)
							}
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.uni-list-item{
		padding: 5px;
	}
	::v-deep .uni-list-item__content-title {
		font-size: 30rpx;
	}
</style>
