<template>
	<page-meta>
		<navigation-bar :title="$t('xf_23')" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box">
		<view class="money-box row-center" :style="'background-color:'+$colors.button2">
			<text>{{environment === 'mcl_pro' ? '$' : $t('xf_rmb')}}</text>
			<b>{{userInfo.balance}}<text v-if="environment === 'sw_pro'" style="margin-left: 2px;">USDT</text></b>
		</view>
		<!-- 银行卡 -->
		<view class="bank-box" v-if="bankInfo.type_id">
			<view class="title flex">
				<text class="flex-item">{{$t('v_ynhhka')}}</text>
				<uni-icons type="plusempty" size="19" @click="showCpwd(`./bankCard?type=${bankInfo.type_id}`)"></uni-icons>
			</view>
			<uni-list :border="false">
				<uni-list-item v-if="walletInfo.bankInfo" clickable v-for="(it,idx) in walletInfo.bankInfo" :key="idx" @click="onJumpPage(`./bankCard?type=${bankInfo.type_id}&idx=${idx}`)">
					<view slot="body" class="item-box flex">
						<text>{{it.username}}</text>
						<text class="bankname">{{it.bankname}}</text>
						<text>{{it.cardnum}}</text>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<!-- 支付宝 -->
		<view class="bank-box" v-if="alipayInfo.type_id">
			<view class="title flex">
				<text class="flex-item">{{$t('v_alipay')}}</text>
				<uni-icons v-show="!walletInfo.aliName.name" type="plusempty" size="19" @click="showCpwd(`./bankCard?type=${alipayInfo.type_id}`)"></uni-icons>
			</view>
			<uni-list :border="false">
				<uni-list-item v-if="walletInfo.aliName.name || walletInfo.aliName.ali_name">
					<view slot="body" class="item-box flex">
						<text class="flex-item">{{walletInfo.aliName.name || walletInfo.aliName.ali_name}}</text>
						<text>{{walletInfo.aliName.number || walletInfo.aliName.ali_account}}</text>
						<uni-icons class="close-icon" type="close" size="19" color="#ccc" @click="delcard(alipayInfo.type_id, walletInfo.aliName.id)"></uni-icons>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="row-center" v-if="walletInfo.aliName.qrcode || walletInfo.aliName.ali_qrcode">
				<image class="qrcode" :src="walletInfo.aliName.qrcode || walletInfo.aliName.ali_qrcode" mode="widthFix"></image>
			</view>
		</view>
		<!-- 微信 -->
		<view class="bank-box" v-if="wxInfo.type_id">
			<view class="title flex">
				<text class="flex-item">{{$t('v_wx')}}</text>
				<uni-icons v-show="!walletInfo.wxInfo.name" type="plusempty" size="19" @click="showCpwd(`./bankCard?type=${wxInfo.type_id}`)"></uni-icons>
			</view>
			<uni-list :border="false">
				<uni-list-item v-if="walletInfo.wxInfo.name || walletInfo.wxInfo.wx_name">
					<view slot="body" class="item-box flex">
						<text class="flex-item">{{walletInfo.wxInfo.name || walletInfo.wxInfo.wx_name}}</text>
						<text>{{walletInfo.wxInfo.number || walletInfo.wxInfo.wx_account}}</text>
						<uni-icons class="close-icon" type="close" size="19" color="#ccc" @click="delcard(wxInfo.type_id,walletInfo.wxInfo.id)"></uni-icons>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="row-center" v-if="walletInfo.wxInfo.qrcode || walletInfo.wxInfo.wx_qrcode">
				<image class="qrcode" :src="walletInfo.wxInfo.qrcode || walletInfo.wxInfo.wx_qrcode" mode="widthFix"></image>
			</view>
		</view>
		<!-- USDT -->
		<view class="bank-box" v-if="USDTInfo.type_id">
			<view class="title flex">
				<text class="flex-item">USDT</text>
				<uni-icons v-show="(walletInfo.qbInfo.length < 5  && environment === 'sw_pro') || walletInfo.qbInfo.length === 0" type="plusempty" size="19" @click="showCpwd(`./bankCard?type=${USDTInfo.type_id}`)"></uni-icons>
				<!-- <uni-icons type="plusempty" size="19" @click="onJumpPage('./bankCard?type=usdt')"></uni-icons> -->
			</view>
			<uni-list :border="false">
				<uni-list-item v-if="walletInfo.qbInfo" v-for="(item) in walletInfo.qbInfo">
					<view slot="body" class="item-box flex ellipsis-box">
						<text class="flex-item">{{item.name}}</text>
						<text class="ellipsis">{{item.number}}</text>
						<uni-icons v-if="environment !== 'sw_pro' && environment !== 'de_pro'" class="close-icon" type="close" size="19" color="#ccc" @click="delcard(item.type, item.id)"></uni-icons>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="row-center" v-if="walletInfo.qbInfo.qrcode">
				<image class="qrcode" :src="walletInfo.qbInfo.qrcode" mode="widthFix"></image>
			</view>
		</view>
		<!-- PIX -->
		<view class="bank-box" v-if="pixInfo.type_id && walletInfo.pix && environment === 'pt_pro'">
			<view class="title flex">
				<text class="flex-item">PIX</text>
				<uni-icons v-show="!walletInfo.pix.number" type="plusempty" size="19" @click="showCpwd(`./bankCard?type=${pixInfo.type_id}`)"></uni-icons>
				<!-- <uni-icons type="plusempty" size="19" @click="onJumpPage('./bankCard?type=usdt')"></uni-icons> -->
			</view>
			<uni-list :border="false">
				<uni-list-item v-if="walletInfo.pix.number">
					<view slot="body" class="item-box flex">
						<text class="flex-item">{{walletInfo.pix.name}}</text>
						<text>{{walletInfo.pix.number}}</text>
						<uni-icons class="close-icon" type="close" size="19" color="#ccc" @click="delcard(pixInfo.type_id,walletInfo.pix.id)"></uni-icons>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="row-center" v-if="walletInfo.pix.qrcode">
				<image class="qrcode" :src="walletInfo.pix.qrcode" mode="widthFix"></image>
			</view>
		</view>
		<!-- E-mail -->
		<view class="bank-box" v-if="emailInfo.type_id && walletInfo.email && environment === 'ca_pro'">
			<view class="title flex">
				<text class="flex-item">E-mail</text>
				<uni-icons v-show="!walletInfo.email.number" type="plusempty" size="19" @click="showCpwd(`./bankCard?type=${emailInfo.type_id}`)"></uni-icons>
				<!-- <uni-icons type="plusempty" size="19" @click="onJumpPage('./bankCard?type=usdt')"></uni-icons> -->
			</view>
			<uni-list :border="false">
				<uni-list-item v-if="walletInfo.email.number">
					<view slot="body" class="item-box flex">
						<text class="flex-item">{{walletInfo.email.name}}</text>
						<text>{{walletInfo.email.number}}</text>
						<uni-icons class="close-icon" type="close" size="19" color="#ccc" @click="delcard(emailInfo.type_id,walletInfo.email.id)"></uni-icons>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="row-center" v-if="walletInfo.email.qrcode">
				<image class="qrcode" :src="walletInfo.email.qrcode" mode="widthFix"></image>
			</view>
		</view>
		<!-- Baby-E-mail -->
		<view class="bank-box" v-if="environment === 'de_pro' && babyEmailInfo.type_id">
			<view class="title flex">
				<text class="flex-item">{{babyEmailInfo.name}}</text>
				<uni-icons v-show="!(walletInfo.bb && walletInfo.bb.number)" type="plusempty" size="19" @click="showCpwd(`./bankCard?type=${babyEmailInfo.type_id}`)"></uni-icons>
				<!-- <uni-icons type="plusempty" size="19" @click="onJumpPage('./bankCard?type=usdt')"></uni-icons> -->
			</view>
			<uni-list :border="false" v-if="walletInfo.bb">
				<uni-list-item v-if="walletInfo.bb.number">
					<view slot="body" class="item-box flex">
						<text class="flex-item">{{walletInfo.bb.name}}</text>
						<text>{{walletInfo.bb.number}}</text>
						<uni-icons class="close-icon" type="close" size="19" color="#ccc" @click="delcard(babyEmailInfo.type_id,walletInfo.bb.id)"></uni-icons>
					</view>
				</uni-list-item>
			</uni-list>
			<view class="row-center" v-if="walletInfo.bb">
				<image class="qrcode" :src="walletInfo.bb.qrcode" mode="widthFix"></image>
			</view>
		</view>
    <!-- clabe -->
    <view class="bank-box" v-if="clabeInfo.type_id">
      <view class="title flex">
        <text class="flex-item">{{clabeInfo.name}}</text>
        <uni-icons v-if="!walletInfo.clabe.number" type="plusempty" size="19" @click="showCpwd(`./bankCard?type=${clabeInfo.type_id}`)"></uni-icons>
      </view>
      <uni-list :border="false">
        <uni-list-item v-if="walletInfo.clabe.number">
          <view slot="body" class="item-box flex">
            <text>{{walletInfo.clabe.name}}</text>
            <text class="bankname">{{walletInfo.clabe.common_param}}</text>
            <text>{{walletInfo.clabe.number}}</text>
            <uni-icons class="close-icon" type="close" size="19" color="#ccc" @click="delcard(clabeInfo.type_id,walletInfo.clabe.id)"></uni-icons>
          </view>
        </uni-list-item>
      </uni-list>
    </view>
	<uni-popup ref="cpwd" type="dialog">
		<uni-popup-dialog type="info" :title="$t('xf_cpwd')" :cancelText="$t('xf_cancle')" :okText="$t('xf_sure')" @confirm="verifyCpwd()">
			<input v-model="cpwd" style="border: 1px solid #cccccc;border-radius: 5px;" password class="cpwd" name="cpwd" :placeholder="$t('xf_cpwdi')">
		</uni-popup-dialog>
	</uni-popup>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				typeList: [], //
				bankInfo: {},
				USDTInfo: {},
				wxInfo: {},
				alipayInfo: {},
				pixInfo: {},
				emailInfo: {},
				babyEmailInfo: {}, //宝贝类型
				clabeInfo: {}, // clabe支付方式
				cpwd: '', //交易密码
				currentUrl: '' ,// 当前要跳转的url
				currentType: '', // 当前要删除的type
				currentTypeItem: {}, // 当前要删除的方式
				delId: '', // 具体删除的id
			}
		},
		onLoad() {
			console.log('onLoad walletInfo===>', JSON.parse(JSON.stringify(this.walletInfo)))
			this.$http.get('deposit_type_list').then(res => {
				if (res && res.data && res.data.code == 200) {
					console.log(res.data, '.data')
					this.typeList = res.data.data.list
				}
			})
		},
		computed:{
			...mapState(['walletInfo'])
		},
		watch:{
			typeList(val) {
				console.log(val, 'typelist')
				if (this.typeList && this.typeList.length > 0) {
					for(let i = 0; i < this.typeList.length; i++) {
						if(this.typeList[i].type_id === 1) {
							this.bankInfo = this.typeList[i]
						} else if (this.typeList[i].type_id === 2) {
							this.USDTInfo = this.typeList[i]
						} else if (this.typeList[i].type_id === 3) {
							this.wxInfo = this.typeList[i]
						} else if (this.typeList[i].type_id === 4) {
							this.alipayInfo = this.typeList[i]
						} else if (this.typeList[i].type_id === 5) {
							this.pixInfo = this.typeList[i]
						} else if (this.typeList[i].type_id === 6) {
							this.emailInfo = this.typeList[i]
						} else if (this.typeList[i].type_id === 7) {
							this.babyEmailInfo = this.typeList[i]
						} else if (this.typeList[i].type_id === 8) {
						  this.clabeInfo = this.typeList[i]
						  console.log('clabeInfo====>', JSON.parse(JSON.stringify(this.clabeInfo)))
						}
					}
				}
			},
			currentType(val) {
				if(val && this.typeList) {
					for(let i = 0; i < this.typeList.length; i++) {
						if(this.typeList[i].type_id === this.currentType) {
							console.log(this.typeList[i], 'this.typeList[i]')
							this.currentTypeItem = this.typeList[i]
						}
					}
				}
			}
		},
		methods: {
			delcard(type, id){
				if(this.environment === 'me_pro' || this.environment === 'ko_pro' || this.environment === 'dev' || this.environment === 'ps_pro' || this.environment === 'de_pro' || this.environment === 'pa_pro') {
					this.showCpwd()
					console.log(type, 'delcard')
					this.currentType = type
					if(id) {
						this.delId = id
					}
				} else {
					let url ='',data ={}
					if (this.environment === 'cn_pro') {
						if(type=='4'){
							url='delAliName'
						} else if (type=='3') {
							url='delWxName'
						} else if (type=='2') {
							url ='delQb'
						}
					} else {
						url ='delUserWithdraw'
						data = {type: type}
						if (type !== 1) {
							// 非银行卡(中国版除外)都需要加一个id参数
							data.id = id
						}
					}
					this.$http.get(url,data).then(res => {
						this.openShowToast(res.data.info)
						if (res && res.data && res.data.code == 200) {
							this.$store.commit('getwalletInfo')
						}
					});
				}
			},
			showCpwd(url) {
				this.cpwd = ''
				if (this.environment === 'dev' || this.environment === 'me_pro' || this.environment === 'ko_pro' ||this.environment === 'sw_pro' || this.environment === 'ps_pro' || this.environment === 'de_pro' || this.environment === 'pa_pro') {
					console.log(url)
					this.currentUrl = url
					this.$refs.cpwd.open()
				} else {
					this.onJumpPage(url)
				}
			},
			verifyCpwd() {
				console.log(this.cpwd, this.currentType, 'cpwd')
				this.$http.post('confirm_password',{
					pwd: this.cpwd,
				}).then(res => {
					if (res && res.data && res.data.code == 200) {
						if(this.currentUrl) {
							this.onJumpPage(this.currentUrl)
						}
						if(this.currentType) {
							let url ='',data ={}
							url ='delUserWithdraw'
							data = {type: this.currentType}
							if (this.currentType !== 1 && this.environment !== 'cn_pro') {
								// 非银行卡(中国版除外)都需要加一个id参数
								data.id = this.delId || this.currentTypeItem.id
							}
							this.$http.get(url,data).then(res => {
								this.openShowToast(res.data.info)
								if (res && res.data && res.data.code == 200) {
									this.delId = ''
									this.$store.commit('getwalletInfo')
								}
							});
						}
					} else {
						this.openShowToast(res.data.info)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.page-box{
		padding: 0 10px;
	}
	.money-box{
		flex-direction: column;
		width: 100%;
		height: 100px;
		color: #FFFFFF;
		border-radius: 10px;
		background-color: $themeColor2;
		b{
			font-size: 22px;
			margin-top: 30rpx;
		}
	}
	.bank-box{
		width: 100%;
		margin-top: 30rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		overflow: hidden;
		.title{
			padding: 10px 15px;
			border-bottom: 1px solid #f7f7f7;
		}
		.qrcode {
			width: 200px;
		}
	}
	.ellipsis-box {
		max-width: 100%;
		.ellipsis {
			white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
		}
	}
	.uni-list{
		.uni-list-item--hover{
			background-color: #FFFFFF;
		}
		.item-box{
			flex: 1;
			.bankname{
				flex: 1;
				text-align: center;
			}
			.close-icon{
				margin-left: 10px;
			}
		}
	}
</style>
