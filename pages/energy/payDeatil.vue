<template>
	<page-meta>
		<navigation-bar :title="$t('xf_ddxq')" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box">
		<view class="detail-box">
			<view class="top-box column-center">
				<image :src="dataList.goods_pic" mode="widthFix"></image>
				<h3>{{dataList.goods_name}}</h3>
			</view>
			<view class="list-box">
				<view class="list-item flex" style="justify-content: space-between;">
					<text>{{$t('v_djjw')}}</text>
					<text style="color: #EAA942;text-align: right;">{{dataList.num || dataList.goods_price}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;color: #EAA942;">USDT</text></text>
				</view>
				<view class="list-item flex" style="justify-content: space-between;" v-if="dataList.goods_discount_pic">
					<text>{{$t('xf_518')}}</text>
					<text style="color: #EAA942;text-align: right;">{{dataList.discount_price || dataList.goods_discount_pic}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;color: #EAA942;">USDT</text></text>
				</view>
				<view class="list-item flex">
					<text>{{$t('v_ubyi')}}</text>
					<text style="color: #EAA942;text-align: right;">{{dataList.commission}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;color: #EAA942;">USDT</text></text>
				</view>
				<view class="list-item flex">
					<text>{{$t('v_ddjhk')}}</text>
					<text style="color: #EAA942;text-align: right;">{{dataList.order_id}}</text>
				</view>
			</view>
			<view class="btn-box">
				<button class="xf-btn" :disabled="disBuy" @click="submit">{{$t('v_tijcdj')}}</button>
				<button v-if="(environment === 'ny_pro' || environment === 'dev') && dataList.iscancel === 1" class="xf-btn xf-btn2" :disabled="disBuy2" @click="cancle">取消</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	
	export default {
		data() {
			return {
				dataList: '',
				disBuy: false,
				disBuy2: false,
			}
		},
		onLoad(opt) {
			// this.dataList =JSON.parse(opt.data)
			this.dataList = this.payDeatil
		},
		computed:{
			...mapState(['payDeatil'])
		},
		methods: {
			submit(){
				this.disBuy =true
				this.$http.post('do_order',{oid: this.dataList.order_id,status:1}).then(res => {
					this.disBuy =false
					this.openShowToast(res.data.info)
					if (res && res.data && res.data.code == 200) {
						this.$store.commit('finishOrder','payDetail')
						this.delayPerform(()=>{
							uni.switchTab({
								url: './drawback'
							})
						})
					}else if (res && res.data && res.data.code == 202) {
						this.delayPerform(()=>{
							this.onJumpPage(`/pages/mine/wallet/recharge`)
						})
					}
				});
			},
			cancle(){
				this.disBuy2 =true
				this.$http.post('cancel_order',{oid: this.dataList.order_id}).then(res => {
					this.disBuy2 =false
					this.openShowToast(res.data.info)
					if (res && res.data && res.data.code == 200) {
						this.delayPerform(()=>{
							this.goBack()
						})
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #FFFFFF;
	}
	.detail-box{
		.top-box{
			color: #114F5A;
			padding: 30px 20px 0;
			&>image{
				width: 40%;
				margin-bottom: 15px;
			}
		}
	}
	.list-box{
		padding: 30px 20px;
		.list-item{
			color: #EAA942;
			margin-bottom: 10px;
			text{
				flex: 1;
				color: $themeColor;
			}
		}
	}
	.btn-box{
		.xf-btn{
			width: 90%;
			font-size: 17px;
			margin: 0 auto;
		}
	}
	.xf-btn2{
		text-decoration: underline;
		color: #999999;
		background-color: #FFFFFF;
	}
</style>
