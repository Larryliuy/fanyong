<template>
	<view class="register">
		<view class="title-box">
			<image :src="$baseUrl.logoImg(environment)" mode="widthFix">
		</view>
		<view class="top-box">
			<view class="content-box">
				<form @submit="onSubmit" class="uni-form-self">
				<view class="input_box" style="justify-content: flex-start;">
					<input name="code" style="flex: inherit;width: 45px;text-align: center;" :disabled="true" clickable type="text" :value="countryCode" :placeholder="$t('xf_conutry') + '>'" @click="onCountryCodeClick"/>
					<lb-picker ref="picker" v-model="countryCode" mode="selector" :list="codeList" :props="{label:'name',value:'name'}"
						:cancelText="$t('xf_cancle')" :confirmText="$t('xf_sure')" :emptyText="$t('xf_nodata')" @confirm="onCodeList"></lb-picker>
					<input v-model="tel" name="tel" type="number" :placeholder="$t('v_quurubjihk')">
				</view>
				<view class="input_box"><input name="pwd" type="password" :placeholder="$t('v_quurumima')"></view>
				<view class="input_box"><input name="pwd3" type="password" :placeholder="$t('v_qrrfmima')"></view>
				<view v-if="environment !== 'cn_pro' && environment !== 'pt_pro'" class="input_box"><input name="pwd2" type="password" :placeholder="$t('xf_cpwdi')"></view>
				<view class="input_box"><input name="invite_code" v-model="invCode" type="number" :placeholder="$t('v_tvjmrfykqma')"></view>

				<view class="input_box" v-if="messageVerification === '1'">
					<input name="ver_code" :placeholder="$t('v_uuruyjigma')">
					<button :style="{color:isdisabled?'#a3a3a3':$colors.button2}" type="default" :disabled="isdisabled" @click="gettelCode">{{isdisabled?`${$t('xf_cf')}${djs}s`:$t('xf_code')}}</button>
				</view>
				<view class="btn_box"><button form-type="submit" :style="'background-color:'+$colors.button2">{{$t('v_vuie')}}</button></view>

			</form>
			</view>
		</view>
<!--		<navigator open-type="navigateBack" :delta="1">-->
		<navigator url="./login" :delta="1">
			<button class="login" hover-class="none" form-type="submit">{{$t('v_yiybvkhkdglu')}}</button>
		</navigator>
    <view v-if="environment === 'sw_pro'" class="tips">
      Tips：ION Orchard Tax Refund App can only register one account per person, and one person is not allowed to use multiple accounts.
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				txCode: '', //验证码
				invCode: '',
				djs: 59,
				timer: null, //计时器id
				isdisabled: false, //禁止点击
				width: 120,
				height: 45,
				codeList: [], //国家code列表
				countryCode: '',
				messageVerification: '0', // 1开启 0关闭
				tel: '',
			}
		},
		onLoad() {
			// #ifdef H5
			this.GetRequest()
			// #endif
			// this.getTxcode();
			this.$http.get('country_code').then(res => {
				if (res && res.data && res.data.code == 200) {
					console.log(res.data, '.data')
					this.codeList = res.data.data.list
					if (res.data.data.list) {
						this.countryCode = res.data.data.list[0].code
					}
				}
			})
			this.$http.get('confing').then(res => {
				if (res && res.data && res.data.code == 200) {
					console.log(res.data, 'messageVerification.data')
					this.messageVerification = res.data.data.list.short_message_switch
				}
			})
		},
		onHide() {
			this.timer &&clearInterval(this.timer);
		},
		methods: {
			onSubmit(e) {
				console.log(e, 'eeeeee')
				let val = e.detail.value;
				if (this.messageVerification === '1') {
					val.ver_code =val.ver_code.replace(/\s/g, "").toLocaleLowerCase()
				}
				if (!val.tel ||!val.pwd || (this.environment !== 'cn_pro' && this.environment !== 'pt_pro' && !val.pwd2) || !val.pwd3 ||!val.invite_code || (this.messageVerification === '1' && !val.ver_code)) {
					return this.openShowToast( this.$t('v_qjdxnsiwjig'))
				}else if (val.pwd != val.pwd3) {
					return this.openShowToast( this.$t('v_buyivi'))
				}
				// else if (this.txCode != val.ver_code) {
				// 	// this.getTxcode()
				// 	return this.openShowToast( this.$t('v_codeerroe'))
				// }
				uni.showLoading();
				uni.request({
					url: this.$http.config.baseUrl + 'do_register',
					method: 'POST',
					header: {
						'Content-Type': 'application/json;charset=UTF-8'
					},
					data: {
						lang:this.$store.state.language,
						environment: this.environment,
						...val,
						verify: val.ver_code || undefined,
					},
					success: res => {
						this.openShowToast(res.data.info)
						if (res && res.data && res.data.code == 200) {
							this.delayPerform(()=>{
								// this.goBack()
								uni.switchTab({
									url: '/pages/home/home'
								})
							})
						}
					},
					complete: res => {
						this.openShowToast(res.data.info)
						uni.hideLoading();
					}
				});
			},
			// 获取验证码
			gettelCode(){
				// if (!this.tel || !/^1[3-9]\d{9}$/.test(this.tel)) {
				if (!this.tel) {
					return this.openShowToast( this.$t('v_qsrzqdsjh'))
				}
				this.getTxcode()
				this.isdisabled = true;
				this.timer = setInterval(() => {
					this.djs--;
					if (this.djs < 0) {
						this.djs = 10
						this.isdisabled = false;
						clearInterval(this.timer);
					}
				}, 1000);
			},
			getTxcode() {
				uni.request({
					url: this.$http.config.baseUrl + 'get_VerCode',
					method: 'POST',
					header: {
						'Content-Type': 'application/json;charset=UTF-8',
					},
					data: {
						lang:this.$store.state.language,
						environment: this.environment,
						type: 1, // 1为注册
						tel: this.tel,
						code: this.countryCode + '',
					},
					success: (res) => {
						if (res && res.data && res.data.code == 200) {
							this.openShowToast(this.$t('v_yzmcs'))
						} else {
							this.djs = 59
							clearInterval(this.timer)
							this.isdisabled = false;
							this.openShowToast(res.info || res.data.info || this.$t('v_hoqyuibj'))
						}
					},
				})
			},
			rc: function(min, max) {
				var r = this.rn(min, max);
				var g = this.rn(min, max);
				var b = this.rn(min, max);
				return "rgb(" + r + "," + g + "," + b + ")";
			},
			rn: function(max, min) {
				return parseInt(Math.random() * (max - min)) + min;
			},
			/**
			 * [获取URL中的参数名及参数值的集合]
			 * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
			 * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
			 * @return {[string]}       [参数集合]
			 */
			GetRequest() {
				var urlStr = window.location.href;
				if (typeof urlStr == "undefined") {
					var url = decodeURI(location.search); //获取url中"?"符后的字符串
				} else {
					var url = "?" + urlStr.split("?")[1];
				}
				var theRequest = new Object();
				if (url.indexOf("?") != -1) {
					var str = url.substr(1),
					strs = str.indexOf("&") != -1?str.split("&"):[str];
					for (var i = 0; i < strs.length; i++) {
						theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
					}
				}
				if(theRequest['code']){
					this.invCode = theRequest['code']
				}
			},
			onCodeList(item) {
				console.log(item, 'item')
				this.countryCode = item.item.code
			},
			onCountryCodeClick() {
				this.$refs.picker.show()
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
		.top-box {
			width: 100%;
			height: 50vh;
			// text-align: center;
			//background-image: url(../../static/imgs/login_bg.png);
			background-repeat: no-repeat;
			background-size: 100% auto;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			.content-box {
				background: #fff;
				width: 90%;
				// height: 25vh;
				border: 1px solid #f5f5f5;
				display: flex;
				justify-content: center;
				align-items: center;
				.uni-form-self {
					width: 80%;
					.title {
						padding-left: 15px;
						color: #5a5a5a;
					}
				}
			}
		}
    .tips {
      padding: 0 20px;font-size: 10px;color: #999999;
    }
	}
	.register {
		// padding: 0 65rpx;
		.title-box {
			display: flex;
			justify-content: center;
			padding: 40px 0 30px;

			image {
				width: 400rpx;
			}
		}

		.input_box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #e5e5e5;

			input {
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 30rpx;
				margin: 20rpx 20rpx 0 0;
			}
			button {
				height: 40px;
				line-height: 40px;
				font-size: 30rpx;
				color: #0000FF;

				&:active {
					background-color: transparent;
				}
			}
		}

		.btn_box {
			margin-top: 70rpx;
			button {
				height: 40px;
				font-size: 15px;
				color: #ffffff;
				border-radius: 46rpx;
				background-color: $themeColor2;
				border-radius: 8px;
			}
		}
	}

	.navigator-hover {
		border-radius: 40rpx;
	}

	.login {
		height: 40px;
		font-size: 15px;
		color: #caa160;
		margin-top: 30rpx;
		border-radius: 46rpx;
		background-color: #FFFFFF;
	}

	button::after {
		border: none;
	}
</style>
