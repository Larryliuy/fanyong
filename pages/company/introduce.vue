<template>
	<page-meta>
		<navigation-bar :title="$t('xf_introduce')" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box">
		<view v-for="item in contentsList" :key="item.id">
			<text class="title">{{item.title}}</text>
			<view class="content" v-html="item.content"></view>
		</view>
		<uni-load-more :status="loadState"></uni-load-more>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				contentsList: [],
				loadState: 'loading'
			}
		},
		onReady() {
			this.getDataList()
		},
		computed:{
		},
		methods: {
			getDataList(){
				this.$http.get('get_msg',{type:8}).then(res => {
					console.log(res, 'res')
					if (res && res.data && res.data.code == 200) {
						this.contentsList =res.data.data.list
						this.loadState ='noMore'
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.page-box {
		padding: 5px;
		.title {
			font-size: 20px;
		}
		.content {
			padding-top: 5px;
			text-indent: 6px;
		}
	}
</style>
