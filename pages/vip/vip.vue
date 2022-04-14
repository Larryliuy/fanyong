<template>
	<page-meta>
		<navigation-bar :title="$t('xf_1')" background-color="#FFFFFF" front-color="#000000"/>
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
				<view class="userinfo2 flex invite-box">
					<text class="flex-item">{{$t('xf_4')}}：{{userInfo.invite_code}}</text>
				</view>
			</view>
		</view>
		<!-- <view class="userinfo-box flex">
			<view class="userinfo flex">
				<text>{{$t('xf_2')}}：{{userInfo.tel}}</text>
				<text class="txt">{{$t('xf_4')}}：{{userInfo.invite_code}}</text>
			</view>
			<view class="vip-img-box">
				<image :src="userInfo.pic" mode="widthFix"></image>
				<view class="vip-txt">{{userInfo.levelName}}</view>
			</view>
		</view> -->
		<view class="btn-box flex" v-if="(environment !== 'ny_pro' && environment !== 'dev') || ((environment === 'ny_pro' || environment === 'dev') && leveluptypeinfo.leveluptype === '0')">
			<button :style="(bntList.length === 2 ? '' : 'flex: 1;') + 'background-image: ' + $colors.btnBg + ';color: #ffffff'" class="xf-btn flex" v-for="(item,index) in bntList" :key="index" @click="onBtnList(index)">
				<view>{{item}}</view>
				<view><uni-icons type="arrowright" :color="$colors.arrow"></uni-icons></view>
			</button>
		</view>
		<view :class="'list-box ' + (environment==='ko_pro'?'table':'')">
			<uni-row class="uni-row" :class="{'title':!index}" v-for="(item,index) in dataList" :key="index">
        <uni-col :span="5"> <view :class="`demo-uni-col row-center ${environment==='ko_pro'?'table-col':''}`"><text>{{item.name}}</text></view></uni-col>
        <uni-col :span="6"> <view :class="`demo-uni-col row-center ${environment==='ko_pro'?'table-col':''}`"><text>{{item.day}}</text></view></uni-col>
        <uni-col :span="6"> <view :class="`demo-uni-col row-center ${environment==='ko_pro'?'table-col':''}`"><text>{{item.week}}</text></view></uni-col>
        <uni-col :span="7"> <view :class="`demo-uni-col row-center ${environment==='ko_pro'?'table-col':''}`"><text>{{item.month}}</text></view></uni-col>
			</uni-row>
		</view>
		<view class="list-box2">
			<view class="menu-box">
				<scroll-view scroll-x :scroll-with-animation="true" class="scroll-view">
					<view class="menu-item" :style="(vipListIdx===index)?`color:${$colors.mainColor};;`:''" v-for="(item,index) in vipList" :key="index" @click="onMenuList(index)">
						<text> {{item.name}} </text>
					</view>
          <view class="line" :style="`transform: translateX(${translateX}px) translateX(-50%);background-color:${$colors.mainColor}`"></view>
				</scroll-view>
			</view>
			<view class="vip-intro">
				<text v-show="vipListIdx==index" v-for="(item,index) in vipList" :key="index">{{item.vip_info}}</text>
			</view>
		</view>
		<!-- <xf-language></xf-language> -->
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				dataList: [],
				// bntList: [],
				vipListIdx: 0,
				myvipList: [],
				translateX: 25,
				leveluptypeinfo: {},
			}
		},
		onReady() {
			// this.delayPerform(()=>{
			// 	this.setVipList()
			// })
			this.getDataList()
		},
		watch:{
			vipList: function() {
				this.setDataList(this.myvipList)
			}
		},
		computed:{
			...mapState(['vipList']),
			bntList: function() {
				// if (!this.userInfo.level) {
				// 	return [this.$t('xf_5'), this.$t('xf_6')]
				// }
				return [this.$t('xf_6')]
			}
		},
		methods: {
			// 菜单
			onBtnList(idx){
				if(!idx){
					if (this.userInfo.operation_is_allowed == 0) {
						this.openShowToast(this.$t('xf_520'))
						return
					}
					this.onJumpPage('./level')
				}else{
					this.$http.get('cancelVip').then(res => {
						this.openShowToast(res.data.info)
						if (res && res.data && res.data.code == 200) {
							this.$store.commit('saveUserInfo')
							this.delayPerform(()=>{
								this.onJumpPage(`./vip`)
							})
						}
					});
				}
			},
			onMenuList(e){
        this.translateX = 25 + 50*e
				this.vipListIdx =e
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
				this.$http.get('my_vip').then(res => {
					if (res && res.data && res.data.code == 200) {
						this.myvipList = res.data.data
						this.setDataList(res.data.data)
					}
				});
				this.$http.post('platform_config').then(res => {
					if (res && res.data && res.data.code == 200) {
						this.leveluptypeinfo = res.data.data
					}
				});
			},
			setDataList(data) {
				this.dataList = []
				this.vipList.forEach((item,index) => {
					let obj = data[index] || {}
					this.dataList.push({...item, ...obj})
				})
				const vipTxt = this.environment === 'ko_pro' ? this.$t('xf_36'): ''
				this.dataList.unshift({name:vipTxt,day:this.$t('xf_13'),week:this.$t('xf_14'),month:this.$t('xf_15')})
			},
			// setVipList() {
			// 	this.vipList.forEach((it,index)=>{
			// 		let txt = ''
			// 		if (it.level === 0) {
			// 			txt = `${this.$t('xf_35')}${this.$t('xf_7')}${it.bili}%,${this.$t('xf_8')}${it.num} ${this.language === 'ca' ? $t('xf_rmbca') : $t('xf_rmb')}`
			// 		} else {
			// 			txt = `VIP${index}${this.$t('xf_7')}${it.bili}%,${this.$t('xf_8')}${it.num} ${this.language === 'ca' ? $t('xf_rmbca') : $t('xf_rmb')}.${this.$t('xf_9')}${it.hour}${this.$t('xf_10')}(${it.day}${this.$t('xf_11')}*${it.bili/100}*${it.day} day= ${100*it.bili/100*it.day} ${this.language === 'ca' ? $t('xf_rmbca') : $t('xf_rmb')}.${this.$t('xf_12')}`
			// 		}
			// 		this.$set(it,'intro',txt)
			// 	});
			// }
		}
	}
</script>

<style lang="less">
	.page-box{
		padding: 10px 0;
		// background-color: #FFFFFF;
		.vip-txt{
			position: absolute;
			right: 0px;
			top: 10px;
			color: #ffffff;
			// padding: 2px 10px;
			// border-radius: 40px;
			// background-image: linear-gradient(to right,#FFAE3E,#FE681E);
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
	.userinfo-box{
		padding: 15px;
		border-radius: 10px;
		background-color: #fff;
	}
	.btn-box{
		justify-content: space-between;
		margin: 10px;
		text {
			display: inline-block;
		}
		.xf-btn {
			line-height: 14px;
			border-top-right-radius: 15px;
			border-top-left-radius: 15px;
			border-bottom-right-radius: 0px;
			border-bottom-left-radius: 0px;
			color: #000000;
			justify-content: space-between;
			padding: 0 10px;
		}
	}
	.list-box{
		margin: 10px;
		border-radius: 10px;
		background-color: #FFFFFF;
		text-align: center;
		.uni-row {
			// margin-bottom: 10px;
			/* #ifdef MP-TOUTIAO || MP-QQ || MP-BAIDU */
			display: block;
			/* #endif */
		}
		/* #ifdef MP-ALIPAY || MP-WEIXIN */
		::v-deep .uni-row {
			// margin-bottom: 10px;
		}
		/* #endif */
		.demo-uni-col {
			height: 35px;
			font-size: 14px !important;
			border-radius: 3px;
			overflow: hidden;
			vertical-align: middle;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			//word-break: break-all;
			//word-wrap: break-word;
		}
		.title{
			background-color: #f4f4f4;
			.demo-uni-col{
				font-size: 16px;
				height: 40px;
				// display: flex;
				// justify-content: center;
				// align-items: center;
			}
		}
	}
  .table {
    border-top: 1px solid #C0C0C0;border-right: 1px solid #C0C0C0;border-radius: unset;
    .table-col {
      display: flex;
      border-radius: unset;
      -webkit-box-orient: vertical;
      font-size: 14px;
      border-left: 1px solid #C0C0C0;
      border-bottom: 1px solid #C0C0C0;
      text-align: center;
    }
  }
	.list-box2{
		margin: 10px;
		border-radius: 10px;
		background-color: #FFFFFF;
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
		.vip-intro{
			padding: 15px;
		}
	}
  .uni-scroll-view {
    height: 40px;
  }
</style>
