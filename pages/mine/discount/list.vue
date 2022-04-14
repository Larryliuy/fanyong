<template>
	<page-meta>
    <navigation-bar :title="$t('xf_510')" :front-color="$colors.white" :background-color="$colors.mainColor" />
	</page-meta>
  <view @click="mingxi" class="mingxi">{{$t('xf_371')}}</view>
  <view class="info-wrapper flex" v-if="discountInfo.id">
		<view>
			<view>{{$t('xf_512')}}：{{discountInfo.discount_name}}</view>
			<view v-if="discountInfo.discount_status === 2">{{$t('xf_516')}}：{{$t('xf_519')}}</view>
			<view v-else>{{$t('xf_516')}}：{{discountInfo.endtime}}</view>
		</view>
	  <view style="align-self: center;justify-content: space-around;">
		  <button class="xf-btn" @click="confirmRenew()" :style="'background-color:'+$colors.button1">
		  	{{$t('xf_514')}}
		  </button>
	  </view>
	  
  </view>
	<view class="page-box">
    <view v-for="(item,index) in dataList" class="list">
      <view class="list-item item1">
        <text class="name">{{item.discount_name}}</text>
        <text class="shouxu" :style="'color:'+$colors.button2">{{item.discount_rate}}</text>
      </view>
      <view class="list-item item2">
        <text class="zhouqi">{{$t('xf_511')}}：<text style="color: #333333;">{{item.discount_day}}{{$t('xf_491')}}</text></text>
		<text class="price">{{$t('xf_rmb')}}{{item.discount_num}}</text>
		<!-- <text class="price">{{$t('xf_516')}}{{discountInfo.endtime}}</text> -->
      </view>
      <view class="list-item item3" v-if="getBtnText(item)">
		  <!-- <text class="price">{{item.discount_num}}</text> -->
        <button class="xf-btn" @click="buy(item)" :style="'background-color:'+$colors.button1">
			{{getBtnText(item)}}
		</button>
      </view>
	  <view class="list-item item3" v-else>
		  <text v-show="item.discount_level === discountInfo.discount_level">{{$t('xf_512')}}</text>
	  </view>
    </view>
		<uni-load-more :status="loadState"></uni-load-more>
		<view class="introduce" v-if="environment === 'pt_pro'" v-html="introduce"></view>
    <uni-popup ref="sureBuyPop" type="dialog">
      <uni-popup-dialog type="info" :title="$t('xf_451')" :before-close="true" :cancelText="$t('xf_cancle')" :okText="$t('xf_sure')" @close="close" @confirm="onConfirm">
        <view class="sureBuy">
          <view class="sureBuy-item">
            <view class="name">{{$t('xf_401')}}：</view>
            <view class="value">{{checkItem.discount_name}}</view>
          </view>
          <view class="sureBuy-item">
            <view class="name">{{$t('xf_517')}}：</view>
            <view class="value">{{checkItem.discount_rate}}</view>
          </view>
          <view class="sureBuy-item">
            <view class="name">{{$t('xf_381')}}：</view>
            <view class="value">{{checkItem.discount_day}}{{$t('xf_491')}}</view>
          </view>
         <view class="sureBuy-item">
           <view class="name">{{$t('xf_515')}}：</view>
           <view class="value">{{checkItem.discount_num}}</view>
         </view>
		 <!-- <view class="sureBuy-item">
		   <view class="name">{{$t('xf_516')}}：</view>
		   <view class="value">{{checkItem.endtime}}</view>
		 </view> -->
          <!-- <view class="sureBuy-item">
            <view class="name">{{$t('xf_431')}}：</view>
            <input type="number" v-model="price" class="value" :placeholder="$t('xf_441')"/>
          </view> -->
        </view>
      </uni-popup-dialog>
    </uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				// 加载更多
				loadState: 'loading',
				page: 1,
				limit: 20,
				checkItem: {},
				price: '', // 用户输入的金额
				introduce: '',
				discountInfo: {}
			}
		},
		onLoad(opt) {
			this.getDataList()
			//获取说明
			this.$http.get('get_msg',{type:11}).then(res => {
				console.log(res,'sssss')
				if(res && res.data && res.data.code === 200) {
					this.introduce = res.data.data.list[0].content
				}
			})
		},
		onPullDownRefresh() {
			this.page =1
			this.loadState ='loading'
			this.getDataList()
		},
		onReachBottom() {
			if(this.loadState ==='loading'){
				this.page++
				this.getDataList()
			}
		},
		methods: {
			getDataList(){
				this.$http.get('discount_list',{page: this.page,limit: this.limit}).then(res => {
					if(this.page ===1) this.dataList = [] //如果是第一页需手动置空列表
					if (res && res.data && res.data.code === 200) {
						// this.limit =res.data.data.limit ||20
						let data2 = res.data.data.discount_list
						if (res.data.data.discount_user_info && res.data.data.discount_user_info.id) {
							this.discountInfo = res.data.data.discount_user_info
							if (!this.discountInfo.discount_level) {
								this.discountInfo.discount_level = res.data.data.discount_level || 0
							}
						}
						uni.stopPullDownRefresh()
						this.dataList = this.dataList.concat(data2); //追加新数据
						if(data2.length<this.limit){
							this.loadState ='noMore'
						}
					}
				});
			},
			buy(item) {
				this.checkItem = item
				this.$refs.sureBuyPop.open()
			},
			close() {
				this.$refs.sureBuyPop.close()
				this.price = ''
			},
			onConfirm() {
				if(!this.discountInfo.id || this.discountInfo.discount_status === 2) {
					this.confirmBuy()
					return
				}
				if(this.discountInfo.discount_level === this.checkItem.discount_level) {
					this.confirmRenew()
					return
				}
				if (this.discountInfo.discount_level < this.checkItem.discount_level) {
					this.confirmUpdate()
				} else if (this.discountInfo.discount_level === this.checkItem.discount_level) {
					// this.confirmRenew()
				} else {}
			},
			confirmBuy() {
				this.$http.post('discount_buy',{discount_id: this.checkItem.id}).then(res => {
				  this.$refs.sureBuyPop.close()
				  this.openShowToast(res.data.info)
				  this.getDataList()
				});
			},
			confirmUpdate() {
			  this.$http.post('discount_up',{discount_id: this.checkItem.id}).then(res => {
				this.$refs.sureBuyPop.close()
				this.openShowToast(res.data.info)
				this.getDataList()
			  });
			},
			confirmRenew() {
			  this.$http.post('discount_renew',{discount_id: this.discountInfo.discount_id}).then(res => {
				this.$refs.sureBuyPop.close()
				this.openShowToast(res.data.info)
				this.getDataList()
			  });
			},
			mingxi() {
				this.onJumpPage(`./mingxi`)
			},
			getBtnText(item) {
				console.log(this.discountInfo, item, '0.0.0.0.')
				// 没有折扣卡时显示购买
				if(!this.discountInfo.id || this.discountInfo.discount_status === 2) {
					return this.$t('xf_391')
				}
				if(this.discountInfo.discount_level === item.discount_level) {
					return ''
				}
				if (this.discountInfo.discount_level < item.discount_level) {
					return this.$t('xf_513')
				} else{
					return ''
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-wrapper {
		padding-top: 10px;
		// text-align: center;
		justify-content: space-around;
		font-size: 14px;
		.xf-btn {
			width: 100px;
			height: 30px;
			border-radius: 50px;
		}
	}
	.page-box{
		font-size: 13px;
		.scroll-view{
			width: 100%;
			background-color: #FFFFFF;
		}
		.introduce {
			margin: 10px 0 0 10px;
		}
    .list {
      display: flex;flex-direction: row;padding: 10px;margin: 10px;background-color: #ffffff;border-radius: 10px;
      .list-item {
        flex: 1;display: flex;flex-direction: column;
        .name {
          font-weight: bold;font-size: 15px;
        }
        .shouxu {
          font-size: 12px;
        }
        .zhouqi {
          color: #bdbdbd;font-size: 12px;
        }
        .xf-btn {
          width: 100px;height: 30px;
          font-size: 14px;
          border-radius: 50px;
        }
      }
    }
    .item3 {
      justify-content: center;align-items: center;
    }
    .sureBuy {
      display: flex;flex-direction: column;width: 100%;
      .sureBuy-item {
        display: flex;align-items: center;padding: 5px 0;
        .name {
          width: 100px;text-align: right;
        }
      }
    }
	}
  .mingxi {
    position: fixed;top: 0;right: 0;z-index: 999;color: #fff;padding: 9px;
  }
</style>
