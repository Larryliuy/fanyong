<template>
	<page-meta>
		<navigation-bar :title="$t('xf_32')" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box">
		<view class="detail-box">
			<view class="top-box column-center">
				<image :src="dataList.goods_pic" mode="widthFix"></image>
				<h3>{{dataList.goods_name}}</h3>
			</view>
			<view class="list-box">
				<view class="list-item flex"> <text>{{$t('v_djjw')}}</text> {{dataList.goods_price}}</view>
				<view class="list-item flex" v-if="dataList.discount_pic"> <text>{{$t('xf_518')}}</text> {{dataList.discount_pic}}</view>
				<view class="list-item flex"> <text>{{$t('v_ubyi')}}</text> {{dataList.commission}}</view>
				<view class="list-item flex"> <text>{{$t('v_uhpnuuld')}}</text> {{dataList.goods_count}}</view>
				<view class="list-item flex"> <text>{{$t('v_zsjnor')}}</text> {{totalMoney}}</view>
				<view class="list-item flex"> <text>{{$t('v_ddjhk')}}</text> {{dataList.oid}}</view>
				<view class="list-item flex"> <text>{{$t('v_fksj')}}</text> {{dataList.paytime}}</view>
				<view class="list-item flex"> <text>{{$t('v_djuijm')}}</text> {{dataList.addtime}}</view>
				<view class="list-item flex"> <text>{{$t('v_ubyiuijm')}}</text> {{dataList.endtime}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: ''
			}
		},
		onLoad(opt) {
			this.getDataList(opt.id)
		},
		computed:{
			totalMoney(){
				let num =0
				if(this.dataList){
					if (this.dataList.discount_pic) {
						num = this.dataList.discount_pic*this.dataList.goods_count+Number(this.dataList.commission)
					} else {
						num = this.dataList.goods_price*this.dataList.goods_count+Number(this.dataList.commission)
					}
				}
				return num
			}
		},
		methods: {
			getDataList(id){
				this.$http.post('order_info',{id: id}).then(res => {
					if (res && res.data && res.data.code == 200) {
						this.dataList = res.data.data.orderInfo
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		padding-top: 10px;
	}
	.detail-box{
		margin: 0 15px;
		border-radius: 10px;
		background-color: #FFFFFF;
		.top-box{
			color: #114F5A;
			padding: 30px;
			border-bottom: 1px dashed #ccc;
			&>image{
				width: 50%;
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
</style>
