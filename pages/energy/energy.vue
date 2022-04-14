<template>
	<page-meta>
		<navigation-bar :title="$t('t_2')" front-color="#000000" :background-color="$colors.white"/>
	</page-meta>
	<view class="page-box">
		<view class="top-navbar">
			<view class="btn-box flex">
				<view class="btn-item" :style="{color:btnListIdx==index ? '#000000':'#cccccc'}" v-for="(item,index) in bntList" :key="index" @click="onBtnList(index)">{{item}}</view>
			</view>
		</view>
		<view class="list-box flex" v-if="btnListIdx === 0">
			<view class="list-item" style="position: relative;" v-for="(item,index) in dataList" :key="index" @click="onDataList(item)">
				<view class="flex" style="justify-content: center;">
					<image class="fill-box" :src="item.image" mode="widthFix">
						<view class="discount" v-if="item.is_promotion === 1" :style="{color: 'red',position: 'absolute',top: '50px',left: '5px',zIndex: 20}">discount</view>
					</image>
				</view>
				<view class="userinfo-box flex">
					<view class="userinfo">
						<view class="item-row flex">
							<text class="title toe">{{item.name}}</text>
						</view>
						<view class="item-row flex">
							<text class="price">{{$t('xf_411')}}：{{item.bili}}</text>
						</view>
						<view class="item-row flex" v-if="item.day">
							<text class="price">{{$t('xf_381')}}：{{item.day}}{{$t('xf_491')}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else v-for="(item,index) in recordList" class="record-list">
		  <view class="list-item">
		    <view class="item1">
		      <view class="name">{{item.name}}</view>
		      <view>{{$t('xf_471')}}：{{item.num}}</view>
		    </view>
		    <view class="item2">
		      {{$t('xf_481')}}：{{item.addtime}}
		    </view>
		  </view>
		</view>
		<uni-load-more :status="loadState"></uni-load-more>
		<!-- 订单详情 -->
		<uni-popup ref="sureBuyPop" type="dialog">
		      <uni-popup-dialog type="info" :title="$t('xf_451')" :before-close="true" :cancelText="$t('xf_cancle')" :okText="$t('xf_sure')" @close="close" @confirm="confirmBuy">
		        <view class="sureBuy">
		          <view class="sureBuy-item">
		            <view class="name">{{$t('xf_401')}}：</view>
		            <view class="value">{{checkItem.name}}</view>
		          </view>
				  <view class="sureBuy-item">
				    <view class="name">{{$t('t_60')}}：</view>
				    <view class="value">{{checkItem.min_num}}</view>
				  </view>
				  <view class="sureBuy-item">
				    <view class="name">{{$t('t_61')}}：</view>
				    <view class="value">{{checkItem.max_num}}</view>
				  </view>
		          <view class="sureBuy-item">
		            <view class="name">{{$t('xf_411')}}：</view>
		            <view class="value">{{checkItem.bili}}</view>
		          </view>
		          <view class="sureBuy-item">
		            <view class="name">{{$t('xf_381')}}：</view>
		            <view class="value">{{checkItem.day}}{{$t('xf_491')}}</view>
		          </view>
				  <view class="sureBuy-item">
				    <view class="name">{{$t('xf_401')}}：</view>
				    <view class="value">{{checkItem.max_investment}}</view>
				  </view>
		          <view class="sureBuy-item">
		            <view class="name">{{$t('xf_431')}}：</view>
		            <input type="number" v-model="price" class="value" :placeholder="$t('xf_441')"/>
		          </view>
		        </view>
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
				recordList: [],
				bntList: [this.$t('v_keysddj1'),this.$t('v_iuliddj')],
				btnListIdx: 0,
				vipListAll: [],
				vipList0: [{id: 50, level: 49, name: this.$t('v_qrbu')}],
				disBuy: false,
				// 加载更多
				loadState: 'loading',
				page: 1,
				limit: 20,
				translateX: 25,
				inter: null,
				price: '',
				checkItem: {},
			}
		},
		onReady() {
			this.delayPerform(()=>{
				this.vipListAll =this.vipList0.concat(this.vipList)
				this.getDataList()
			},200)
		},
		onShow() {
			if(this.drawback=='payDetail'){
				this.page =1
				this.loadState ='loading'
				this.btnListIdx =1
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
			}
		},
		computed:{
			...mapState(['drawback', 'vipList']),
			btnTxt(){
				let txt =this.$t('v_dmjigbml')
				if(this.btnListIdx == 1){
					txt = this.$t('v_cssyz')
				} else if(this.btnListIdx==2){
					txt =this.$t('v_ywc')
				}
				return txt
			},
		},
		onUnload() {
			clearInterval(this.inter)
		},
		methods: {
			onDataList(item){
				console.log(item)
				if(item.limitreached === 1) {
				  //投资总额已达上限，不能购买
				  this.openShowToast(this.$t('xf_521'))
				} else {
					this.checkItem = item
					this.$refs.sureBuyPop.open()
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
						this.getDataList()
					}else{
						this.getRecords()
					}
				}
			},
			getDataList(){
				this.$http.get('lixibao_product',{page: this.page,limit: this.limit}).then(res => {
					// if(this.page ===1) this.dataList = [] //如果是第一页需手动置空列表
					if (res && res.data && res.data.code === 200) {
						// this.limit =res.data.data.limit ||20
						let data2 = res.data.data.list
						uni.stopPullDownRefresh()
						for(let i = 0; i < data2.length; i++) {
							data2[i].image = `/static/imgs/energy/${i%6+1}@2x.png`
						}
						console.log(data2, 'data2')
						// this.dataList = this.dataList.concat(data2); // 追加新数据
						this.dataList = data2 //data2.slice(0,6)
						if(data2.length <= this.limit){
							this.loadState ='noMore'
						}
					}
				});
			},
			getRecords(){
				if(this.page ===1) this.recordList = [] //如果是第一页需手动置空列表
				this.$http.get('lixibao_record',{page: this.page,limit: this.limit}).then(res => {
				  if (res && res.data && res.data.code === 200) {
					// this.limit =res.data.data.limit ||20
					let data2 = res.data.data.list
					uni.stopPullDownRefresh()
					this.recordList = this.dataList.concat(data2); // 追加新数据
					if(data2.length<this.limit){
					  this.loadState ='noMore'
					}
				  }
				});
		    },
			close() {
			  this.$refs.sureBuyPop.close()
			  this.price = ''
			},
			confirmBuy() {
				if (!this.price) {
					this.openShowToast(this.$t('xf_441'))
					return
				}
				this.$http.post('lixibao_ru',{lcid: this.checkItem.id, price: this.price}).then(res => {
					this.$refs.sureBuyPop.close()
					this.openShowToast(res.data.info)
					this.price = ''
				});
			},
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
		// padding: 10px 0;
		// border-bottom: 1px solid #f5f5f5;
		.xf-btn{
			width: 110px;
		}
		.btn-item {
			margin: 10px 0;
			width: 30%;
			// border: 1px solid #caa160;
			// padding: 0.675rem 0.4rem;
			border-radius: 8px;
			// background-color: #fff1d9;
			text-align: center;
		}
	}
	.list-box{
		margin-top: 20px;
		flex-wrap: wrap;
		justify-content: space-around;
		.list-item{
			padding-top: 5px;
			margin-bottom: 15px;
			border-radius: 10px;
			width: 48%;
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
				width: 94%;
				max-height: 127px;
			}
			.userinfo-box{
				align-items: center;
				width: 100%;
				padding: 5px 0 0 5px;
				border-radius: 10px;
				background-color: #fff;
				.userinfo{
					flex: 1;
					font-size: 14px;
					// margin-left: 15px;
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
	.sureBuy {
	  display: flex;flex-direction: column;width: 100%;
	  .sureBuy-item {
	    display: flex;align-items: center;padding: 5px 0;
	    .name {
	      width: 100px;text-align: right;
		  font-size: 12px;
	    }
		.value {
			font-size: 14px;
		}
	  }
	}
	.record-list {
	  display: flex;flex-direction: row;padding: 10px;margin: 10px;background-color: #ffffff;border-radius: 10px;
	  .list-item {
		padding: 10px;background-color: #ffffff;
		.item1 {
		  display: flex;
		  .name {
			font-weight: bold;margin-right: 10px;width: 150px;
		  }
		}
		.item2 {
		  margin-top: 5px;
		}
	  }
	}
</style>
