<template>
	<page-meta>
		<navigation-bar :title="$t('xf_cpwdmodify')" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box column-center">
		<form @submit="resetPwd">
			  <view class="mobile_view" style="justify-content: flex-start;">
				<input name="code" style="flex: inherit;width: 45px;text-align: center;" :disabled="true" clickable type="text" :value="countryCode" :placeholder="$t('xf_conutry') + '>'" @click="onCountryCodeClick"/>
				<lb-picker ref="picker" v-model="countryCode" mode="selector" :list="codeList" :props="{label:'name',value:'code'}"
						   :cancelText="$t('xf_cancle')" :confirmText="$t('xf_sure')" :emptyText="$t('xf_nodata')" @confirm="onCodeList"></lb-picker>
				<input v-model="tel" name="tel" type="number" style="width: 100%" :placeholder="$t('v_quurubjihk')">
			  </view>
				<view class="input-box flex" v-if="environment === 'me_pro'">
					<input name="pay_pwd" :placeholder="$t('v_quurykqmaa')"/>
				</view>
			  <view class="input_box code_view" v-else>
				<input class="ver_code" name="ver_code" :placeholder="$t('v_uuruyjigma')">
				<button :style="{color:isdisabled?'#a3a3a3':$colors.button2}" type="default" :disabled="isdisabled" @click="gettelCode" class="button_code">{{isdisabled?`${$t('xf_cf')}${djs}s`:$t('xf_code')}}</button>
			  </view>
			<view class="input-box flex">
				<input name="pwd" password :placeholder="$t('xf_cpwdi')"/>
			</view>
			<view class="row-center">
				<button class="xf-btn" :style="'background-color:'+$colors.button2" form-type="submit">{{$t('xf_cpwdmodify')}}</button>
			</view>
		</form>
	</view>
</template>
<script>
	export default {
		data() {
			return {
        djs: 59,
        timer: null, //计时器id
        isdisabled: false, //禁止点击
        tel: '',
        codeList: [], //国家code列表
        countryCode: '',
      }
		},
    onLoad() {
      this.$http.get('country_code').then(res => {
        if (res && res.data && res.data.code == 200) {
          console.log(res.data, '.data')
          this.codeList = res.data.data.list
          if (res.data.data.list) {
            this.countryCode = res.data.data.list[0].code
          }
        }
      })
    },
    onHide() {
      this.timer &&clearInterval(this.timer);
    },
		methods: {
			resetPwd(e) {
				let val = e.detail.value;
				console.log(val)
				if (!val.tel ||!val.pwd) {
					return this.openShowToast(this.$t('v_qjdxnsiwjig'))
				}
				val = {
				  environment: this.environment,
				  type: 2, // 资金密码
				  lang: this.language,
				  tel: val.tel,
				  verify: val.ver_code,
				  invite_code: val.invite_code,
				  pwd: val.pwd,
				  pay_pwd: val.pay_pwd,
				  code: this.countryCode + '',
				}
				if (this.environment === 'me_pro') {
					if (!val.pay_pwd) {
						return this.openShowToast(this.$t('v_qjdxnsiwjig'))
					}
				} else {
					if (!val.verify) {
					  return this.openShowToast(this.$t('v_qjdxnsiwjig'))
					}
					// val.verify = val.ver_code
				}
				uni.showLoading();
				uni.request({
					url: this.$http.config.baseUrl + 'do_forget',
					method: 'POST',
					header: {
						'Content-Type': 'application/json;charset=UTF-8'
					},
					data: {...val},
					success: res => {
						this.openShowToast(res.data.info)
						if (res && res.data && res.data.code == 200) {
							this.delayPerform(()=>{
								this.onJumpPage(`/pages/login/login`)
							})
						}
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
      // 获取验证码
      gettelCode(){
        if (!this.tel) {
          return this.openShowToast( this.$t('v_qsrzqdsjh'))
        }
        this.getTxcode()
        this.isdisabled = true;
        this.timer = setInterval(() => {
          this.djs--;
          if (this.djs < 0) {
            this.djs =10
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
            type: 2, // 1为注册、2为修改密码的
            tel: this.tel,
            code: this.countryCode + '',
          },
          success: (res) => {
            if (res && res.data && res.data.code == 200) {
              this.openShowToast(this.$t('v_yzmcs'))
            } else {
              this.openShowToast(this.$t('v_hoqyuibj'))
            }
          },
        })
      },
      onCodeList(item) {
        console.log(item, 'onCodeList')
        this.countryCode = item.item.code
        console.log('this.countryCode====>', this.countryCode)
      },
      onCountryCodeClick() {
        this.$refs.picker.show()
      }
		}
	};
</script>
<style lang="scss">
	page{
		padding-top: 30px;
		background-color: #fff;
	}
  .page-box {
    padding: 0 32px;
  }
	.input-box{
		align-items: center;
		width: 600rpx;
		height: 45px;
		font-size: 14px;
		line-height: 45px;
		padding: 0 15px;
		margin-bottom: 15px;
		border-radius: 45px;
		background: #f4f4f4;
		input {
			flex: 1;
			padding-left: 10px;
		}
	}
	.xf-btn{
		width: 600rpx;
		border-radius: 50px;
		margin: 30px 0 10px;
	}
  .mobile_view {
    display: flex;justify-content: center;align-items: center;height: 45px;
    background: #f4f4f4;border-radius: 45px;padding: 0 15px;margin-bottom: 15px;
  }
  .code_view {
    display: flex;justify-content: center;align-items: center;
    background: #f4f4f4;border-radius: 45px;padding: 0 15px;margin-bottom: 15px;
    .ver_code {
      padding-left: 10px;
    }
    .button_code {
      height: 40px;line-height: 40px;padding: 0;width: 220px;
    }
  }
</style>
