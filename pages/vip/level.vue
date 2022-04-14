<template>
	<page-meta>
		<navigation-bar :title="$t('xf_17')+'VIP'" front-color="#000000" :background-color="$colors.white"/>
	</page-meta>
	<view class="page-box">
		<view class="item-box flex" v-for="(item,index) in vipList" :key="item.level">
			<image :src="item.pic" mode="widthFix"></image>
			<view class="userinfo">
				<view class="username flex level-box">
					<text class="level">{{item.name}}</text>
					<view class="intro-vip">{{$t('xf_5')}}<uni-icons type="arrowright" color="#43d17b"></uni-icons></view>
				</view>
				<view class="username flex">
					<text v-if="environment === 'ko_pro'" class="txt-yuan" :style="'color:'+$colors.mainColor">{{$t('xf_16')}}：{{$t('xf_rmb')}}{{item.num.replace(/\.00$/, '')}}</text>
					<text v-else class="txt-yuan" :style="'color:'+$colors.mainColor">{{$t('xf_16')}}：{{$t('xf_rmb')}}{{item.num}}</text>
				</view>
			</view>
			<view class="btn-box flex" v-if="userInfo.level !== item.level">
				<button class="xf-btn" @click="onBtnList(item)" :style="'background-color:'+$colors.bg1"></button>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {}
		},
		computed:{
			...mapState(['vipList'])
		},
		methods: {
			onBtnList(item,idx){
				if(item.level === 0){
					this.$http.get('cancelVip').then(res => {
						this.openShowToast(res.data.info)
						if (res && res.data && res.data.code == 200) {
							this.$store.commit('saveUserInfo')
							this.delayPerform(()=>{
								if(!idx){
									uni.switchTab({
										url: '/pages/drawback/drawback'
									})
								}
							})
						}
					});
				} else {
					const that = this
					if (this.userInfo.level > 0) {
						this.$http.get('cancelVip').then(res => {
							if (res && res.data && res.data.code == 200) {
								that.$http.post('recharge_dovip',{level: item.level}).then(res1 => {
									that.openShowToast(res1.data.info)
									if (res1 && res1.data && res1.data.code == 200) {
										that.$store.commit('saveUserInfo')
										that.delayPerform(()=>{
											if(!idx){
												uni.switchTab({
													url: '/pages/drawback/drawback'
												})
											}
										})
									}
								});
							} else {
								that.openShowToast(res.data.info)
							}
						});
					} else {
						that.$http.post('recharge_dovip',{level: item.level}).then(res1 => {
							that.openShowToast(res1.data.info)
							if (res1 && res1.data && res1.data.code == 200) {
								that.$store.commit('saveUserInfo')
								that.delayPerform(()=>{
									if(!idx){
										uni.switchTab({
											url: '/pages/drawback/drawback'
										})
									}
								})
							}
						});
					}
				}
			},
		},
		mounted() {
			if(this.userInfo.level === undefined) {
				this.$store.commit('saveUserInfo')
			}
		}
	}
</script>

<style lang="scss">
	.page-box{
		padding: 0 10px;
	}
	.item-box{
		align-items: center;
		width: 100%;
		padding: 15px;
		margin-bottom: 10px;
		border-radius: 10px;
		background-color: #fff;
		&>image{
			width: 50px;
		}
		.userinfo{
			flex: 1;
			margin-left: 20px;
			.username{
				.level{
					// flex: 1;
					font-size: 18px;
					font-weight: 700;
					color: #333333;
					// text-align: right;
					margin-right: 15px;
				}
				.txt-yuan {
					margin-top: 5px;
				}
			}
			.level-box {
				justify-content: flex-start;
				.intro-vip {
					border: 1px solid #43d17b;
					color: #43d17b;
					border-radius: 12px;
					padding: 2px 8px;
				}
			}
		}
		.btn-box{
			margin-top: 10px;
			.xf-btn{
				width: 40px;
				height: 40px;
				// margin-right: 20px;
				// border-radius: 40px;
				display: flex;
				justify-content: center;
				align-items: center;
				white-space:nowrap; overflow:hidden;
				text-overflow:ellipsis;
				background-image: url(../../static/imgs/govip.png);
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
		}
	}
</style>
