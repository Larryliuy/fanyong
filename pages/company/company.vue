<template>
	<page-meta>
		<navigation-bar :title="$t('t_1')" front-color="#000000" :background-color="$colors.white"/>
	</page-meta>
	<view class="page-box">
		<text class="vip-txt" :style="`background: ${$colors.mainColor};`">{{userInfo.levelName}}</text>
		<view class="page-top flex">
			<view class="avatar-box">
				<image :src="`/static/imgs/me_${environment}.png`" mode="widthFix"></image>
			</view>
			<view class="userinfo-box2">
				<view class="userinfo2 flex">
					<text class="flex-item">{{$t('xf_2')}}：{{userInfo.tel}}</text>
				</view>
				<view class="userinfo2 flex">
					<text class="flex-item" v-if="environment !== 'mcl_pro'">ID：{{userInfo.id}}</text>
				</view>
				<view class="userinfo2 flex invite-box" @click="fuzhi">
					<text class="flex-item">{{$t('xf_4')}}：{{userInfo.invite_code}}</text>
				</view>
			</view>
		</view>
		<view class="top-list">
			<view class="list-box">
				<view class="list-item-box flex" v-for="(item,index) in moneyList" :key="index">
					<view class="list-item" v-if="index < 4">
						<text>{{item.txt}}: </text>
						<text :style="'color:'+$colors.white">{{item.val}}<text v-if="index > 0 && environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
					</view>
				</view>
			</view>
			<view class="commission-box flex">
				<view class="list-item-box flex item4" v-if="moneyList[4]">
					<view class="list-item">
						<text>{{moneyList[4].txt}}</text>
						<text :style="'color:'+$colors.white">{{moneyList[4].val}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
					</view>
				</view>
				<view class="list-item-box flex item5" v-if="moneyList[5]">
					<view class="list-item">
						<text>{{moneyList[5].txt}}</text>
						<text :style="'color:'+$colors.white">{{moneyList[5].val}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></text>
					</view>
				</view>
			</view>
			<!-- <view class="btn-box flex">
				<button class="xf-btn" v-for="(item,index) in bntList" :style="'background-color:'+item.color" :key="index" @click="onBtnList(index)">{{item.name}}</button>
			</view> -->
		</view>
		<view class="table-box">
			<view class="menu-box">
				<view class="menu-item" :style="(menuListIdx==index)?`color:${$colors.mainColor}`:''" v-for="(item,index) in menuList" :key="index" @click="onMenuList(index)"> <text> {{item}} </text> </view>
			</view>
			<view class="table" v-if="dataList.length > 1">
				<uni-row class="demo-uni-row" v-for="(item,index) in dataList" :key="index">
					<uni-col :span="4"> <view class="demo-uni-col row-center">{{item.id}}</view></uni-col>
					<uni-col :span="7"> <view class="demo-uni-col row-center">{{index === 0 ? item.tel : displayUserName(item.tel)}}</view></uni-col>
					<uni-col :span="8"> <view class="demo-uni-col row-center">{{item.commission}}<text v-if="index > 0 && environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></view></uni-col>
					<uni-col :span="5"> <view class="demo-uni-col row-center">{{item.addtime}}</view></uni-col>
				</uni-row>
			</view>
<!--			<view v-else class="no-data">{{loading ? $t('xf_loading') : $t('xf_nodata')}}</view>-->
<!--			<view class="pagination-box" v-if="page !== 1 || dataList.length > 10">-->
<!--				<text v-if="page !== 1" class="prev" @click="() => onPageChange('prev')">{{$t('xf_prev')}}</text>-->
<!--				<text v-if="dataList.length > 10" class="next" @click="() => onPageChange('next')">{{$t('xf_next')}}</text>-->
<!--			</view>-->
      <uni-load-more :status="loadState"></uni-load-more>
		</view>
		<!-- <xf-language></xf-language> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				moneyList: [],
				bntList: [{name: this.$t('v_lmmggvze'), color: this.$colors.button1},{name: this.$t('v_ffxd'), color: this.$colors.button2}],
				menuList: [this.$t('v_yijihvyr'),this.$t('v_orjihvyr')],
				menuListIdx: 0,
				page: 1, // 第几页
        limit: 10,
        loadState: 'loading',
			}
		},
		onLoad() {
			this.getDataList()
			// #ifdef H5
			let dom = document.getElementsByClassName('uni-btn-icon')[1]
			if(dom) {
				dom.innerText = this.$t('xf_introduce')
				dom.style.overflow = 'visible'
				dom.style.color = this.$colors.mainColor
				// dom.style.background = this.$colors.mainColor
				// dom.style.padding = '3px'
			}
			// #endif
			// #ifdef APP-PLUS
			const webView = this.$scope.$getAppWebview()
			webView.setTitleNViewButtonStyle(0,{
				text: this.$t('xf_introduce'),
				color: this.$colors.mainColor,
				// background: this.$colors.mainColor
			})
			// #endif
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
		onNavigationBarButtonTap(e) {
		    // uni.navigateTo({
		    //     url: `/pages/company/introduce`
		    // })
			this.onJumpPage('./introduce')
		},
		methods: {
			// 菜单
			onBtnList(idx){
				if(!idx){
					this.onJumpPage('./introduce')
				}else{
					this.onJumpPage(`/pages/mine/expandLink`)
				}
			},
			onMenuList(e){
				this.menuListIdx =e
        this.dataList = []
        this.page = 1
        this.loadState ='loading'
				this.getDataList()
			},
			displayUserName(el) {
				let val = ''
				if (el) {
					if (el.length > 7) {
						val = el.slice(0, 3) + '***' + el.slice(el.length - 4)
					} else {
						val = el
					}
				}
				return val
			},
			getDataList(){
				this.$store.commit('saveUserInfo')
				// this.loading = true
				this.$http.get('get_user',{type: this.menuListIdx+1, page: this.page, limit: this.limit}).then(res => {
					// this.loading = false
          // if(this.page ===1) this.dataList = [] //如果是第一页需手动置空列表
					if (res && res.data && res.data.code === 200) {
						console.log(res.data, 'res.data')
						this.moneyList =[
							{txt: this.$t('v_trdvrfuu'),val:res.data.other.xiaji},
							// {txt: this.$t('v_trdvyyoe'),val:res.data.other.balance},
							// {txt: this.$t('v_trdvisvi'),val:res.data.other.chongzhi},
							// {txt: this.$t('v_trdvtixm'),val:res.data.other.tixian},
							{txt: this.$t('v_jnritrdvysjn'),val:res.data.other.dayCommission},
							{txt: this.$t('v_lzjitedvysjn'),val:res.data.other.totalCommission},
							{txt: this.$t('v_lzjitedvysts'),val:res.data.other.tixian},
							{txt: this.$t('v_lzjitedvystw'),val:res.data.other.shouru_day},
							{txt: this.$t('v_lzjitedvystz'),val:res.data.other.shouru}
						]
						let tmp = []
						if (res.data.data && res.data.data.length > 0) {
							for (let i = 0; i < res.data.data.length; i++) {
								// if(res.data.data[i].commission > 0) {
									tmp.push(res.data.data[i])
								// }
							}
						}
            uni.stopPullDownRefresh()
            if(tmp.length<this.limit){
              this.loadState ='noMore'
            }
            if(this.page ===1) {
              tmp.unshift({id:'ID',tel:this.$t('xf_2'),commission:this.$t('v_tzyyoe'),addtime:this.$t('v_vuceuijm')})
            }
            this.dataList = this.dataList.concat(tmp); //追加新数据
            console.log(this.dataList, 'this.dataList')
					} else {
            this.loadState ='noMore'
          }
				});
			},
			onPageChange(type) {
				this.dataList = []
				if (type === 'next') {
					this.page += 1
				} else {
					if(this.page > 1) {
						this.page -= 1
					}
				}
				this.getDataList()
			},
      fuzhi:function() {
        // #ifdef H5
        this.$copyText(this.userInfo.invite_code).then(
            res => {
              this.openShowToast(this.$t('xf_fzcg'))
            },
            err => {
              this.openShowToast(this.$t('xf_fzsb'))
            }
        );
        // #endif
        // #ifdef APP-PLUS
        uni.setClipboardData({
          data: this.userInfo.invite_code,
          success: () => {
            this.openShowToast(this.$t('xf_fzcg'))
          },
          fail: () => {
            this.openShowToast(this.$t('xf_fzsb'))
          }
        });
        // #endif
      },
		}
	}
</script>

<style lang="less">
	.page-box{
		padding: 10px 0px;
		// background-color: #FFFFFF;
		// margin-bottom: 10px;
		.vip-txt{
			position: absolute;
			right: 0px;
			top: 10px;
			color: #ffffff;
			// padding: 2px 10px;
			// border-radius: 40px;
			background-image: linear-gradient(to right,#FFAE3E,#FE681E);
			width: 4.8rem;
			height: 2.0rem;
			line-height: 2.0rem;
			border-top-left-radius: 32px;
			border-bottom-left-radius: 32px;
		}
	}
	.page-top{
		width: 100%;
		padding: 10px;
		color: #000;
		background-color: #FFFFFF;
		justify-content: flex-start;
		border-bottom-left-radius: 20px;
		border-bottom-right-radius: 20px;
		margin-bottom: 10px;
		.avatar-box {
			width: 80px;
			height: 80px;
			image {
				width: 80px;
				height: 80px;
			}
		}
		.userinfo-box2{
			position: relative;
			margin-left: 10px;
			.userinfo2{
				align-items: center;
				margin-bottom: 10px;
				text{
					font-size: 14px;
				}
			}
			.invite-box {
				border: 1px solid #43d17b;
				color: #43d17b;
				font-weight: 400;
				padding: 5px 10px;
				border-radius: 12px;
			}
		}
	}
	.top-list{
		border-radius: 6px;
		// background-color: #FFFFFF;
		.list-box{
			display: flex;
			// flex-wrap: wrap;
			flex-direction: column;
			background-image: url(../../static/imgs/co_bg1.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			justify-content: center;
			height: 120px;
			margin: 10px;
			.list-item-box{
				// width: 33%;
				padding: 3px 10px;
				box-sizing: border-box;
				.list-item{
					display: flex;
					// flex-direction: column;
					align-items: center;
					justify-content: flex-start;
					text{
						font-size: 12px;
						color: #FFFFFF;
						text-align: center;
						margin-right: 5px;
					}
				}
			}
		}
		.commission-box {
			// justify-content: center;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			justify-content: space-around;
			align-items: center;
			margin-top: 12px;
			.list-item-box{
				// width: 33%;
				padding: 3px 10px;
				box-sizing: border-box;
				width: 45%;
				height: 70px;
				align-items: center;
				background-repeat: no-repeat;
				background-size: 100% 100%;
				.list-item{
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: flex-start;
					text{
						font-size: 14px;
						color: #FFFFFF;
						text-align: center;
						margin-right: 5px;
						padding: 3px 0px;
					}
				}
			}
			.item4 {
				background-image: url(../../static/imgs/co_bg2.png);
			}
			.item5 {
				background-image: url(../../static/imgs/co_bg3.png);
			}
		}
		.btn-box{
			justify-content: space-between;
			padding: 15px 10px;
			.xf-btn{
				border-radius: 45px;
				// &:first-child{
				// 	background-color: #F14424;
				// }
			}
		}
	}
	.table-box{
		border-radius: 10px;
		background-color: #FFFFFF;
		overflow: hidden;
		.menu-box{
			display: flex;
			justify-content: space-around;
			align-items: center;
			border-bottom: 1px solid #C0C0C0;
			.menu-item{
				border-left: none;
			}
		}
		.table{
			//min-height: 200px;
			.demo-uni-col {
				height: 35px;
				font-size: 14px;
				border-left: 1px solid #C0C0C0;
				border-bottom: 1px solid #C0C0C0;
				text-align: center;
				word-break: break-word;
			}
		}
		.no-data {
			text-align: center;
			padding-bottom: 10px;
		}
		.pagination-box {
			text-align: center;
			margin: 10rpx 0rpx;
			.next {
				margin-left: 10px;
			}
		}
	}
</style>
