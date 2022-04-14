<template>
	<page-meta>
		<navigation-bar :title="$t('t_2')" front-color="#000000" :background-color="$colors.white"/>
	</page-meta>
	<view class="page-box">
		<view class="top-navbar">
			<view class="btn-box flex">
				<view class="btn-item" :style="{color:btnListIdx==index ? $colors.white:$colors.mainColor,backgroundColor:btnListIdx==index?$colors.mainColor:'#fff1d9'}" v-for="(item,index) in bntList" :key="index" @click="onBtnList(index)">{{item}}</view>
			</view>
			<view v-show="!btnListIdx" class="menu-box">
        <scroll-view scroll-x :scroll-with-animation="true" class="scroll-view">
					<view class="menu-item" :style="(vipListIdx == index)?`color:${$colors.mainColor}`:''" v-for="(item,index) in vipListAll" :key="index" @click="onVipList(item,index)">
						<text> {{item.name}} </text>
						<!-- <text> {{item.level===0?$t('xf_35'):item.name}} </text> -->
          </view>
          <view class="line" :style="`transform: translateX(${translateX}px) translateX(-50%);background-color:${$colors.mainColor}`"></view>
        </scroll-view>
			</view>
		</view>
		<view class="list-box">
			<view class="list-item" style="position: relative;" v-for="(item,index) in dataList" :key="index" @click="onDataList(item)">
				<view class="name-title-box flex">
					<text class="title toe">{{item.goods_name}}</text>
					<view class="item-row item-row2 flex">
						<text v-show="!btnListIdx" class="level">
							{{item.levelName}}
						</text>
					</view>
				</view>
				<view class="userinfo-box flex">
					<view>
						<image class="fill-box" :src="item.goods_pic" mode="widthFix">
							
							<view class="discount" v-if="item.is_promotion === 1" :style="{color: 'red',position: 'absolute',top: '50px',left: '5px',zIndex: 20}">discount</view>
						</image>
						<image class="showTimeImg" v-if="item.is_limitedpro === 1" src="../../static/imgs/rBlqbKWdpL.png"></image>
					</view>
					<view class="userinfo">
						<view class="item-row flex" v-if="item.is_limitedpro === 1" >
							
							<text class="price">限时价格：{{item.limited_price}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						</view>
						<view class="item-row flex">
							
							<text :class="item.is_limitedpro === 1?'blcakPrice':'price'">{{$t('v_kdhsjg')}}：{{item.goods_price}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						</view>
						<view class="item-row flex" v-if="item.goods_discount_price || item.discount_pic">
							<text class="price">{{$t('xf_518')}}：{{item.goods_discount_price || item.discount_pic}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						</view>
						<view class="item-row flex">
							<text>{{item.type === 3 ? $t('v_tsyyoe'):$t('v_yyqihvbk')}}：{{!btnListIdx?item.huibao:item.commission}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						</view>
						<view class="item-row flex">
							<text v-show="!btnListIdx">{{$t('v_kdzszq')}}：{{item.hour}}</text>
						</view>
						<view class="item-row flex" v-if="environment === 'ps_pro' || environment === 'sw_pro'">
							<text v-show="!btnListIdx && item.order_num > 0">{{$t('v_kdzssl0')}}：{{item.order_num}}</text>
						</view>
						<view class="item-row flex">
							<text v-if="item.status===1" class="shoukong">{{$t('xf_shoukong')}}</text>
							<button v-else class="xf-tag" :style="'background-color:'+$colors.bg1" :disabled="disBuy && dataListIdx==index" :loading="disBuy &&dataListIdx==index"
								@click="showGoodsCount(item,index)">{{btnListIdx === 1 ? item.countdown : btnTxt}}</button>
						</view>
					</view>
					<!-- <view v-else class="userinfo userinfo2 flex">
						<view class="flex-row flex-item">
							<view class="row-item">
								<text>{{$t('v_djjw')}}</text>
								<b class="item-txt2">{{item.goods_price}}</b>
							</view>
							<view class="row-item">
								<text>{{$t('v_ubyi')}}</text>
								<b class="item-txt3">+{{item.commission}}</b>
							</view>
						</view>
						<view class="order-num">{{$t('v_ddjhk')}}：{{item.id}}</view>
						<view class="">{{item.addtime}}</view>
					</view> -->
				</view>
			</view>
			<uni-load-more :status="loadState"></uni-load-more>
		</view>
		<!-- 购买数量 -->
		<uni-popup ref="goodsCount" type="dialog">
		  <uni-popup-dialog type="info" :title="$t('xf_522')" :cancelText="$t('xf_cancle')" :okText="$t('xf_sure')"
		                    @confirm="buyShop()" @close="onCancel()">
		    <input v-model="good_count" maxlength="8" style="border: 1px solid #cccccc;border-radius: 5px;padding-left: 5px;" class="good_count" name="good_count"
		           :placeholder="$t('xf_523')">
		  </uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				dataList: [],
				dataListIdx: 0,
				bntList: [this.$t('v_keysddj'),this.$t('v_iuliddj'),this.$t('v_yiwjigdddj')],
				btnListIdx: 0,
				vipListAll: [],
				vipList0: [{id: 50, level: 49, name: this.$t('v_qrbu')}],
				vipListIdx: 0,
				disBuy: false,
				// 加载更多
				loadState: 'loading',
				page: 1,
				limit: 20,
				translateX: 25,
				inter: null,
				good_count: undefined,
				currentItem: {}
			}
		},
		onReady() {
			this.delayPerform(()=>{
				this.vipListAll =this.vipList0.concat(this.vipList)
				this.getDataList(this.vipListAll[0].level)
				this.$store.commit('saveUserInfo')
			},200)
		},
		onShow() {
			if(this.drawback=='payDetail'){
				this.page =1
				this.loadState ='loading'
				this.btnListIdx =1
				this.getDataList(this.btnListIdx+1)
				this.$store.commit('finishOrder','')
			}
			// #ifdef APP-PLUS
			if(uni.getStorageSync('need_reload')) {
			  // 数据里面的翻译文案按需要重新翻译1
			  this.getDataList()
			}
			// #endif
		},
		onPullDownRefresh() {
			this.page =1
			this.loadState ='loading'
			if(!this.btnListIdx){
				this.getDataList(this.vipListAll[this.vipListIdx].level)
			}else{
				this.getDataList(this.btnListIdx+1)
			}
		},
		onReachBottom() {
			if(this.loadState =='loading'){
				this.page++
				if(!this.btnListIdx){
					this.getDataList(this.vipListAll[this.vipListIdx].level)
				}else{
					this.getDataList(this.btnListIdx+1)
				}
			}
		},
		watch:{
			vipList: function() {
				this.vipListAll = []
				this.vipListAll =this.vipList0.concat(this.vipList)
				// console.log(this.vipListAll, 'this.vipListAll')
			}
		},
		computed:{
			...mapState(['drawback', 'vipList']),
			btnTxt(){
				let txt =this.$t('v_dmjigbml')
				if(this.btnListIdx == 1){
					txt = this.$t('v_cssyz')
				}else if(this.btnListIdx==2){
					txt =this.$t('v_ywc')
				}
				return txt
			},
		},
		onUnload() {
			clearInterval(this.inter)
		},
		methods: {
			onCancel() {
				this.good_count = undefined
			},
			buyShop(it,idx){
				if(this.btnListIdx) return
				if (this.userInfo.operation_is_allowed == 0) {
					this.openShowToast(this.$t('xf_520'))
					return
				}
				if (this.good_count) {
					if(this.good_count < 1 || !(/^[0-9]*[1-9][0-9]*$/.test(this.good_count))) {
						this.openShowToast(this.$t('xf_524'))
						return
					}
				}
				this.disBuy =true
				this.$http.post('do_goods',{goods_id: this.currentItem.id || it.id, good_count: this.good_count}).then(res => {
					this.disBuy =false
					if (res && res.data && res.data.code == 200) {
					  // this.openShowToast(res.data.info)
						const data2 ={
							order_id: res.data.data.order_id,
							...res.data.data.goods
						}
						if ((this.environment === 'dev' || this.environment === 'ny_pro') && res.data.data.orderinfo) {
							data2.num = res.data.data.orderinfo.num
							data2.iscancel = res.data.data.iscancel
							data2.goods_count = res.data.data.orderinfo.goods_count
							data2.discount_price = Number(res.data.data.orderinfo.goods_discount_pic) / res.data.data.orderinfo.goods_count
						}
						this.$store.commit('sePayDeatil', data2)
						this.delayPerform(()=>{
							// this.onJumpPage(`./payDeatil?data=${JSON.stringify(data2)}`)
							this.onJumpPage(`./payDeatil`)
						})
					} else {
						this.openShowToast(res.data.info)
					}
				});
			},
			onDataList(it){
				if(this.btnListIdx){
					this.onJumpPage(`./orderDeatil?id=${it.id}`)
				}
			},
			// 菜单
			onBtnList(idx){
				if(this.btnListIdx !=idx){
					this.btnListIdx =idx
					this.page =1
					this.dataList = []
					this.loadState ='loading'
					if(!idx){
						this.getDataList(this.vipListAll[this.vipListIdx].level)
					}else{
						this.getDataList(idx+1)
					}
				}
			},
			onVipList(e,idx){
				this.translateX = 25 + 50*idx
				if(this.vipListIdx !=idx){
					this.vipListIdx =idx
					this.page =1
					this.loadState ='loading'
					this.dataList = []
					this.getDataList(e.level)
				}
			},
			getDataList(level){
				let url ='goodsList',data ={level:level}
				if(this.btnListIdx){
					url ='order_list'
					data ={type:level}
				}
				const that = this
				this.$http.get(url,{page: this.page,limit: this.limit,...data}).then(res => {
					if(this.page ==1) this.dataList = [] //如果是第一页需手动置空列表
					if (res && res.data && res.data.code == 200) {
						this.limit =res.data.data.limit ||20
						let data2 = res.data.data.list
						uni.stopPullDownRefresh()
						this.dataList = this.dataList.concat(this.handleDataList(data2, data.type)); //追加新数据
						if (this.environment === 'ko_pro') {
							this.dataList.forEach(obj => {
								obj.goods_price = `$${obj.goods_price}`
								if (obj.goods_discount_price) {
									obj.goods_discount_price = `$${obj.goods_discount_price}`
								}
								obj.huibao = `$${obj.huibao}`
							})
						}
						if(this.btnListIdx === 1) {
							//收益中的商品才需要倒计时
							that.inter = setInterval(() => {
								this.dataList.forEach(obj => {
									obj.countdown = this.countDown(obj.count_down--)
								})
								this.dataList = JSON.parse(JSON.stringify(this.dataList))
							}, 1000)
						} else {
							console.log('clear interal', this.btnListIdx)
							clearInterval(that.inter)
						}
						console.log('drawback dataList===>', JSON.parse(JSON.stringify(this.dataList)))
						if(data2.length<this.limit){
							this.loadState ='noMore'
						}
					}
				});
			},
			handleDataList(data, type) {
				let dataTmp = data
				if (this.vipListAll && this.vipListAll.length > 0) {
					if (dataTmp && dataTmp.length > 0) {
						dataTmp.map((item, index) => {
							item.type = type
							item.levelName = `VIP${item.level}`
							return item
						})
					}
					return dataTmp
				}
			},
			countDown(seconds){
				console.log(seconds, 'seconds')
				if(!seconds || seconds < 0) {
					return this.btnTxt
				}
				let hour = Math.floor(seconds/3600)
				let minute = Math.floor((seconds - hour*3600)/60)
				let second = Math.floor((seconds - hour*3600 - minute*60))
				const result = `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`
				console.log(result)
				return result
			},
			showGoodsCount(item, index) {
				this.dataListIdx = index
				if (this.environment === 'dev' || this.environment === 'ny_pro') {
					this.good_count = undefined
					this.$refs.goodsCount.open()
					this.currentItem = item
				} else {
					this.buyShop(item, index)
				}
			}
		}
	}
</script>

<style lang="less">
	.page-box{
		padding: 0 10px;
		// background-color: #ffffff;
		.menu-box{
			padding: 15px 15px 0;
      .scroll-view {
        height: 45px;
        .uni-scroll-view-content {
          position: relative;
        }
      }
      .menu-item{
        border-left: none;width: 50px;text-align: center;padding: 10px 0px 0 0px;
      }
      .line {
        position: absolute;margin-top: 5px;height: 3px;border-radius: 5px;transition-duration: 0.3s;width: 20px;
      }
			.menu-active{
				border-bottom: 2px solid #B30101;
			}
		}
	}
	.top-navbar{
		border-radius: 5px;
		background-color: #FFFFFF;
		position: sticky;
		top: var(--window-top);
		z-index: 99;
	}
	.btn-box{
		justify-content: space-around;
		font-size: 15px;
		margin-top: 10px;
		padding: 10px 0;
		border-bottom: 1px solid #f5f5f5;
		.xf-btn{
			width: 110px;
		}
		.btn-item {
			width: 30%;
			border: 1px solid #caa160;
			padding: 0.675rem 0.4rem;
			border-radius: 8px;
			background-color: #fff1d9;
			text-align: center;
		}
	}
	.list-box{
		margin-top: 20px;
		.list-item{
			padding-top: 5px;
			margin-bottom: 15px;
			border-radius: 10px;
			background-color: #FFFFFF;
			.name-title-box {
				justify-content: space-between;
				padding: 8px 5px;
				font-weight: 400;
				font-size: 14px;
				background: #f5f5f5;
				margin-top: 5px;
				.level{
					min-width: 60px;
					height: 21px;
					line-height: 21px;
					font-size: 12px;
					color: #caa160;
					padding: 0 5px;
					border-radius: 10px 0 0 10px;
					// background-image: linear-gradient(#FD9C81,#FF716B);
					text-align: center;
				}
			}
			.fill-box{
				position: relative;
				width: 80px;
				max-height: 127px;
			}
			.showTimeImg{
				position: absolute;
				left: 20px;
				width: 30px;
				height: 30px;
			}
			.userinfo-box{
				align-items: center;
				width: 100%;
				padding: 10px 0 0 15px;
				border-radius: 10px;
				background-color: #fff;
				.userinfo{
					flex: 1;
					font-size: 14px;
					margin-left: 15px;
					.item-row{
						justify-content: space-between;
						margin: 0 10px 15px 0;
					}
					.item-row2{
						margin-right: 0;
					}
					.title{
						display: inline-block;
						width: 400rpx;
					}
					.price{
						color: #B30101;
					}
					.blcakPrice{
						color: black;
						text-decoration:line-through
					}
					.shoukong{
						color: #adadad;
					}
					.xf-tag {
						display: flex;
						justify-content: center;
						align-items: center;
						padding: 0 15px;
						border-radius: 8px !important;
						color: #fff !important;
						border: 1px solid #ebedf0;
						width: 130px;
						height: 30px;
					}
					.xf-tag2{
						width: 100%;
						background-color: #C0C0C0;
					}
				}
				.userinfo2{
					font-size: 14px;
					color: #333333;
					.flex-row{
						justify-content: space-between;
					}
					.order-num{
						margin-bottom: 5px;
					}
				}
			}
		}
	}
</style>
