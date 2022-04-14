<template>
  <page-meta>
    <navigation-bar :title="pageTitle" :front-color="$colors.white" :background-color="$colors.mainColor"/>
  </page-meta>
  <view class="page-box" :key="pageKey">
    <view :class="`item-box ${language===item.id ? 'checked' : ''}`" v-for="(item,index) in langs" :key="index"
          @click="() => onLangChange(item)">
      <text class="item-text">{{ item.title }}</text>
      <text v-if="item.id !== language" class="item-text">({{ item.oTitle }})</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pageKey: 0,
      langs: [],
      pageTitle: '',
      langMaps: {
        cn: '中文(简体)',
        tc: '中文(繁体)',
        en: 'English',
        es: 'español',
        ja: '日本',
        ko: '한국인',
        nc: 'bahasa Indonesia',
        pt: 'Portuguese',
        sw: 'English',
        ly: 'italiano',
        tr: 'Türkiye',
        de: 'Deutsch'
      },
      opt: {},
      tmpId: 0 // 用户跳login页面后面带的参数
    }
  },
  onLoad(opt) {
    console.log(this.language, 'language')
    this.opt = opt
    this.pageTitle = this.$t('xf_lang')
    if (this.environment === 'me_pro') {
      this.langs = [
        {id: 'es', title: this.$t('xf_es'), oTitle: this.langMaps['es']},
        {id: 'en', title: this.$t('xf_en'), oTitle: this.langMaps['en']},
      ]
    } else if (this.environment === 'mcl_pro' || this.environment === 'ps_pro') {
      this.langs = [
        {id: 'en', title: this.$t('xf_en'), oTitle: this.langMaps['en']},
        {id: 'es', title: this.$t('xf_es'), oTitle: this.langMaps['es']},
        {id: 'ly', title: this.$t('xf_ly'), oTitle: this.langMaps['ly']},
        {id: 'ko', title: this.$t('xf_ko'), oTitle: this.langMaps['ko']},
        {id: 'ja', title: this.$t('xf_ja'), oTitle: this.langMaps['ja']},
        {id: 'pt', title: this.$t('xf_pt'), oTitle: this.langMaps['pt']},
        {id: 'nc', title: this.$t('xf_nc'), oTitle: this.langMaps['nc']},
        {id: 'tr', title: this.$t('xf_tr'), oTitle: this.langMaps['tr']},
      ]
    } else if (this.environment === 'ko_pro') {
      this.langs = [
        {id: 'tc', title: this.$t('xf_tc'), oTitle: this.langMaps['tc']},
        {id: 'ko', title: this.$t('xf_ko'), oTitle: this.langMaps['ko']},
        {id: 'en', title: this.$t('xf_en'), oTitle: this.langMaps['en']},
        {id: 'es', title: this.$t('xf_es'), oTitle: this.langMaps['es']},
      ]
    } else if (this.environment === 'de_pro') {
      this.langs = [
        {id: 'de', title: this.$t('xf_de'), oTitle: this.langMaps['de']},
        {id: 'en', title: this.$t('xf_en'), oTitle: this.langMaps['en']},
        {id: 'es', title: this.$t('xf_es'), oTitle: this.langMaps['es']},
        {id: 'ly', title: this.$t('xf_ly'), oTitle: this.langMaps['ly']},
      ]
    }
  },
  onShow() {
    console.log('languages onshow')
  },
  methods: {
    onLangChange(item) {
      console.log(item, this.$router)
      const that = this
      if (this.$store.state.language == item.id) return
      this.$i18n.locale = item.id;
      this.$store.commit('setLanguage', {
        data: item.id,
        cb: () => {
          // #ifdef H5
          that.$router.go(0)
          // #endif
          // #ifdef APP-PLUS
          console.log(this.opt, 'opt')
          if (this.opt && this.opt.from === 'login') {
            uni.redirectTo({url: '/pages/login/login'})
          } else {
            uni.setStorageSync('need_reload', 1)
            // tabbar内容手动设置
            for (let i = 0; i < 5; i++) {
              let barObj = {
                index: i,
                text: this.$t(`t_${i}`)
              }
              if (i === 2) { //退税icon需要更换
                //需要单独处理的icon
                const obj = {
                  'ko_pro': 'ko_pro',
                  'cn_pro': 'cn_pro'
                }
                barObj = {
                  index: i,
                  text: this.$t(`t_${i}`),
                  iconPath: `static/tabbar/drawback_${obj[this.environment] || 'us_pro'}.png`,
                  selectedIconPath: `static/tabbar/drawback_act_${obj[this.environment] || 'us_pro'}.png`
                }
              }
              uni.setTabBarItem(barObj)
            }
            uni.switchTab({url: '/pages/mine/mine?reload=1'});
          }
          // #endif
        },
      })
    },
  }
}
</script>

<style lang="scss">
.page-box {
  text-align: center;

  .item-box {
    padding: 8px 5px;
    background-color: #ddd;

    .item-text {
      padding-left: 20px;
    }
  }

  .checked {
    background-color: #ccc;
  }
}
</style>
