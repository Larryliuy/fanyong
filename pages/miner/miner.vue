<template>
	<page-meta>
		<navigation-bar :title="$t('t_2')" front-color="#000000" :background-color="$colors.white"/>
	</page-meta>
	<view class="page-box">
		<view class="notice-box-wrapper flex">
			<view class="icon"><image class="notice" style="width: 21px;height: 24px;" :src="`/static/imgs/notice_${$colors.key}.png`" mode="widthFix"></image></view>
			<gbro-marquee broadcastType='text' direction="left" :viewHeight="100"
			 :broadcastIconIsDisplay="!true" :touchEvent="true" :broadcastData='broadcastData' :broadcastStyle='broadcastStyle'
			 style="width: 100%">
			</gbro-marquee>
		</view>
		<view class="top-navbar">
			</view>
		</view>
		<view class="list-box">
			<view class="list-item" style="position: relative;" v-for="(item,index) in dataList" :key="index">
				<view class="list-item-top flex">
					<image class="fill-box" :src="item.goods_pic" mode="widthFix">
						<view class="discount" v-if="item.is_promotion === 1" :style="{color: 'red',position: 'absolute',top: '50px',left: '5px',zIndex: 20}">discount</view>
					</image>
					<button v-else class="xf-tag" :style="'background-color:'+$colors.bg1" :disabled="disBuy && dataListIdx==index" :loading="disBuy &&dataListIdx==index"
						@click="showGoodsCount(item,index)">{{$t('v_dmjigbml')}}</button>
				</view>
				<view class="userinfo-box flex">
					<view class="userinfo">
						<view class="item-row flex">
							<text class="title toe">{{item.goods_name}}</text>
						</view>
						<view class="item-row flex">
							<text>{{$t('t_67')}}：<text class="price">{{item.goods_price}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text></text>
						</view>
						<view class="item-row flex" v-if="item.min_investment">
							<text>{{$t('t_63')}}：<text class="price">{{item.min_investment}}</text><text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						</view>
						<view class="item-row flex" v-if="item.max_investment">
							<text>{{$t('t_64')}}：<text class="price">{{item.max_investment}}</text><text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						</view>
						<view class="item-row flex">
							<text>{{$t('t_66')}}：<text class="price">{{item.bili}}</text><text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						</view>
						<view class="item-row flex" v-if="item.total_investment && item.total_investment !== '0.00'">
							<text>{{$t('t_65')}}：<text class="price">{{item.total_investment}}</text><text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
						</view>
					</view>
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
	import gbroMarquee from '@/components/gbro-marquee/marquee.vue'
	export default {
		data() {
			return {
				dataList: [],
				dataListIdx: 0,
				bntList: [this.$t('v_keysddj'),this.$t('v_iuliddj')],
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
				broadcastData: [],
				broadcastStyle: {
					speed: 1, //每秒3个字
					font_size: "32", //字体大小(rpx)
					text_color: this.$colors.mainColor, //字体颜色
					// back_color: "red", //背景色
				},
				good_count: undefined,
				currentItem: {}
			}
		},
		onReady() {
			this.delayPerform(()=>{
				this.vipListAll =this.vipList0.concat(this.vipList)
				this.getDataList()
				this.getNotice()
			},200)
		},
		onLoad() {
			//
			this.$store.commit('saveUserInfo')
		},
		onShow() {
			if(this.drawback=='payDetail'){
				this.page =1
				this.loadState ='loading'
				// this.btnListIdx =1
				this.getDataList()
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
				this.getDataList()
			}else{
				this.getDataList()
			}
		},
		onReachBottom() {
			if(this.loadState =='loading'){
				this.page++
				if(!this.btnListIdx){
					this.getDataList()
				}else{
					this.getDataList()
				}
			}
		},
		watch:{
			vipList: function() {
				this.vipListAll = []
				this.vipListAll =this.vipList0.concat(this.vipList)
			},
			userInfo: function() {
				this.getDataList()
			}
		},
		computed:{
			...mapState(['drawback', 'vipList']),
			btnTxt(){
				return this.$t('v_dmjigbml')
			},
			rate() {
				if(this.vipListAll && this.userInfo) {
					console.log(this.vipListAll, this.userInfo)
					for(let i = 0; i < this.vipListAll.length; i++) {
						if(this.vipListAll[i].level === this.userInfo.level) {
							return this.vipListAll[i].bili + '%'
						}
					}
				} else {
					return '0%'
				}
			}
		},
		onUnload() {
			clearInterval(this.inter)
		},
		components: {
			gbroMarquee
		},
		methods: {
			onCancel() {
				this.good_count = undefined
			},
			buyShop(it,idx){
				if (this.good_count) {
					if(this.good_count < 1 || !(/^[0-9]*[1-9][0-9]*$/.test(this.good_count))) {
						this.openShowToast(this.$t('xf_524'))
						return
					}
				}
				console.log(it, this.currentItem, 'this.currentItem')
				if(this.currentItem.id) {
					if(this.currentItem.total_investment !== '0.00' && Number(this.currentItem.goods_price) * Number(this.good_count) > Number(this.currentItem.total_investment)) {
						this.openShowToast(this.$t('xf_525'))
						return
					}
				}
				this.disBuy =true
				this.$http.post('do_goods',{goods_id: this.currentItem.id || it.id, good_count: this.good_count}).then(res => {
					this.disBuy =false
					if (res && res.data && res.data.code == 200) {
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
							this.onJumpPage(`./payDeatil`)
						})
					} else {
						this.openShowToast(res.data.info)
					}
				});
			},
			// 菜单
			onBtnList(idx){
				if(this.btnListIdx !=idx){
					this.btnListIdx =idx
					this.page =1
					this.dataList = []
					this.loadState ='loading'
					if(!idx){
						this.getDataList()
					}else{
						this.getDataList()
					}
				}
			},
			getDataList(level){
				let url = 'goodsList', data = {level: this.userInfo.level || 0}
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
			getNotice() {
				const that = this
			    this.$http.get('get_join_us').then(res => {
			    console.log('get_join_us ===>', res)
			    if (res && res.data && res.data.data && res.data.data.list && res.data.data.list.content) {
			      that.broadcastData = [res.data.data.list.content]
			    } else {
			      if (this.environment === 'ko_pro') {
			        if (this.language === 'ko') {
			          that.broadcastData = ['코로나 19의 영향으로 사람 중심 이라는 이념을 고수하는  Mall of Berlin은 대면 접촉을 줄이고  외국인 사용자가 편리하게 세금 환급 절차를 완료할 수 있도록 온라인 세금 환급 서비스를 출시했습니다.']
			        } else {
			          that.broadcastData = [`Due to the impact of COVID-19, cleaving to the people-oriented concept, Mall of Berlin has launched its online Tax Refund Service to reduce face-to-face contact and make it easier for foreign users to complete the Tax Refund process.`]
			        }
			      } else {
			        that.broadcastData = [this.$t('v_tmksuij2')]
			      }
			    }
			  })
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
	.notice-box-wrapper{
		justify-content: flex-start;
		padding: 5px 3%;
		margin-top: 10px;
		border-radius: 5px;
		background-color: #FFFFFF;
	}
	.page-box{
		padding: 0 10px;
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
		.xf-btn{
			width: 110px;
		}
		.btn-item {
			margin-top: 10px;
			width: 30%;
			border-radius: 8px;
			text-align: center;
		}
	}
	.list-box{
		margin-top: 10px;
		padding: 0 10px;
		flex-wrap: wrap;
		justify-content: space-around;
		.list-item{
			padding: 5px 8px 0 8px;
			margin-bottom: 15px;
			border-radius: 10px;
			// width: 48%;
			background-color: #FFFFFF;
			.list-item-top {
				justify-content: space-between;
				align-items: center;
				.xf-tag{
					font-size: 14px;
					min-width: 100px;
					height: 36px;
					line-height: 36px;
					border-radius: 8px;
				}
			}
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
					text-align: center;
				}
			}
			.fill-box{
				width: 80px;
				max-height: 127px;
				margin-left: 8px;
			}
			.userinfo-box{
				align-items: center;
				width: 100%;
				padding: 10px 0 0 7px;
				border-radius: 10px;
				background-color: #fff;
				.userinfo{
					flex: 1;
					font-size: 14px;
					.item-row{
						justify-content: space-between;
						margin: 0 10px 5px 0;
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
