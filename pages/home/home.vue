<template>
<!--  <page-meta>-->
<!--    <navigation-bar :title="$t('xf_brandTitle')" :front-color="$colors.white" :background-color="$colors.mainColor"/>-->
<!--  </page-meta>-->
	<view class="home-header-box flex">
		<image class="logo" :src="`/static/imgs/logo_${environment}.png`" mode="widthFix"></image>
		<!-- <image class="notice" :src="`/static/imgs/notice.png`" mode="widthFix"></image> -->
	</view>
	<view class="page-box">
		<swiper class="swiper-box" autoplay indicator-dots circular :indicator-color="$colors.white" :indicator-active-color="$colors.mainColor">
			<swiper-item class="swiper-item" v-for="(item, index) in bannerArticle.banner" :key="index">
				<image class="fill-box" :src="item.image" mode="scaleToFill"></image>
			</swiper-item>
		</swiper>
		<view class="notice-box-wrapper flex">
			<view class="icon"><image class="notice" style="width: 21px;height: 24px;" :src="`/static/imgs/notice_${$colors.key}.png`" mode="widthFix"></image></view>
			<gbro-marquee broadcastType='text' direction="left" :viewHeight="100"
			 :broadcastIconIsDisplay="!true" :touchEvent="true" :broadcastData='broadcastData' :broadcastStyle='broadcastStyle'
			 style="width: 100%">
			</gbro-marquee>
		</view>
		<view class="content-box">
			<!-- <view class="subtitle-box">
				<image :src="`/static/imgs/ad_${$colors.themeColor}.png`" mode="widthFix"></image>
				<text class="title">{{$t('v_tmksuij2')}}</text>
			</view> -->
			<view class="list-box flex">
				<!-- <view class="list-item column-center" :class="[{'list-item2':item.fill},'jianbian'+(index+1)]" v-for="(item,index) in titleList" :key="index" @click="ontitleList(item,index)"> -->
				<view class="list-item flex" :class="[{'list-item2':item.fill}]" v-for="(item,index) in titleList" :key="index" @click="ontitleList(item,index)">
					<image v-if="!item.fill" class="img0" :src="item.img"></image>
					<view class="txt"><text>{{item.txt}}</text></view>
					<view v-if="index === 4 && environment !== 'sw_pro' && environment !== 'ja_pro' && environment !== 'ps_pro'">
						<image v-if="item.fill" class="img1" :src="item.img" mode="widthFix"></image>
<!--						<view style="margin-top: -10px;">{{$t('xf_service')}}</view>-->
					</view>
					<image v-if="item.fill && (index !== 4 || environment === 'sw_pro' || environment === 'ja_pro' || environment === 'ps_pro')" class="img1" :src="item.img" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<uni-popup ref="noticePop">
			<view v-if="bannerArticle&&bannerArticle.article &&bannerArticle.article.content" class="notice-box">
				<view class="tiile">{{$t('xf_notice')}}</view>
				<!-- <view class="content">{{bannerArticle.article.content}}</view> -->
				<view class="content"><mp-html :content="bannerArticle.article.content" /></view>
				<view class="btn-box flex">
					<!-- <button class="xf-btn" @click="$refs.noticePop.close()">{{$t('xf_detail')}}</button> -->
					<button class="xf-btn xf-btn2" @click="$refs.noticePop.close()">{{$t('xf_close')}}</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import gbroMarquee from '@/components/gbro-marquee/marquee.vue'
	import store from "@/store"
	export default {
		data() {
			return {
			  bannerArticle: {article: {}, banner: {}}, // banner图和公共弹窗的数据
				getMsgData: '',
				listIdx: 0, //通告下标
				titleList: [],
				dataTitle:'',//瑞典韩国加入社区title
				broadcastData: [],
				broadcastStyle: {
					speed: 1, //每秒3个字
					font_size: "32", //字体大小(rpx)
					text_color: this.$colors.mainColor, //字体颜色
					// back_color: "red", //背景色
				},
			}
		},
		onReady() {
			
			this.$store.commit('saveUserInfo')
			if(this.environment === 'sw_pro' || this.environment === 'ko_pro'){
				this.getMessage()
			}else {
				this.getDataList()
				
			}
			// let that = this;
			// setTimeout(() => { //模拟接口请求
      //   if (this.environment === 'ko_pro') {
      //     if (this.language === 'ko') {
      //       that.broadcastData = ['코로나 19의 영향으로 사람 중심 이라는 이념을 고수하는  Mall of Berlin은 대면 접촉을 줄이고  외국인 사용자가 편리하게 세금 환급 절차를 완료할 수 있도록 온라인 세금 환급 서비스를 출시했습니다.']
      //     } else {
      //       that.broadcastData = [`Due to the impact of COVID-19, cleaving to the people-oriented concept, Mall of Berlin has launched its online Tax Refund Service to reduce face-to-face contact and make it easier for foreign users to complete the Tax Refund process.`]
      //     }
      //   } else {
      //     that.broadcastData = [this.$t('v_tmksuij2')]
      //   }
			// }, 1000)
      this.getNotice()

		},
		onShow() {
			// #ifdef APP-PLUS
			if(uni.getStorageSync('need_reload')) {
			  // 数据里面的翻译文案按需要重新翻译1
			  this.getDataList()
			}
			// #endif
		},
    activated() {
		  if (this.environment === 'mcl_pro') {
        this.$refs.noticePop.open()
      }
    },
    beforeDestroy() {
    },
    destroyed() {
    },
		components: {
			gbroMarquee
		},
		methods: {
			aniDuration(e){
				let time =e.slice(0,-1)*1000+1
				console.log(time);
				setTimeout(()=>{
					this.listIdx++
					if(this.listIdx==this.getMsgData.list.length) this.listIdx =0
				},time)
			},
		// get_message接口
			getMessage(){
			   this.$http.get('get_msg',{type:6}).then(res => {
				   if (res && res.data && res.data.code == 200) {
				   this.dataTitle = res.data.data.list[0].title
					   //获取datalist接口
				   	this.$http.get('index').then(res => {
				   		if (res && res.data && res.data.code == 200) {
				   			this.bannerArticle =res.data.data
				   			if (this.bannerArticle.article && this.bannerArticle.article.status === 0) {
				   				this.$refs.noticePop.open()
				   				// #ifdef H5
				   				setTimeout(() => {
				   					let dom = document.getElementsByTagName('strong')[0]
				   					console.log(dom, 'dom')
				   					if(dom) {
				   						if (dom.parentNode) {
				   							dom.parentNode.style.whiteSpace = 'pre-wrap'
				   						} else {
				   							dom.style.whiteSpace = 'pre-wrap'
				   						}
				   					}
				   				},50)
				   				// #endif
				   			}
				   		}
				   	});
				   	this.titleList =[
				   		{fill:false,img:'/static/imgs/about.png',txt:this.$t('xf_29')},
				   		{fill:false,img:'/static/imgs/course.png',txt:this.$t('xf_27')},
				   		{fill:false,img:'/static/imgs/promotion.png',txt:this.$t('v_hodszszx')},
				   		{fill:false,img:'/static/imgs/vip.png',txt:this.$t('xf_5')},
				   	]
				   	if(this.environment === 'ps_pro') {
				   		this.titleList.push({fill:true,img:'/static/imgs/whatapps.jpg',txt:this.$t('xf_470')})
				   		this.titleList.push({fill:true,img:'/static/imgs/telegram1.jpg',txt:this.$t('xf_480')})
				   	} else if (this.environment === 'sw_pro'  || this.environment === 'ko_pro') {
				   	
				   		this.titleList.push({fill:true,img:'/static/imgs/telegram1.jpg',txt: this.dataTitle})
				   		this.titleList.push({fill:true,img:'/static/imgs/development.png',txt:this.$t('xf_30')})
				   	} else if ( this.environment === 'de_pro') {
				   		this.titleList.push({fill:true,img:'/static/imgs/telegram1.jpg',txt:this.$t('xf_470')})
				   		this.titleList.push({fill:true,img:'/static/imgs/development.png',txt:this.$t('xf_30')})
				   	} else {
				   		this.titleList.push({fill:true,img:'/static/imgs/development.png',txt:this.$t('xf_30')})
				   	}
				  }
				
				})
	},
			getDataList(){
				this.$http.get('index').then(res => {
					if (res && res.data && res.data.code == 200) {
						this.bannerArticle =res.data.data
						if (this.bannerArticle.article && this.bannerArticle.article.status === 0) {
							this.$refs.noticePop.open()
							// #ifdef H5
							setTimeout(() => {
								let dom = document.getElementsByTagName('strong')[0]
								console.log(dom, 'dom')
								if(dom) {
									if (dom.parentNode) {
										dom.parentNode.style.whiteSpace = 'pre-wrap'
									} else {
										dom.style.whiteSpace = 'pre-wrap'
									}
								}
							},50)
							// #endif
						}
					}
				});
				this.titleList =[
					{fill:false,img:'/static/imgs/about.png',txt:this.$t('xf_29')},
					{fill:false,img:'/static/imgs/course.png',txt:this.$t('xf_27')},
					{fill:false,img:'/static/imgs/promotion.png',txt:this.$t('v_hodszszx')},
					{fill:false,img:'/static/imgs/vip.png',txt:this.$t('xf_5')},
				]
				if(this.environment === 'ps_pro') {
					this.titleList.push({fill:true,img:'/static/imgs/whatapps.jpg',txt:this.$t('xf_470')})
					this.titleList.push({fill:true,img:'/static/imgs/telegram1.jpg',txt:this.$t('xf_480')})
				} else if (this.environment === 'sw_pro') {
					this.titleList.push({fill:true,img:'/static/imgs/telegram1.jpg',txt: this.$t('xf_480')})
					this.titleList.push({fill:true,img:'/static/imgs/development.png',txt:this.$t('xf_30')})
				} else if (this.environment === 'ko_pro' || this.environment === 'de_pro') {
					this.titleList.push({fill:true,img:'/static/imgs/telegram1.jpg',txt:this.$t('xf_470')})
					this.titleList.push({fill:true,img:'/static/imgs/development.png',txt:this.$t('xf_30')})
				} else {
					this.titleList.push({fill:true,img:'/static/imgs/development.png',txt:this.$t('xf_30')})
				}
			},
			// 菜单
			ontitleList(it,idx){
				console.log(it, idx, 'ontitleList')
				// 1225 有加入百盛 传10
				let url =`./detail?name=${it.txt}&type=${idx === 5 ? 10 : idx+1}&from=home`
				if(idx==3){
					if (this.userInfo.operation_is_allowed == 0) {
						this.openShowToast(this.$t('xf_520'))
						return
					}
					url ='/pages/vip/level'
				}

				if(idx === 4 || idx === 5) {
					// #ifdef H5
						if (this.$utils.isIOS()) {
							window.kefuUrlTab = window.open('about:blank')
						}
					// #endif
			  let type = 0
			  if(this.environment === 'ps_pro') {
				if (idx === 4) {
				  type = 6
				} else if (idx === 5) {
				  type = 10
				}
			} else if (this.environment === 'sw_pro' || this.environment === 'de_pro' || this.environment === 'ko_pro') {
				if (idx === 4) {
				  type = 6
				} else if (idx === 5) {
				  type = 5
				}
			} 
			// else if (this.environment === 'ko_pro') {
			// 	if (idx === 4) {
			// 		type = 10
			// 	} else if (idx === 5) {
			// 		type = 5
			// 	}
			// }
			 else {
				type = 5
			}
			
					this.$http.get('get_msg',{type:type}).then(res => {
						console.log(res, 'res.data')
						if (res && res.data && res.data.code == 200) {
							this.getMsgData =res.data.data.list
							console.log(this.getMsgData, 'this.getMsgData')
							if (this.getMsgData && this.getMsgData[0]) {
								this.$http.get('getMsgContent',{id:this.getMsgData[0].id}).then(res => {
									if (res && res.data && res.data.code == 200) {
										const content = res.data.data.info.content
										let reg = /href="([\s\S+]{1,200})"/
										if(reg.test(content)) {
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
										} else {
											console.log(content, 'content')
										}
									}
								})
							}
						}
					})
				} else {
					this.onJumpPage(url)
				}
			},
			getJianbian(index) {
				const index0 = this.$colors[`jianbian${index+1}0`]
				const index1 = this.$colors[`jianbian${index+1}1`]
				return `background-image: linear-gradient(${index0},${index1});`
			},
			getNotice() {
			  const that = this
        this.$http.get('get_join_us').then(res => {
          console.log('get_join_us ===>', res)
          if (res && res.data && res.data.data && res.data.data.list && res.data.data.list.content) {
            that.broadcastData = [res.data.data.list.content]
          } else {
            if (this.environment === 'ko_pro') {
              if (this.language === 'ko') {
                that.broadcastData = ['코로나 19의 영향으로 사람 중심 이라는 이념을 고수하는  Mall of Berlin은 대면 접촉을 줄이고  외국인 사용자가 편리하게 세금 환급 절차를 완료할 수 있도록 온라인 세금 환급 서비스를 출시했습니다.']
              } else {
                that.broadcastData = [`Due to the impact of COVID-19, cleaving to the people-oriented concept, Mall of Berlin has launched its online Tax Refund Service to reduce face-to-face contact and make it easier for foreign users to complete the Tax Refund process.`]
              }
            } else {
              that.broadcastData = [this.$t('v_tmksuij2')]
            }
          }
        })
      },

		}
	}
</script>

<style lang="less">
	.home-header-box {
		height: 80px;
		display: flex;justify-content: center;
		align-items: center;
		margin-bottom: 8px;
		.logo{
			max-height: 90% !important;
			margin-top: 5%;
			width: 200px;
			margin-left: 20px;
		}
		.notice{
			width: 21px;
			height: 24px;
			margin-right: 20px;
		}
	}
	.swiper-box {
		width: 94%;
		height: 200px;
		// margin-top: 5px;
		border-radius: 20px;
		overflow: hidden;
		margin: 0 auto;
		.swiper-item{
			// padding: 0 15px;
			box-sizing: border-box;
		}
	}
	.notice-box-wrapper{
	  justify-content: flex-start;
	  padding: 5px 3%;
	  margin-bottom: 10px;
	  border-bottom-left-radius: 20px;
	  border-bottom-right-radius: 20px;
	  background-color: #FFFFFF;
	}
	.content-box{
		padding: 0 15px;
		.list-box{
			flex-wrap: wrap;
			justify-content: space-between;
			.list-item{
				width: 49%;
				height: 60px;
				font-size: 14px;
				// color: #FFFFFF;
				// padding-left: 15px;
				margin-bottom: 5px;
				border-radius: 10px;
				text-align: center;
				justify-content: flex-start;
				align-items: center;
				background-color: #FFFFFF;
        .img0{
          width: 60px;
          height: 60px;
        }
        .txt {
          flex: 1;
        }
				.img1{
          width: 60px;
				}
			}
			.list-item2{
				flex-direction: row;
				justify-content: space-between;
				width: 100%;
				height: 70px;
				padding-right: 15px;
				padding-left: 15px;
			}
		}
	}
	.notice-box{
		width: 600rpx;
		border-radius: 8px;
		background-color: #fff;
		min-height: 13rem;
		padding: 0.75rem 0.75rem 0 0.75rem;
		.tiile{
			text-align: center;
			padding: 10px 0;
			// border-bottom: 1px solid #F5F5F5;
			font-size: 16px;
			font-weight: 600;
		}
		.content{
			min-height: 200px;
			font-size: 14px;
			color: #797979;
			padding: 10px;
		}
		.btn-box{
			justify-content: center;
			padding: 0 5px 15px;
			.xf-btn{
				width: 270rpx;
				font-size: 14px;
				border-radius: 50px;
			}
			.xf-btn2{
				background-color: #4676F6;
			}
		}
	}
	.jianbian1{
		background-image: linear-gradient(#FE7A0E,#FD3E3D);
	}
	.jianbian2{
		background-image: linear-gradient(#FA8A65,#FA5B4B);
	}
	.jianbian3{
		background-image: linear-gradient(#FDC744,#FDA336);
	}
	.jianbian4{
		background-image: linear-gradient(#FE0F7C,#F30212);
	}
	.jianbian5{
		background-image: linear-gradient(#E92725,#B30709);
	}
</style>
