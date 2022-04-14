<template>
	<page-meta>
    <navigation-bar :title="$t('xf_461')" :front-color="$colors.white" :background-color="$colors.mainColor" />
	</page-meta>
	<view class="page-box">
    <view v-for="(item,index) in dataList" class="list">
      <view class="list-item">
        <view class="item1">
          <view class="name">{{item.discount_name}}</view>
          <view>{{$t('xf_515')}}：{{item.discount_num}}</view>
        </view>
        <view class="item2">
          {{$t('xf_481')}}：{{item.addtime}}
        </view>
      </view>
    </view>
	</view>
  <uni-load-more :status="loadState"></uni-load-more>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				// 加载更多
				loadState: 'loading',
				page: 1,
				limit: 20,
			}
		},
		onLoad(opt) {
			this.getDataList()
		},
		onPullDownRefresh() {
			this.page =1
			this.loadState ='loading'
			this.getDataList()
		},
		onReachBottom() {
			if(this.loadState ==='loading'){
				this.page++
				this.getDataList()
			}
		},
		methods: {
      getDataList(){
        this.$http.get('discount_record',{page: this.page,limit: this.limit}).then(res => {
          if(this.page === 1) this.dataList = [] //如果是第一页需手动置空列表
          if (res && res.data && res.data.code === 200) {
            let data2 = res.data.data || []
			console.log(res.data, data2, 'data2')
            uni.stopPullDownRefresh()
            this.dataList = this.dataList.concat(data2); //追加新数据
			console.log(this.dataList, 'datalist')
            if(data2.length < this.limit){
              this.loadState ='noMore'
            }
          }
        });
      },
		}
	}
</script>

<style lang="scss" scoped>
	.page-box{
    font-size: 13px;
    .list {
      display: flex;flex-direction: row;padding: 10px;margin: 10px;background-color: #ffffff;border-radius: 10px;
      .list-item {
        padding: 10px;background-color: #ffffff;
        .item1 {
          display: flex;
          .name {
            font-weight: bold;margin-right: 10px;width: 150px;
          }
        }
        .item2 {
          margin-top: 5px;
        }
      }
    }
	}
</style>
