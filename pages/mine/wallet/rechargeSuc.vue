<template>
	<page-meta>
		<navigation-bar :title="$t('xf_pay')" front-color="#fff" background-color="#B30101"/>
	</page-meta>
	<view class="page-box">
		<view class="parities-box column-center">
			<text>{{$t('v_igviynoe')}}</text>
			<text>{{environment === 'mcl_pro' ? '$' : $t('xf_rmb')}}{{moneyM}} = {{moneyU}} USDT</text>
		</view>
		<view v-if="environment !== 'ko_pro' && environment !== 'me_pro' && environment !== 'pa_pro'" class="tips">
			{{$t('v_tips')}}
		</view>
    <!-- 线上支付 -->
    <view v-if="channel_sort === 0 && onwayOnlineList.length>0" class="recharge-way">
      <view class="way-title"><text class="txt" v-if="environment !== 'ca_pro'">{{$t('v_zffs')}}：</text></view>
      <radio-group @change="onwayOnlineList">
        <block v-for="(it,idx) in wayListOnline" :key="idx">
          <label class="way-box row-center">
            <view class="title">{{it.myTitle}}<text class="tj">{{it.is_recommend===1?`(${$t('v_tvjm')})`:''}}</text></view>
            <radio :value="idx+''" :checked="idx==wayListOnlineIdx" color="#E92B2B"/>
          </label>
        </block>
      </radio-group>
    </view>
		<!-- 线下支付 -->
    <view v-if="wayListOffline.length>0">
      <view class="recharge-way">
        <view class="way-title"><text class="txt">{{$t('v_xianxiazf')}}：</text></view>
        <radio-group @change="onwayOfflineList">
          <block v-for="(it,idx) in wayListOffline" :key="idx">
            <label class="way-box row-center">
              <view class="title">{{it.myTitle}}<text class="tj">{{it.is_recommend===1?`(${$t('v_tvjm')})`:''}}</text></view>
              <radio :value="idx+''" :checked="idx==wayListOfflineIdx" color="#E92B2B"/>
            </label>
            <!-- 线下微信 -->
            <view v-if="it.xx_type===1 &&wayListOfflineIdx==idx" class="way-box way2-box">
              <view>
                <text class="title">{{it.sk_name_wx}}</text>
              </view>
              <view>
                <image :src="it.qrcode_wx" mode="scaleToFill" style="width: 400rpx;height: 400rpx;"></image>
              </view>
              <view>
                <input v-model="bankName" type="text" :placeholder="$t('v_fukwxzh')" style="padding-left: 5px;"/>
              </view>
            </view>
            <!-- 线下支付宝 -->
            <view v-else-if="it.xx_type===2 &&wayListOfflineIdx==idx" class="way-box way2-box">
              <view>
                <text class="title">{{it.sk_name_zfb}}</text>
              </view>
              <view>
                <text class="title">{{it.sk_number}}</text>
              </view>
              <view>
                <image :src="it.qrcode_zfb" mode="scaleToFill" style="width: 400rpx;height: 400rpx;"></image>
              </view>
              <view>
                <input v-model="bankName" type="text" :placeholder="$t('v_fukzfbzh')" style="padding-left: 5px;"/>
              </view>
            </view>
            <!-- 线下银行卡 -->
            <template v-else-if="it.xx_type===3 &&wayListOfflineIdx==idx">
              <view class="way-box way2-box row-center">
                <text class="title">{{it.sk_name_yhk}}</text>
                <text @click="copy(it.sk_name_yhk)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center">
                <text class="title">{{it.bank_name}}</text>
              </view>
              <view v-if="environment==='ja_pro'" class="way-box way2-box row-center">
                <text class="title">{{it.bank_zhidianming}}</text>
              </view>
              <view class="way-box way2-box row-center">
                <text class="title">{{it.bank_number}}</text>
                <text @click="copy(it.bank_number)">{{$t('v_fuvi')}}</text>
              </view>
              <!-- 巴西版本字段 -->
              <view class="way-box way2-box row-center" v-if="environment === 'pt_pro' || environment === 'ca_pro'">
                <text class="title">{{it.bank_email}}</text>
                <text @click="copy(it.bank_email)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center" v-if="environment === 'pt_pro'">
                <text class="title">{{it.bank_identity_no}}</text>
                <text @click="copy(it.bank_identity_no)">{{$t('v_fuvi')}}</text>
              </view>
              <!-- 加拿大展示的字段 -->
              <view class="way-box way2-box row-center" v-if="environment === 'ca_pro'">
                <text class="title">{{it.bank_Institution_code}}</text>
                <text @click="copy(it.bank_Institution_code)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center" v-if="environment === 'ca_pro'">
                <text class="title">{{it.bank_address}}</text>
                <text @click="copy(it.bank_address)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center" v-if="environment === 'ca_pro'">
                <text class="title">{{it.bank_company_address}}</text>
                <text @click="copy(it.bank_company_address)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center" v-if="environment === 'ca_pro'">
                <text class="title">{{it.bank_pay_type}}</text>
                <text @click="copy(it.bank_pay_type)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center" v-if="environment === 'ca_pro'">
                <text class="title">{{it.bank_swift_code}}</text>
                <text @click="copy(it.bank_swift_code)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center" v-if="environment === 'ca_pro'">
                <text class="title">{{it.bank_tranist}}</text>
                <text @click="copy(it.bank_tranist)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center" v-if="environment === 'ca_pro'">
                <text class="title">{{it.bank_transit_code}}</text>
                <text @click="copy(it.bank_transit_code)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box row-center" v-if="environment === 'ca_pro'">
                <text class="title">{{it.bank_type === 1 ? $t('v_chuxu') : $t('v_zhipiao')}}</text>
                <!-- <text @click="copy(it.bank_type)">{{$t('v_fuvi')}}</text> -->
              </view>
              <!-- <view class="way-box way2-box row-center">
                <text class="title">{{it.bank_address}}</text>
                <text @click="copy(it.bank_address)">{{$t('v_fuvi')}}</text>
              </view> -->
              <view class="way-box way2-box">
                <input v-model="bankName" type="text" :placeholder="$t('v_fukrynhh')" style="padding-left: 5px;"/>
              </view>
            </template>
            <!-- 线下usdt -->
            <view v-else-if="it.xx_type===4 &&wayListOfflineIdx==idx" class="way-box way2-box ">
              <view>
                <!-- <text class="title">{{$t('v_liandz')}}: </text> -->
                <text class="title"><text style="color: #000000;">{{ (environment === 'ko_pro' && language === 'en') ? $t('xf_45ko') : $t('xf_45')}}</text>{{it.usdt_address}}</text>
                <text @click="copy(it.usdt_address)">{{$t('v_fuvi')}}</text>
              </view>
              <view>
                <!-- <text class="title">{{$t('v_lianlx')}}: </text> -->
                <text class="title">{{it.usdt_type}}</text>
              </view>
              <view class="input-txt">
                {{$t('xf_46')}} <input v-model="bankName" type="text" :placeholder="$t('v_fukliandz')" class="input"/>
              </view>
            </view>
            <view v-else-if="it.xx_type=== 5 && environment === 'ca_pro' && wayListOfflineIdx==idx" class="way-box way2-box ">
              <view>
                <text class="title">{{it.sk_addres_email}}</text>
                <text @click="copy(it.sk_addres_email)">{{$t('v_fuvi')}}</text>
              </view>
              <view>
                <text class="title">{{it.sk_name_email}}</text>
              </view>
              <view>
                <input v-model="bankName" type="text" :placeholder="$t('v_fukmailzh')" style="padding-left: 5px;"/>
              </view>
            </view>
            <view v-else-if="it.xx_type=== 6 && environment === 'de_pro' && wayListOfflineIdx==idx" class="way-box way2-box ">
              <view>
                <text class="title">{{it.bb_name}}</text>
                <text @click="copy(it.bb_name)">{{$t('v_fuvi')}}</text>
              </view>
              <view>
                <text class="title">{{it.bb_email}}</text>
                <text @click="copy(it.bb_email)">{{$t('v_fuvi')}}</text>
              </view>
              <view class="way-box way2-box" style="margin-left: 0px;">
                <input v-model="bankName" type="text" :placeholder="$t('v_fukrynhh')"/>
              </view>
            </view>
          </block>
        </radio-group>
      </view>
      <view v-if="wayListOffline[wayListOfflineIdx] && wayListOffline[wayListOfflineIdx].is_pic === 1" class="transfer-img row-center" @click="uploadImg">
        <image v-if="transferImg" :src="transferImg.srcUrl" mode="aspectFit"></image>
        <text v-else>{{$t('v_dmjiuhir')}}</text>
      </view>
    </view>
		<!-- 线上支付 -->
		<view v-if="channel_sort === 1 && onwayOnlineList.length>0" class="recharge-way">
			<view class="way-title"><text class="txt" v-if="environment !== 'ca_pro'">{{$t('v_zffs')}}：</text></view>
			<radio-group @change="onwayOnlineList">
				<block v-for="(it,idx) in wayListOnline" :key="idx">
					<label class="way-box row-center">
						<view class="title">{{it.myTitle}}<text class="tj">{{it.is_recommend===1?`(${$t('v_tvjm')})`:''}}</text></view>
						<radio :value="idx+''" :checked="idx==wayListOnlineIdx" color="#E92B2B"/>
					</label>
				</block>
			</radio-group>
		</view>
		<!-- <radio-group v-if="wayList[wayListIdx] && wayList[wayListIdx].pay_type===1" class="recharge-way" @change="onpayList">
			<uni-collapse accordion modelValue="0">
				<uni-collapse-item :title="item.title" v-for="(item,index) in payList" :key="item.title">
					<label class="way-box2 row-center" v-for="(it,idx) in item.list" :key="idx">
						<view class="title">{{it.txt}}</view>
						<radio :value="it.type" :checked="it.type==selpayType" color="#E92B2B"/>
					</label>
				</uni-collapse-item>
			</uni-collapse>
		</radio-group> -->
<!--		<view class="tips-box"> {{$t('v_tiui')}} </view>-->
		<view class="btn-box">
			<button class="xf-btn" :loading="isDisabled" :disabled="isDisabled" @click="onsubmit">{{$t('v_tmjc')}}</button>
		</view>
	</view>
</template>

<script>
	import uniCopy from '@/common/uni-copy.js'
	export default {
		data() {
			return {
				// dataList: {},
				moneyM: 0,
				// wayList: [],
				wayListOnline: [], // 线上
				wayListOffline: [], // 线下
				// wayListIdx: 0,
				wayListOnlineIdx: -1,
				wayListOfflineIdx: 0,
				// selwayType: 'bank',
				payList: [],
				payListIdx: 0,
				selpayType: '',
				bankName: '',
				// bankEmail: '', // 加拿大银行卡需要
				// bankIdentityNo: '', // 加拿大银行卡需要
				transferImg: {
					srcUrl:'' //图片上传
				},
				isDisabled: false,
        //todo 待修改 template 里view
        channel_sort: 1, // 0=线上在上 1=线上在下
			}
		},
		onLoad(opt) {
			this.moneyM =opt.money
			this.getDataList()
		},
		computed: {
			moneyU(){
				return Math.floor((this.moneyM/this.userInfo.usdt) * 100) / 100
			}
		},
		methods: {
			onsubmit(){
				let checkedObj = {}
				if (this.wayListOfflineIdx >= 0) { // 线下支付
					checkedObj = this.wayListOffline[this.wayListOfflineIdx]
					// if(!this.transferImg){
					// 	return this.openShowToast(this.$t('v_uhirfuketu'))
					// }
					if(checkedObj.xx_type===3 && !this.bankName){
						return this.openShowToast(this.$t('v_tmxxxm'))
					}
					
						console.log(this.transferImg.srcUrl,'this.transferImg.srcUrl')
					
					this.isDisabled =true
					let data = {
						num: this.moneyM,
						pic: this.transferImg.srcUrl,
						type: checkedObj.xx_type,
						user_name: this.bankName || '',
						channel_id: checkedObj.id,
					}
					// 加拿大版多几个字段
					// if (checkedObj.xx_type===3 && language === 'ca') {
					// 	data.bank_email = this.bankEmail
					// 	data.bank_identity_no = this.bankIdentityNo
					// }
					this.$http.post('do_pay',data).then(res => {
						this.isDisabled =false
						if (res && res.data && res.data.code == 200) {
							this.openShowToast(res.data.info)
							this.delayPerform(()=>{
								uni.redirectTo({
									url:`/pages/mine/deal?idx=3`
								})
							})
						}else{
							this.openShowToast(res.data.info, 3000)
							// this.delayPerform(()=>{
							// 	uni.redirectTo({
							// 		url:`/pages/mine/wallet/wallet`
							// 	})
							// })
						}
					});
				} else { // 线上支付
					checkedObj = this.wayListOnline[this.wayListOnlineIdx]
					this.$http.post('pay',{
						num: this.moneyM,
						channel_id: checkedObj.id,
					}).then(res => {
						if (res && res.data && res.data.code == 200) {
							const url = res.data.url
							// #ifdef APP-PLUS
							plus.runtime.openWeb(url)
							// #endif
							// #ifdef H5
							window.location.href = url
							// #endif
						} else {
							this.openShowToast(res.data.info)
						}
					})
				}
				/*
				// #ifdef APP-PLUS
				plus.runtime.openWeb(url)
				// #endif
				// #ifdef H5
				window.location.href = url
				// #endif
				 */
			},
			copy(data) {
				uniCopy({
					content: data,
					success:(res)=>{
						this.openShowToast(this.$t('xf_fzcg'))
					},
					error:(e)=>{
						this.openShowToast(this.$t('xf_fzsb'))
					}
				})
			},
			onpayList(e){
				this.selpayType =e.detail.value
			},
			onwayOnlineList(e){
				// this.selwayType =e.detail.value
				// if(this.selwayType=='bank'){
				// 	this.wayListIdx =0
				// }else{
				// 	this.wayListIdx =1
				// }
				this.wayListOfflineIdx = -1
				this.wayListOnlineIdx = parseInt(e.detail.value)
			},
			onwayOfflineList(e){
				this.wayListOnlineIdx = -1
				this.wayListOfflineIdx = parseInt(e.detail.value)
			},
			uploadImg(){
				uni.chooseImage({
					count: 1,
					sourceType: ['album'], //从相册选择
					success: res => {
						uni.uploadFile({
							url: this.$http.config.baseUrl + 'Upload_qrcode', //接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							header:{
								token:this.token
							},
							success: uploadFileRes => {
								let data = JSON.parse(uploadFileRes.data);
								if (data.code == 200) {
									this.transferImg ={
										src: data.src,
										srcUrl: data.srcUrl,
									}
								}else{
									this.openShowToast(this.$t('v_uhiruibl'))
								}
							}
						});
					}
				});
			},
			getDataList(){
				// this.$http.get('payDesk').then(res => {
				// 	if (res && res.data && res.data.code == 200) {
				// 		this.dataList =res.data.data.list
				// 	}
				// });
				// this.wayList =[{title:this.$t('v_ynhhka'),type:'bank'},{title:'USDT',type:'usdt'}]
				// this.selwayType =this.wayList[0].type
				this.payList =[
					{title:this.$t('v_wx'),list:[{txt:'APP',type:'wxapp'},{txt:'H5',type:'wxh5'}]},
					{title:this.$t('v_alipay'),list:[{txt:'APP',type:'aliapp'},{txt:'H5',type:'alih5'}]},
					{title:this.$t('v_ynhhka'),list:[{txt:'APP',type:'bankapp'},{txt:'H5',type:'bankh5'}]}
				]
				this.selpayType =this.payList[0].list[0].type
				// 置空
				this.wayListOnline = []
				this.wayListOffline = []
				this.$http.get('channel_list').then(res => {
					if (res && res.data && res.data.code == 200) {
						const tmpArr = res.data.data.list
					    console.log('channel_list 支付方式 tmpArr===>', JSON.parse(JSON.stringify(tmpArr)))
						/**
						 * 1、pay_type：1 线上支付
						 *    xx_type： 1=微信 2=支付宝 3=银行卡 4=usdt 5=邮箱(只有加拿大有)
						 * 2、pay_type：2 线下支付
						 */
            tmpArr.forEach(obj => {
              if (obj.pay_type === 1) { // 线上支付
                obj.myTitle = (obj.reception_name || '')
                this.wayListOnline.push(obj)
              } else if (obj.pay_type === 2) { // 线下支付
                // 返回的数据里有type、title，就不能再增加对应的字段，得换字段
                if (obj.xx_type===1) { // 微信
                  obj.myTitle = obj.reception_name || this.$t('v_weixin')
                } else if (obj.xx_type===2) { // 支付宝
                  obj.myTitle = obj.reception_name || this.$t('v_zhifubao')
                } else if (obj.xx_type===3) { // 银行卡
                  obj.myTitle = obj.reception_name || obj.bank_name
                } else if (obj.xx_type===4) { // usdt
                  obj.myTitle = obj.reception_name || 'USDT'
                } else if (obj.xx_type===5) { // 邮箱
                  if (this.environment === 'ca_pro') { // 只有加拿大才会有邮箱
                    obj.myTitle = obj.reception_name || 'E-mail'
                  }
                } else if (obj.xx_type===6) { // 邮箱
                  if (this.environment === 'de_pro') { // 只有加拿大才会有邮箱
                    obj.myTitle = obj.reception_name || 'PayPal'
                  }
                }
                if (!(this.environment !== 'ca_pro' && obj.xx_type===5) && !(this.environment !== 'de_pro' && obj.xx_type===6)) {
                  this.wayListOffline.push(obj)
                }
              }
            })
            this.channel_sort = res.data.data.channel_sort
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		padding: 15px 10px 0;
	}
	.parities-box{
		padding: 5px 0;
		border-radius: 5px;
		background-color: #FFFFFF;
		text:last-child{
			font-size: 18px;
			font-weight: bold;
			margin-top: 5px;
		}
	}
	.tips {
		margin: 10px;color: #999999;
	}
	.recharge-way{
		margin-top: 10px;
		border-radius: 5px;
		background-color: #FFFFFF;
		.way-title {
			border-bottom: 1px solid #e1e1e1;line-height: 30px;
			.txt {
				font-size: 20px; font-weight: bold;
			}
		}
		.way-box{
			padding: 12px 5px;
			border-bottom: 1px solid #f7f7f7;
			.title{
				flex: 1;
				word-break: break-all;
				margin: 0 10px 0 5px;
				.tj {
					color: #ff0000;
				}
			}
		}
		.way-box2{
			padding: 10px 15px;
			.title{
				flex: 1;
				font-weight: bold;
				word-break: break-all;
				margin: 0 10px 0 5px;
			}
		}
		.way2-box{
			padding: 8px 5px;
			margin: 0 20px;
			.title{
				color: #999999;
			}
		}
	}
	.pay-collapse{

	}
	.transfer-img{
		width: 300rpx;
		height: 500rpx;
		font-size: 14px;
		color: #999;
		margin: 15px auto;
		border: 1px solid #000;
	}
	.tips-box{
		font-size: 14px;
		color: $themeColor;
		// text-align: center;
	}
	.btn-box{
		width: 100%;
		padding: 10px 0;
		.xf-btn{
			width: calc(100% - 20px);
			height: 50px;
			font-size: 16px;
			margin: 0 auto;
		}
	}
  .input-txt {
    .input {
      border: 1px solid #E92B2B;border-radius: 5px;padding-left: 5px;

    }
  }
</style>
