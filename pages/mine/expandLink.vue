<template>
	<view class="page-box">
		<image :src="downloadInfo.base_img" mode="scaleToFill"></image>
		<view class="url-box" v-if="downloadInfo.web_url">
			<view class="code-info">
				<view class="code"><text class="code-text">{{downloadInfo.invite_code}}</text></view>
				<view class="qr-info">
					<tki-qrcode
					class="qrcode"
					v-show="downloadInfo.qr_url" cid="qrcode" ref="qrcode" :val="downloadInfo.qr_url"
					:showLoading="showLoading"
					 :size="size"  :onval="onval" :loadMake="loadMake" :usingComponents="true" @result="qrR"
					 />
				</view>
			</view>
			<view class="url">
				<text class="more">{{$t('xf_lmore')}}</text>
				<view class="web_url">{{downloadInfo.qr_url}}</view>
				<button @click="fuzhi" size="mini" class="btn-copy" :style="'background-color:'+$colors.mainColor+';color:'+$colors.white">{{$t('v_fuvi')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'

	export default {
		data() {
			return {
				downloadInfo: {},
				size: 260, // 二维码大小
				unit: 'px', // 单位
				icon: '', // 二维码图标
				onval: false, // val值变化时自动重新生成二维码
				loadMake: true, // 组件加载完成后自动生成二维码
				showLoading: false,
			}
		},
	    components: {tkiQrcode},
		onLoad() {
			this.$http.get('app_version').then(res => {
				if (res && res.data && res.data.code == 200) {
					console.log(res.data.data.list, 'res.data')
					this.downloadInfo = res.data.data.list
				}
			});
		},
		computed: {
			wholeUrl() {
				//invite_code
				return this.downloadInfo.web_url + '/' + this.downloadInfo.invite_code
			}
		},
		methods:{
			fuzhi:function() {
				// #ifdef H5
				this.$copyText(this.downloadInfo.qr_url).then(
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
					data: this.downloadInfo.qr_url,
					success: () => {
						this.openShowToast(this.$t('xf_fzcg'))
					},
					fail: () => {
						this.openShowToast(this.$t('xf_fzsb'))
					}
				});
				// #endif
			},
			qrR(res) {
				this.src = res
			},
		}
	}
</script>

<style lang="scss">
	.page-box {
		text-align: center;
		image{
			width: 100vw;
			height: 100vh;
		}
		.url-box {
			position: absolute;
			bottom: 6.8%;
			text-align: center;
			overflow: hidden;
			white-space: nowrap;
			font-size: 12px;
			width: 100%;
			.code-info {
				color: #FFFFFF;margin-bottom: 30px;
				.code {
					margin-bottom: 20px;font-size: 20px;font-weight: bold;
				}
				.qr-info {
					display: flex;justify-content: center;
					.qrcode {
						display: flex;justify-content: center;align-items: center;
						width: 150px;height: 150px;background-color: #FFFFFF;border-radius: 5px;
					}
				}
			}
			.url {
				width: 340px;
				margin: 0 auto;
				padding: 5px 10px;background-color: #fff;border-radius: 5px;
				overflow: hidden;
				display: flex; align-items: center; justify-content: center;
				.more {
					margin-right: 10px;
				}
				.web_url {
					width: 200px;
					// white-space: pre-wrap;
					word-wrap: break-word;
					word-break: break-all;
					white-space: pre-line;
				}
				.btn-copy {
					min-width: 80px;
					max-width: 100px;
				}
			}
		}
	}
</style>
