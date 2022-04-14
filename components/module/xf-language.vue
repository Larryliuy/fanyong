<template>
	<view class="xf-language">
		<view class="suspension-box">
			<view class="language" @click="$refs.languagePop.open()">
				<text class="xfIcon-diqiu"> </text>
			</view>
		</view>
		<!-- 语言弹窗 -->
		<uni-popup ref="languagePop" :maskClick="false">
			<view class="languagePop-box">
				<view class="languagePop">
					<text v-for="(item,index) in languageList" :key="index" @click="selLanguage(item)">{{item.title}}</text>
				</view>
				<text class="xfIcon-guanbi" @click="$refs.languagePop.close()"></text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: 'xf-language',
		data(){
			return {
				languageList: [
					{id: 'cn',title: this.$t('xf_zh')},
					{id: 'en',title: this.$t('xf_en')},
				]
			}
		},
		methods: {
			selLanguage(e){
				this.$refs.languagePop.close()
				if(this.$store.state.language==e.id) return
				this.$i18n.locale = e.id;
				this.$store.commit('setLanguage',e.id)
				this.$router.go(0)
			},
		}
	}
</script>

<style lang="scss" scoped>
.suspension-box{
	position: fixed;
	bottom: 220rpx;
	right: 20rpx;
	z-index: 99;
	.language{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
		background-color: #FFFFFF;
		border: 1px solid #efeef3;
		.xfIcon-diqiu{
			font-size: 40rpx;
			color: $themeColor;
		}
	}
}
.languagePop-box{
	display: flex;
	flex-direction: column;
	align-items: center;
	.languagePop{
		display: flex;
		flex-direction: column;
		width: 600rpx;
		margin-bottom: 20rpx;
		border-radius: 8rpx;
		background-color: #FFFFFF;
		text{
			font-size: 34rpx;
			text-align: center;
			padding: 30rpx 0;
		}
	}
	.xfIcon-guanbi{
		font-size: 70rpx;
		color: #FFFFFF;
	}
}
</style>
