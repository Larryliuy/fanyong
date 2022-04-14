<template>
	<page-meta>
		<navigation-bar :title="$t('xf_24')" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box">
		<view class="menu-box">
			<!-- <scroll-view class="scroll-view" scroll-x> -->
			<view class="menu-item" :style="(titleListIdx==index?`color:${$colors.white};backgroundColor: ${$colors.mainColor};`:'')" v-for="(item,index) in titleList" :key="index" @click="swichMenu(index)"> <text> {{item}} </text> </view>
			<!-- </scroll-view> -->
		</view>
		<view class="right-box" >
			<view v-for="(it,idx) in dataList" :key="idx">
				<view class="right-item row-center">
					<view class="title-box flex">
						<template v-if="titleListIdx==4">
							<text>{{it.type}}</text>
							<text class="txt">{{$t('v_uijidkvh')}}：{{it.real_num}}</text>
							<text class="txt">{{$t('v_vdtl')}}：<text :style="{color:it.color}">{{it.type_name}}</text></text>
							<text class="txt" v-if="it.reject_info">{{it.reject_info}}</text>
						</template>
						<text v-else>{{it.type_name}}</text>
						<template v-if="titleListIdx==3">
							<text class="txt">{{$t('v_vdtl')}}：<text :style="{color:it.color}">{{it.status_name}}</text></text>
							<text class="txt" v-if="it.reject_info">{{it.reject_info}}</text>
						</template>
						<text class="small-gray-txt">{{it.addtime}}</text>
					</view>
					<view class="money-box flex">
						<text class="money">{{it.show_num || it.num}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						<text v-if="it.commission > 0 || it.commision === 0" class="commission">{{$t('v_tshbje') + ': ' + it.commission}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						<text v-if="it.give_number > 0" class="commission">{{$t('v_tshbje') + ': ' + it.give_number}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
					</view>
				</view>
			</view>
		<uni-load-more :status="loadState"></uni-load-more>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				winHeight: 0,
				titleList: [this.$t('xf_24'),this.$t('v_trdvysjn'),this.$t('xf_bzjmx'),this.$t('xf_43'),this.$t('xf_44')],
				titleListIdx: 0,
				dataList: [],
				// 加载更多
				loadState: 'loading',
				page: 1,
				limit: 20
			}
		},
		onLoad(opt) {
			if(opt.idx) this.titleListIdx =opt.idx-0
			this.winHeight =uni.getSystemInfoSync().windowHeight
			this.getDataList()
		},
		onPullDownRefresh() {
			this.page =1
			this.loadState ='loading'
			this.getDataList()
		},
		onReachBottom() {
			if(this.loadState =='loading'){
				this.page++
				this.getDataList()
			}
		},
		methods: {
			// 菜单
			swichMenu(index) {
				if(index != this.titleListIdx){
					this.titleListIdx = index;
					this.page =1
					this.loadState ='loading'
					this.dataList = []
					this.getDataList()
				}
			},
			getDataList(){
				let url ='',data ={}
				if(this.titleListIdx==3){
					url ='rechargeList'
				}else if(this.titleListIdx==4){
					url ='depositList'
				}else{
					url ='balanceList'
					data ={type:this.titleListIdx+1}
				}
				this.$http.get(url,{page: this.page,limit: this.limit,...data}).then(res => {
					if(this.page ==1) this.dataList = [] //如果是第一页需手动置空列表
					if (res && res.data && res.data.code == 200) {
						this.limit =res.data.data.limit ||20
						let data2 =res.data.data.list
						data2.forEach(item=>{
							if([3,4].includes(this.titleListIdx)){
								if(this.titleListIdx==3){
									if(item.type!=4 ||(item.type==4 &&!item.num.includes('-'))){
										item.num ='+'+item.num
									}
								}else{
									if (item.type === 3) {
										item.num ='+'+item.num
									} else {
										item.num ='-'+item.num
									}
								}
								if(item.status==1){
									item.color ='#f0ad4e'
								}else if(item.status==2){
									item.color ='#4cd964'
								}else if(item.status==3){
									item.color ='#dd524d'
								}
							}else{
								if([1,6,16].includes(item.type) || item.status==1){
									item.num ='+'+item.num
								}else{
									if (item.type === 3 || item.type === 35) {
										item.num ='+'+item.num
									} else {
										item.num ='-'+item.num
									}
								}
							}
						})
						uni.stopPullDownRefresh()
						this.dataList = this.dataList.concat(data2); //追加新数据
						if(data2.length<this.limit){
							this.loadState ='noMore'
						}
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.page-box {
		display: flex;
		// flex-direction: column;
		justify-content: flex-start;
	}
	.menu-box{
		padding: 10px;
		width: 90px;
		display: flex;
		flex-direction: column;
		.scroll-view{
			width: 100%;
			background-color: #FFFFFF;
		}
		.menu-item{
			width: 86px;
			height: 70px;
			max-height: 86px;
			padding: 10px 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff1d9;
			color: #caa160;
			border-radius: 8px;
			white-space: pre-wrap;
			border-left: none;
			margin-bottom: 10px;
		}
	}
	.right-box {
		margin: 15px 10px 10px;
		// width: calc(100% - 100px);
		flex: 1;
		.right-item {
			padding: 8px 15px;
			border-radius: 5px;
			background-color: #FFFFFF;
			.title-box{
				flex: 1;
				flex-direction: column;
				font-size: 17px;
				.txt{
					font-size: 14px;
					margin-top: 3px;
				}
				.small-gray-txt{
					margin-top: 5px;
				}
			}
			.money-box {
				flex-direction: column;width: 80px;
				.commission {
					font-size: 12px;
					color: #666;
				}
			}
		}
		.money{
			color: $themeColor;
		}
	}
</style>
