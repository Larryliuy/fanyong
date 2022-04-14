<template>
	<page-meta>
		<navigation-bar :title="$t('xf_21')" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box">
		<view class="withdraw-way">
			<h4>{{$t('v_tixmfhui')}}</h4>
			<radio-group @change="ondataList">
				<label class="way-box row-center" v-for="(it,idx) in dataList" :key="idx" @click="radioClick(it)">
					<view class="title">{{it.name}}<text class="tj">{{it.is_recommend === 1?`(${$t('v_tvjm')})`:''}}</text></view>
					<radio :value="it.type_id.toString()" :checked="idx==dataListIdx" :color="$colors.button2"/>
				</label>
			</radio-group>
			<lb-picker ref="picker" mode="selector" :list="walletInfo.bankInfo" :props="{label:'cardnum',value:'cardnum'}"
				:cancelText="$t('xf_cancle')" :confirmText="$t('xf_sure')" :emptyText="$t('xf_nodata')" @confirm="onbankList"></lb-picker>
			<lb-picker ref="picker1" mode="selector" :list="walletInfo.qbInfo" :props="{label:'number',value:'number'}"
				:cancelText="$t('xf_cancle')" :confirmText="$t('xf_sure')" :emptyText="$t('xf_nodata')" @confirm="onUsdtList"></lb-picker>
			<view class="way-box row-center">
				<input v-model="money" class="title" type="number" :placeholder="`${$t('v_keysjnoe')} ${$t('xf_rmb')}${userInfo.balance}`"/>
			</view>
		</view>
		<view class="withdraw-desc-box" v-if="selectedInfo.desc">
			<view>{{$t('xf_txsm')}}:</view>
<!--			<text v-for="(item,index) in dataList" :key="index" style="display: block;color: red;">{{item.desc}}</text>-->
      <mp-html :content="selectedInfo.desc" style="display: block;color: red;"/>
		</view>
		<view class="btn-box">
			<button class="xf-btn" :style="'background-color:'+$colors.button2" @click="onsubmit">{{$t('v_lijitixm')}}</button>
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
				dataListIdx: 0,
				selbankId: 0,
				selUsdtId: 0,
				wdType: 1, // 1 银行卡, 2 USDT, 3 微信, 4 支付宝
				selectedInfo: {},
				money: '',
			}
		},
		onLoad(opt) {
			this.getDataList()
			if (this.walletInfo && this.walletInfo.qbInfo && this.walletInfo.qbInfo[0]) {
				this.selUsdtId = this.walletInfo.qbInfo[0].id
			}
		},
		computed:{
			...mapState(['bankInfo','aliInfo','walletInfo'])
		},
		methods: {
			onsubmit(){
			  debugger
				console.log(this.selectedInfo, 'this.selectedInfo')
				if (this.dataListIdx < 0) {
					return this.openShowToast(this.$t('v_xztxfs'))
				}
				if(!this.money){
					return this.openShowToast(this.$t('v_uurujnoe'))
				}else if(this.money>Number(this.userInfo.balance)){
					return this.openShowToast(this.$t('v_yuoebuzu'))
				}else if(this.wdType==1 && !this.selbankId){
					return this.openShowToast(this.$t('v_djxzyhk'))
				}else if(this.wdType==2 && !this.selUsdtId){
					return this.openShowToast(this.$t('v_djxzyhk1'))
				}else if(this.wdType==6 && this.money < 500){ // email方式
					return this.openShowToast(this.$t('v_less500'))
				}
				console.log(this.wdType, this.environment, this.walletInfo, 'onsubmit')
				if(
					(this.wdType==1 && (!this.walletInfo.bankInfo || !this.walletInfo.bankInfo.length===0)) ||
				    (this.wdType==4 && !this.walletInfo.aliName.number) ||
					(this.wdType==3 && !this.walletInfo.wxInfo.qrcode) ||
					(this.wdType==2 && !this.walletInfo.qbInfo) ||
					(this.wdType==8 && !this.walletInfo.clabe.number)
				 ){
					this.openShowToast(this.$t('v_bhdxnxi'))
					this.delayPerform(()=>{
						uni.redirectTo({
							url:`/pages/mine/wallet/wallet`
						})
					})
					return false
				}
				this.$http.post('do_deposit',{
					num: this.money,
					// 这儿就是 俩个等号
					bkid: this.wdType == 1 ? this.selbankId : this.wdType == 2 ? this.selUsdtId : '',
					type: this.selectedInfo.id,
				}).then(res => {
					this.openShowToast(res.data.info)
					if (res && res.data && res.data.code === 200) {
						this.delayPerform(()=>{
							this.onJumpPage(`/pages/mine/deal?idx=4`)
						})
					}
				});
			},
			onbankList(e){
				if (e && e.item) {
					this.selbankId = e.item.id
				}
			},
			onUsdtList(e){
				if (e && e.item) {
					this.selUsdtId = e.item.id
				}
			},
			ondataList(e){
				this.wdType =e.detail.value
				if(e.detail.value===1){
					this.$refs.picker.show()
				}
				if(e.detail.value===2){
					this.$refs.picker1.show()
				}
			},
			getDataList(){
				this.dataList =[]
				this.$http.get('deposit_type_list').then(res => {
					if (res && res.data && res.data.code === 200) {
						this.dataList = res.data.data.list
						this.wdType =this.dataList[0] ? this.dataList[0].type_id : 0
						this.selectedInfo = this.dataList[0] ? this.dataList[0] : {}
						if (this.selectedInfo.desc) {
						  this.selectedInfo.desc = this.selectedInfo.desc.replace(/\r\n|\r|\n/g, '<br/>')
						}
					}
				});
			},
			radioClick(it) {
				this.selectedInfo = it
				// 银行卡
				if(it.type_id===1){
					if (this.walletInfo.bankInfo && this.walletInfo.bankInfo.length > 0) {
						this.$refs.picker.show()
					} else {
					    console.log('xxxxx')
					    this.openShowToast(this.$t('xf_37'))
					}
				}
				// USDT
				if(it.type_id===2){
					console.log(this.walletInfo.qbInfo)
					if (this.walletInfo.qbInfo && this.walletInfo.qbInfo.length > 0) {
						this.$refs.picker1.show()
					} else {
					    console.log('xxxxx')
					    this.openShowToast(this.$t('v_bhdxnxi'))
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	.page-box{
		padding: 10px 0 65px;
	}
	.withdraw-way{
		margin: 0 10px;
		padding: 10px 15px;
		border-radius: 10px;
		background-color: #FFFFFF;
		.way-box{
			height: 50px;
			border-bottom: 1px solid #f7f7f7;
			.title{
				flex: 1;
				margin-left: 5px;
				.tj {
					color: #ff0000;
				}
			}
		}
	}
	.btn-box{
		width: 100%;
		padding-bottom: 10px;
		position: fixed;
		bottom: 0;
		z-index: 1;
		background-color: #f6f6ff;
		.xf-btn{
			width: calc(100% - 20px);
			height: 50px;
			font-size: 16px;
			margin: 0 auto;
			border-radius: 40px;
		}
	}
	.withdraw-desc-box {
		padding: 8px 15px;
	}
</style>
