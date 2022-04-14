<template>
  <view class="page-box column-center">
    <image class="logo-img" :src="$baseUrl.logoImg(environment)" mode="widthFix"></image>
    <view class="form-box">
      <view class="content-box">
        <form @submit="login" class="uni-form-self">
          <view class="title">{{ $t('v_quuphone') }}</view>
          <view class="input-box flex">
            <!-- <image src="/static/imgs/sj.png"></image> -->
            <input v-model="tel" type="number" placeholder-style="color: #ccc;" :placeholder="$t('v_quurubjihk2')"/>
          </view>
          <view class="title">{{ $t('v_quupwd') }}</view>
          <view class="input-box flex">
            <!-- <image src="/static/imgs/yz.png"></image> -->
            <input v-model="pwd" password placeholder-style="color: #ccc;" :placeholder="$t('v_quurumima2')"/>
          </view>
        </form>
      </view>
    </view>
	<!-- 记住密码 -->
	<view class="mui-input-row mui-checkbox" v-if="environment === 'sw_pro'" style="align-self: flex-start;margin-left: 45px;margin-bottom: 10px;">
		<checkbox-group @change="checkboxChange">
			<checkbox
				id="chkRem"
				type="checkbox"
				:checked="rememberPsw"
				@tap="rememberPsw = !rememberPsw"
				:color="$colors.mainColor"
				class="RememberCheck"
			>
				{{$t('xf_492')}}
			</checkbox>
		</checkbox-group>
	</view>
    <view class="register-box">
      <view class="forget" @click="onJumpPage('./forgetPwd')">{{ $t('v_vkhvmima') }}</view>
      <view class="register" @click="onJumpPage('./register')">{{ $t('v_vucevhhk') }}</view>
    </view>
    <view class="row-center">
      <button class="xf-btn" :style="'background-color:'+$colors.button2" @click="login">{{ $t('v_lijidglu') }}</button>
    </view>
    <view v-if="environment !== 'me_pro' && environment !== 'pa_pro'" class="kefu" :style="`color: ${$colors.mainColor};`">
      <mp-html :content="dataList_kf" />
    </view>
	<view v-if="changeLang" class="language-box" :style="'color:'+$colors.mainColor" @click="onLangChange">{{$t('xf_lang')}}</view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      codeList: [], //国家code列表
      countryCode: '',
      tel: '',
      pwd: '',
      dataList_kf: '',
	  changeLang: false,
	  rememberPsw: false,
    }
  },
  onLoad() {
    this.$http.get('confing').then(res => {
      if (res && res.data && res.data.code == 200) {
        console.log(res.data, 'messageVerification.data')
        this.messageVerification = res.data.data.list.short_message_switch
      }
    })
    this.getDataList(5)
	// 1226
	if (this.environment === 'mcl_pro') {
		this.changeLang = true
	}

	if (this.environment === 'sw_pro') {
		const rememberPsw = uni.getStorageSync('rememberPsw');
		console.log(rememberPsw, 'rememberPsw')
		if (rememberPsw) {
			this.rememberPsw = !!rememberPsw;
			//缓存的账号
			const HCuname = uni.getStorageSync('HCuname');
			//缓存的密码
			const HCpassw = uni.getStorageSync('HCpassw');
			//有缓存就赋值给文本没有就清空
			if (HCuname && HCpassw) {
				this.tel = HCuname;
				this.pwd = HCpassw;
			} else {
				this.tel = '';
				this.pwd = '';
			}
		}
	}
  },
  methods: {
    login(e) {
      let val = e.detail.value;
      console.log(this.tel, this.pwd, 'login submit')
      if (!this.tel || !this.pwd) {
        return this.openShowToast(this.$t('v_qjdxnsiwjig'))
      }
      uni.showLoading();
      uni.request({
        url: this.$http.config.baseUrl + 'do_login',
        method: 'POST',
        header: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
          lang: this.$store.state.language,
          tel: this.tel,
          pwd: this.pwd,
          environment: this.environment
        },
        success: res => {
          if (res && res.data && res.data.code == 200) {
            this.$store.commit('saveToken', res.data.data.token);
			if(this.environment === 'sw_pro') {
				//缓存账号和密码
				if (this.rememberPsw) {
					uni.setStorageSync('HCuname', this.tel);
					uni.setStorageSync('HCpassw', this.pwd);
				} else {
					uni.removeStorageSync('HCuname');
					uni.removeStorageSync('HCpassw');
					uni.removeStorageSync('rememberPsw');
				}
			}
            uni.switchTab({
              url: '/pages/home/home'
            })
          } else {
            this.openShowToast(res.data.info)
          }
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },
    getDataList(type) {
      this.$http.get('get_msg', {type: type}).then(res => {
        if (res && res.data && res.data.code == 200 && res.data.data.list[0]) {
          this.dataList_kf = res.data.data.list[0].content
        }
      });
    },
	onLangChange() {
		console.log('onLangChange')
		uni.redirectTo({
		  url: '/pages/mine/languages?from=login'
		})
	},
	//复选框
	checkboxChange: function(e) {
		console.log(e.detail.value.length);
		if (e.detail.value.length == 1) {
			//获取缓存的账号
			uni.getStorageSync('HCuname',this.tel);
			uni.getStorageSync('HCpassw',this.pwd);
			uni.setStorageSync('rememberPsw',1);
		} else {
			uni.removeStorageSync('HCuname');
			uni.removeStorageSync('HCpassw');
			uni.setStorageSync('rememberPsw',0);
		}
	}
  }
};
</script>
<style lang="scss">
.page-box {
	.language-box {
		color: #4474F6;
		text-align: right;
	}
  .form-box {
    width: 100%;
    height: 30vh;
    // text-align: center;
    //background-image: url(../../static/imgs/login_bg.png);
    background-repeat: no-repeat;
    background-size: 100% auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    .content-box {
      background: #fff;
      width: 90%;
      height: 25vh;
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
}

page {
  background-color: #fff;
}

.logo-img {
  width: 300px;
  margin: 50px 0 20px 0;
}

.input-box {
  align-items: center;
  width: 600 rpx;
  height: 45px;
  font-size: 14px;
  line-height: 45px;
  padding: 0 15px;
  border-radius: 45px;
  // background: #f4f4f4;
  image {
    width: 33px;
    height: 20px;
    border-right: 1px solid #c1c1c1;
    padding-right: 10px;
  }

  input {
    flex: 1;
    // padding-left: 10px;
  }
}

.xf-btn {
  width: 600 rpx;
  border-radius: 8px;
  margin: 20px 0;
  height: 52px;
}

.register-box {
  display: flex; justify-content: space-between;
  font-size: 14px; color: #caa160;
  padding: 0 10%;width: 100vw;
}

.mui-checkbox input[type='checkbox']:checked:before {
    // color: #00bbb1;
}
.RememberCheck {
    // margin-left: -50%;
    // margin-top: 10px;
    color: #adadad;
}
</style>
