<template>
	<page-meta>
		<navigation-bar :title="$t('xf_20')" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box">
		<view class="balance-box row-center">{{danwei()}}：{{userInfo.balance}}</view>
		<view class="parities-box column-center">
			<text v-if="environment !== 'sw_pro'" :style="'color:'+$colors.button2"> {{$t('v_hvlijisr')}} 1 USDT = {{danwei()}}{{$utils.toThousands(userInfo.usdt)}}</text>
			<text> {{$t('xf_20')}}</text>
			<text>{{danwei()}}{{$utils.toThousands(moneyM)}} = <text class="money-u">{{$utils.toThousands(moneyU)}}</text>USDT</text>
		</view>
		<view class="input-box">
			<text class="small-title"> {{$t('v_igviynoe')}}</text>
			<view class="ipt-box flex" :style="'color:'+$colors.mainColor+';border-color:'+$colors.button2">
				{{danwei()}}
				<input v-model="moneyM" type="number" @input="onChange"/>
					<!-- <view class="money-handle">{{$utils.toThousands(moneyM)}} -->
				</view>
			<text> {{$t('v_isvizvxc')}}{{danwei()}}{{$utils.toThousands(userInfo.min_recharge)}}, {{$t('v_zvda')}} {{danwei()}}{{$utils.toThousands(userInfo.max_recharge)}}</text>
		</view>
		<view class="small-title small-title2">{{$t('v_tvjm')}}</view>
		<view class="money-btn flex">
			<!-- <view :class="'xf-btn '+ (moneyM===item?'active-btn':'')" hover-class="btn-hover" v-for="(item,index) in moneyList" :key="index" @click="moneyM =item">{{item}}</view>-->
			<view class="xf-btn" :style="'color:'+$colors.mainColor+';border-color:'+$colors.button2+(moneyM === item.amount?`;color:${$colors.white};background-color:${$colors.mainColor}`:'')" hover-class="btn-hover" v-for="(item,index) in moneyList" :key="index" @click="moneyM =item.amount">
        {{$utils.toThousands(item.amount)}}
      </view>
		</view>
    <view v-if="environment === 'ko_pro' && moneyList.length>0" class="wenan">
      <view v-if="language === 'ko'">
        <view>충전 시 주의 사항(USDT 입금 권장)：</view>
        <view>①USDT 충전은 trc20 결제만 가능하며, 다른 결제 수단은 사용하지 마세요.(국제 환율 참고)</view>
        <view>②최소입금액은 {{minAmount}}$이며, 최대입금액은 {{maxAmount}}$입니다.</view>
        <view>③결제 과정에서 문제가 발생하면 가능한 빨리 저희에게 연락하십시오.</view>
      </view>
      <view v-else>
        <view>Recharge Note(Recommended deposit in usdt):</view>
        <view>① The minimum deposit is 30usdt and the maximum deposit is 50000usdt.</view>
        <view>② Usdt recharge only supports trc20 payment method, please do not use other payment methods. (refer to international exchange rate)</view>
        <view>③ If you encounter any problems in the process of payment, please contact us as soon as possible.</view>
      </view>
    </view>
		<view class="recharge-btn">
			<button class="xf-btn" :style="'background-color:'+$colors.button2" @click="onrecharge">{{$t('xf_20')}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				moneyM: 0,
				moneyList: [],
				minAmount: '0',
				maxAmount: '0',
			}
		},
		onLoad() {
      // moneyM 默认值为空
      if (this.environment === 'ja_pro') {
        this.moneyM = ''
      }
			this.$http.get('recharge_amount').then((res,err) => {
				console.log(res,err, 'res.data')
				if (res && res.data && res.data.code === 200) {
					this.moneyList = res.data.data.list
					this.minAmount = this.$utils.toThousands(this.moneyList[0].amount)
					this.maxAmount = this.$utils.toThousands(this.moneyList[this.moneyList.length - 1].amount)
				}
			});
		},
		computed: {
			moneyU(){
				return Math.floor((this.moneyM/this.userInfo.usdt) * 100) / 100
			}
		},
		methods: {
			onrecharge(){
				if(!this.moneyM){
					return this.openShowToast(this.$t('v_uurujnoe'))
				}
				this.onJumpPage(`./rechargeSuc?money=${this.moneyM}`)
			},
		  danwei() {
				  if (this.environment === 'sw_pro') {
					return this.$t('xf_usdt')
			} else if (this.environment === 'mcl_pro'){
			  return '$'
			} else {
				return this.$t('xf_rmb')
			}
		  },
		  onChange(e) {
			  // this.moneyM = e.detai.value
		  }
		}
	}
</script>


<style lang="scss" scoped>
.uni-page-head{
  .uni-page-head__title {
    .uni-btn-icon {
      color: #ffffff !important;
    }
  }
}
</style>
<style lang="scss">
	page{
		background-color: #FFFFFF;
	}
	.balance-box{
		width: 100%;
		height: 50px;
		font-weight: bold;
		color: #F8AA00;
		background-color: #FEF7E5;
	}
	.parities-box{
		font-size: 14px;
		text{
			margin-top: 8px;
			color: #537277;
			&:first-child{
				color: $themeColor2;
			}
			&:last-child{
				font-size: 18px;
				color: #F8AA00;
			}
			.money-u{
				color: #333333;
			}
		}
	}
	.input-box{
		font-size: 14px;
		padding: 30px 15px 0;
		.ipt-box{
			position: relative;
			color: $themeColor;
			// color: rgba($color: #FFFFFF, $alpha: 0);
			padding: 10px 15px;
			margin: 8px 0;
			border-radius: 44px;
			border: 1px solid $themeColor2;
			input{
				flex: 1;
				font-weight: bold;
				text-align: right;
				padding: 0 5px;
				margin-left: 5px;
				background-color: #E7EFFC;
				// color: rgba($color: #FFFFFF, $alpha: 0);
			}
			.money-handle {
				position: absolute;
				right: 38rpx;
				top: 25rpx;
				font-weight: 700;
			}
		}
		text:last-child{
			color: #8F9396;
		}
	}
	.small-title{
		font-size: 14px;
		font-weight: bold;
		color: #447481;
	}
	.small-title2{
		margin: 15px 0 0 15px;
	}
	.money-btn{
		flex-wrap: wrap;
		padding: 0 10px;
		.xf-btn{
			width: 214rpx;
			font-weight: bold;
			color: $themeColor;
			margin: 10px 5px 0;
			border-radius: 45px;
			background-color: #FFFFFF;
			border: 1px solid $themeColor;
		}
		.active-btn {
			background-color: $themeColor;
			color: #FFFFFF;
		}
	}
  .wenan {
    font-size: 12px;padding: 5px 15px;color: #E92B2B
  }
	.recharge-btn{
		padding: 40px 15px;
		.xf-btn{
			width: 100%;
			height: 50px;
			font-size: 16px;
			border-radius: 45px;
		}
	}
</style>
