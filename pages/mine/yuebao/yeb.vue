<template>
	<page-meta>
    <navigation-bar :title="$t('xf_361')" :front-color="$colors.white" :background-color="$colors.mainColor" />
	</page-meta>
  <view @click="mingxi" class="mingxi">{{$t('xf_371')}}</view>
	<view class="page-box">
    <view v-for="(item,index) in dataList" class="list">
      <view class="list-item item1">
        <text class="name">{{item.name}}</text>
        <text class="shouxu" :style="'color:'+$colors.button2">{{item.bili}}</text>
      </view>
      <view class="list-item item2">
        <text class="zhouqi">{{$t('xf_381')}}</text>
        <text>{{item.day}}{{$t('xf_491')}}</text>
      </view>
      <view class="list-item item3">
        <button class="xf-btn" @click="buy(item)" :style="'background-color:'+$colors.button1">{{$t('xf_391')}}</button>
      </view>
    </view>
		<uni-load-more :status="loadState"></uni-load-more>
		<view class="introduce" v-if="environment === 'pt_pro'" v-html="introduce"></view>
    <uni-popup ref="sureBuyPop" type="dialog">
      <uni-popup-dialog type="info" :title="$t('xf_451')" :before-close="true" :cancelText="$t('xf_cancle')" :okText="$t('xf_sure')" @close="close" @confirm="confirmBuy">
        <view class="sureBuy">
          <view class="sureBuy-item">
            <view class="name">{{$t('xf_401')}}：</view>
            <view class="value">{{checkItem.name}}</view>
          </view>
          <view class="sureBuy-item">
            <view class="name">{{$t('xf_411')}}：</view>
            <view class="value">{{checkItem.bili}}</view>
          </view>
          <view class="sureBuy-item">
            <view class="name">{{$t('xf_381')}}：</view>
            <view class="value">{{checkItem.day}}{{$t('xf_491')}}</view>
          </view>
<!--          <view class="sureBuy-item">-->
<!--            <view class="name">{{$t('xf_421')}}：</view>-->
<!--            <view class="value">{{checkItem.shouxu}}</view>-->
<!--          </view>-->
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
				introduce: ''
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
				this.$http.get('lixibao_product',{page: this.page,limit: this.limit}).then(res => {
					if(this.page ===1) this.dataList = [] //如果是第一页需手动置空列表
					if (res && res.data && res.data.code === 200) {
						// this.limit =res.data.data.limit ||20
						let data2 =res.data.data.list
						uni.stopPullDownRefresh()
						this.dataList = this.dataList.concat(data2); //追加新数据
						if(data2.length<this.limit){
							this.loadState ='noMore'
						}
					}
				});
			},
      buy(item) {
		  if(item.limitreached === 1) {
			  //投资总额已达上限，不能购买
			  this.openShowToast(this.$t('xf_521'))
		  } else {
			this.checkItem = item
			this.$refs.sureBuyPop.open()
		}
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
      mingxi() {
        this.onJumpPage(`./mingxi`)
      }
		}
	}
</script>

<style lang="scss" scoped>
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
