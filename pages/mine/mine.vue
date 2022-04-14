<template>
  <page-meta>
    <navigation-bar :title="$t('t_4')" :background-color="$colors.white" front-color="#000000"/>
  </page-meta>
  <view class="page-box">
    <text class="vip-txt" :style="`background: ${$colors.mainColor};}`">{{ userInfo.levelName }}</text>
    <view class="page-top flex">
      <view class="avatar-box">
        <image :src="`/static/imgs/me_${environment}.png`" mode="widthFix"></image>
      </view>
      <view class="userinfo-box2">
        <view class="userinfo2 flex">
          <text class="flex-item">{{ $t('xf_2') }}：{{ userInfo.tel }}</text>
        </view>
        <view class="userinfo2 flex">
          <text class="flex-item" v-if="environment !== 'mcl_pro'">ID：{{ userInfo.id }}</text>
        </view>
        <view class="userinfo2 flex invite-box" @click="fuzhi">
          <text class="flex-item">{{ $t('xf_4') }}：{{ userInfo.invite_code }}</text>
        </view>
      </view>
    </view>
    <view class="second-box">
      <view class="balance-box row-center">
        <view class="balance column-center">
          <text class="title">{{ $t('v_yyoe') }}({{ danwen }})</text>
          <text class="yue">{{ userInfo.balance }}
            <text v-if="environment === 'sw_pro'" style="margin-left: 5px;">USDT</text>
          </text>
          <!-- <text>{{$t('xf_rmb')}}</text> -->
        </view>
        <!-- <view class="balance column-center">
          <b>{{userInfo.usdt}}</b>
          <text>{{$t('xf_hl')}}</text>
        </view>
        <view class="balance column-center">
          <b>{{moneyU}}</b>
          <text>USDT</text>
        </view> -->
      </view>
      <view class="btn-box flex">
        <button class="xf-btn" v-for="(item,index) in bntList" :key="index" @click="onBntList(index)"
                :style="{backgroundColor: $colors.button2, color: '#ffffff'}">
          <image :src="`/static/imgs/me_${index === 0 ? 'recharge' : 'withdraw'}.png`" mode="widthFix"></image>
          {{ item }}
        </button>
      </view>
    </view>
    <view :class="`list-box ${environment !== 'cn_pro' ? 'list-box-other' : ''}`">
      <navigator class="list-item row-center" :url="item.url" v-for="(item,index) in dataList" :key="index"
                 @click="onItemClick(item)">
        <text :class="item.extraIcon.type" :style="{fontSize:item.extraIcon.size+'px',color: $colors.button2}"></text>
        <text class="flex-item">{{ item.title }}</text>
        <uni-icons type="arrowright" color="#ccc"></uni-icons>
      </navigator>
    </view>
    <view class="btn-box2">
      <button class="xf-btn" :style="'background:'+$colors.button2" @click="$refs.logoutPop.open()">{{ $t('xf_18') }}
      </button>
    </view>
    <!-- <xf-language></xf-language> -->
    <!-- 确定退出弹窗 -->
    <uni-popup ref="logoutPop" type="dialog">
      <uni-popup-dialog type="info" :title="$t('xf_18')" :content="$t('xf_19')" :cancelText="$t('xf_cancle')"
                        :okText="$t('xf_sure')" @confirm="confirmLogout"></uni-popup-dialog>
    </uni-popup>
    <!-- 验证资金密码 -->
    <uni-popup ref="cpwd" type="dialog">
      <uni-popup-dialog type="info" :title="$t('xf_cpwd')" :cancelText="$t('xf_cancle')" :okText="$t('xf_sure')"
                        @confirm="verifyCpwd()">
        <input v-model="cpwd" style="border: 1px solid #cccccc;border-radius: 5px;" password class="cpwd" name="cpwd"
               :placeholder="$t('xf_cpwdi')">
      </uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bntList: [this.$t('xf_20'), this.$t('xf_21')],
      downloadInfo: {},
      currentUrl: '',
      cpwd: '',
      lists: [],
      danwen: this.$t('xf_rmb'),
    }
  },
  onLoad() {
    if (this.environment === 'mcl_pro') {
      this.danwen = '$'
    }
    this.$store.commit('getwalletInfo')
  },
  onShow() {
    console.log('onshow mine')
    // #ifdef APP-PLUS
    if (uni.getStorageSync('need_reload')) {
      // 数据里面的翻译文案按需要重新翻译
      this.bntList = [this.$t('xf_20'), this.$t('xf_21')]
    }
    // #endif
    this.getDataList()
  },
  computed: {
    moneyU() {
      return Math.floor((this.userInfo.balance / this.userInfo.usdt) * 100) / 100
    },
    dataList() {
      let list = [{url: './wallet/wallet', title: this.$t('xf_23'), extraIcon: {size: '25', type: 'xfIcon-qianbao'}}]
      if (this.environment === 'dev' || this.environment === 'dev2' || this.environment === 'me_pro' || this.environment === 'pt_pro' || this.environment === 'mcl_pro') {
        list.push({
          url: './yuebao/yeb',
          title: this.$t('xf_361'),
          extraIcon: {size: '25', type: 'xfIcon-jishujiaoyijiagepingguxitong'}
        })
      }
	  // 折扣卡
	  if (this.downloadInfo.discount_switch === '1') {
		  list.push({
		    url: './discount/list',
		    title: this.$t('xf_510'),
		    extraIcon: {size: '25', type: 'xfIcon-qianbao'}
		  })
	  }
      const tmpArr = [
        {url: './deal', title: this.$t('xf_24'), extraIcon: {size: '26', type: 'xfIcon-jishujiaoyijiagepingguxitong'}},
      ]
      if (this.environment === 'ny_pro' || this.environment === 'dev') {
        tmpArr.push(
            {url: '/pages/vip/vip', title: this.$t('t_3'), extraIcon: {size: '23', type: 'xfIcon-yaoqing'}}
        )
      } else {
        tmpArr.push(
            {url: './expandLink', title: this.$t('xf_26'), extraIcon: {size: '23', type: 'xfIcon-yaoqing'}}
        )
      }
      list = list.concat(tmpArr)
      if (this.environment !== 'ko_pro') {
        if (this.environment === 'sw_pro') {
          list.push({
            url: `/pages/home/detail?name=${this.$t('xf_42')}&type=9`,
            title: this.$t('xf_42'),
            extraIcon: {size: '25', type: 'xfIcon-jiaocheng-1'}
          })
        } else {
          list.push({
            url: `/pages/home/detail?name=${this.$t('xf_27')}&type=2`,
            title: this.$t('xf_27'),
            extraIcon: {size: '25', type: 'xfIcon-jiaocheng-1'}
          })
        }
        list.push({
          url: `/pages/home/detail?name=${this.$t('xf_29')}&type=1&from=mine`,
          title: this.$t('xf_29'),
          extraIcon: {size: '25', type: 'xfIcon-guanyuwomen'}
        })
      }
      // 1225客服服务
      if (this.environment === 'ps_pro') {
        list = list.concat([
          {url: 'chat', title: this.$t('xf_30'), extraIcon: {size: '29', type: 'xfIcon-wenti'}}
        ])
      }
      if (this.environment === 'me_pro' || this.environment === 'ko_pro' || this.environment === 'sw_pro' || this.environment === 'ps_pro' || this.environment === 'dev' || this.environment === 'pa_pro') {
        list = list.concat([
          {url: `/pages/mine/forgetCPwd`, title: this.$t('xf_cpwd'), extraIcon: {size: '29', type: 'xfIcon-edit'}}
        ])
      }
      list = list.concat([
        {url: `/pages/login/forgetPwd`, title: this.$t('xf_22'), extraIcon: {size: '29', type: 'xfIcon-edit'}}
      ])
      if (this.environment === 'me_pro' || this.environment === 'mcl_pro' || this.environment === 'ps_pro' || this.environment === 'ko_pro' || this.environment === 'de_pro') {
        list.push({url: './languages', title: this.$t('xf_lang'), extraIcon: {size: '25', type: 'xfIcon-diqiu'}})
      }
      if (this.downloadInfo && (this.downloadInfo.ios_url || this.downloadInfo.android_url)) {
        let url = this.downloadInfo.ios_url
        //#ifdef H5
        if (/android/.test(navigator.userAgent.toLowerCase())) {
          url = this.downloadInfo.android_url
        }
        //#endif
        //#ifdef APP-PLUS
        if (uni.getSystemInfoSync().platform === 'android') {
          url = this.downloadInfo.android_url
        }
        //#endif
        list.push({url: url, title: this.$t('xf_28'), extraIcon: {size: '25', type: 'xfIcon-xiazai'}})
      }
      return list
    }
  },
  methods: {
    // 菜单
    onBntList(idx) {
      if (!idx) {
        this.onJumpPage(`./wallet/recharge`)
      } else {
		if (this.userInfo.operation_is_allowed == 0) {
			this.openShowToast(this.$t('xf_520'))
		} else {
			this.showCpwd(`./wallet/withDraw`)
		}
      }
    },
    // 退出登录
    confirmLogout() {
      this.$http.get('logout').then(res => {
        if (res && res.data && res.data.code == 200) {
          this.$store.commit('clearUserInfo')
        }
      });
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
    getDataList() {
      this.$store.commit('saveUserInfo')
    },
    onItemClick(item) {
      // 点击下载app时跳转下载链接
      if (item.title && item.title === this.$t('xf_28')) {
        //#ifdef H5
        // window.open(item.url, '_blank')
        window.open(item.url)
        if (this.$utils.isIOS()) {
          setTimeout(() => {
            window.location.href = '/static/app.mobileprovision'
          }, 2000)
        }
        //#endif
        // IOS 需要转码 encodeURI()
        //#ifdef APP-PLUS
        plus.runtime.openURL(encodeURI(item.url), err => {
          console.log(err)
        });
        //#endif
      }
      // 1225 客户服务
      if (item.title && item.title === this.$t('xf_30')) {
        this.gotoChat()
      }
    },
    gotoChat() {
      console.log('gotoChat')
      // #ifdef H5
      if (this.$utils.isIOS()) {
        window.kefuUrlTab = window.open('about:blank')
      }
      // #endif
      this.$http.get('get_msg', {type: 5}).then(res => {
        if (res && res.data && res.data.code == 200) {
          this.lists = res.data.data.list
          console.log(this.lists, 'this.dataList')
          if (this.lists && this.lists[0]) {
            this.$http.get('getMsgContent', {id: this.lists[0].id}).then(res => {
              if (res && res.data && res.data.code == 200) {
                const content = res.data.data.info.content
                let reg = /href="([\s\S+]{1,200})"/
                if (reg.test(content)) {
                  let kefuUrl = RegExp.$1
                  console.log('kefuUrl 1===>', kefuUrl)
                  kefuUrl = kefuUrl.replace('amp;', '').replace('" target="_blank', '')
                  console.log('kefuUrl 2===>', kefuUrl)
                  // #ifdef H5
                  if (this.$utils.isIOS() && window.kefuUrlTab) {
                    window.kefuUrlTab.location.href = kefuUrl
                  } else {
                    window.open(kefuUrl)
                  }
                  // #endif
                  // #ifdef APP-PLUS
                  plus.runtime.openWeb(kefuUrl)
                  // #endif
                }
              } else {
                window.kefuUrlTab.close()
              }
            })
          }
        }
      })
    },
    fuzhi: function () {
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
    showCpwd(url) {
      this.cpwd = ''
      if (this.environment === 'me_pro' || this.environment === 'ko_pro' || this.environment === 'dev' || this.environment === 'sw_pro' || this.environment === 'ps_pro' || this.environment === 'pa_pro') {
        console.log(url)
        this.currentUrl = url
        this.$refs.cpwd.open()
      } else {
        this.onJumpPage(url)
      }
    },
    verifyCpwd() {
      console.log(this.cpwd, 'cpwd')
      this.$http.post('confirm_password', {
        pwd: this.cpwd,
      }).then(res => {
        if (res && res.data && res.data.code == 200) {
          this.onJumpPage(this.currentUrl)
        } else {
          this.openShowToast(res.data.info)
        }
      })
    }
  },
  mounted() {
    this.$http.get('app_version').then(res => {
      if (res && res.data && res.data.code == 200) {
        console.log(res.data.data.list, 'res.data app_version')
        this.downloadInfo = res.data.data.list
		this.discount_switch = res.data.data.discount_switch
      }
    });
  }
}
</script>

<style lang="less">
.page-box {
  // background-color: #fff;
  padding-top: 10px;

  .vip-txt {
    position: absolute;
    right: 0px;
    top: 10px;
    color: #fff;
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

.page-top {
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

  .userinfo-box2 {
    position: relative;
    margin-left: 10px;

    .userinfo2 {
      align-items: center;
      margin-bottom: 10px;

      text {
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

.btn-box {
  margin-top: 10px;
  justify-content: space-around;

  .xf-btn {
    width: 42%;
    height: 48px;
    font-size: 14px;
    // margin-left: 10px;
    background-color: #EBC65E;
    // background-image: linear-gradient(90deg, #ffcd7e, #cba261);
    color: #323233;
    font-size: 16px;
    border-radius: 12px;
  }

  image {
    width: 25px;
    height: 25px;
    margin-right: 5px;
  }
}

.second-box {
  background-color: #FFFFFF;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding-bottom: 20px;
}

.balance-box {
  width: 100%;
  margin-top: 10px;
  padding: 10px 0;
  color: #000;
  border-radius: 10px;
  background-color: #FFFFFF;
  // position: absolute;
  // left: 0;
  // bottom: -68px;
  justify-content: flex-start;
  text-align: left;
  z-index: 1;
  padding-left: 20px;

  .balance {
    // flex: 1;
    text-align: left;
    align-items: flex-start;

    text {
      font-size: 14px;
    }

    .title {
      color: #868686;
      padding-bottom: 10px;
    }

    .yue {
      font-size: 20px;
      font-weight: 700;
    }
  }

  .xf-btn {
    width: 90px;
    height: 40px;
    margin-left: 15px;
  }
}

.list-box {
  margin: 10px 10px 20px;

  .list-item {
    height: 50px;
    padding: 0 10px 0 15px;
    margin-bottom: 10px;
    background-color: #FFFFFF;

    text:first-child {
      margin-right: 15px;
    }
  }
}

.list-box-other {
  font-size: 14px;
}

.btn-box2 {
  padding: 10px;

  .xf-btn {
    width: 100%;
    border-radius: 8px;
  }
}
</style>
