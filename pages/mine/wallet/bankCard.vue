<template>
	<page-meta>
		<navigation-bar :title="pageTitle" :front-color="$colors.white" :background-color="$colors.mainColor"/>
	</page-meta>
	<view class="page-box">
		<form @submit="onsubmit">
			<template v-if="type=='1'">
				<uni-list :border="false">
					<uni-list-item :showArrow="item.showIcon" v-for="(item,index) in dataList" :key="index" clickable @click="ondataList(index)">
						<view slot="body" class="item-ipt">
							<input :name="item.name" :disabled="item.showIcon" :type="item.type" :password="item.type=='password'" :value="item.value" :placeholder="item.pla"/>
						</view>
					</uni-list-item>
				</uni-list>
				<lb-picker ref="picker" v-model="dataList[1].value" mode="selector" :list="bankList" :props="{label:'bankname',value:'bankname'}"
					:cancelText="$t('xf_cancle')" :confirmText="$t('xf_sure')" :emptyText="$t('xf_nodata')" @confirm="onbankList"></lb-picker>
			</template>
      <template v-else-if="type=='8'">
        <uni-list :border="false">
          <uni-list-item :showArrow="item.showIcon" v-for="(item,index) in dataList" :key="index" clickable @click="ondataList(index)">
            <view slot="body" class="item-ipt">
              <input :name="item.name" :disabled="item.showIcon" :type="item.type" :password="item.type=='password'" :value="item.value" :placeholder="item.pla"/>
            </view>
          </uni-list-item>
        </uni-list>
        <lb-picker ref="picker" v-model="dataList[1].value" mode="selector" :list="bankList" :props="{label:'bankname',value:'bankname'}"
                   :cancelText="$t('xf_cancle')" :confirmText="$t('xf_sure')" :emptyText="$t('xf_nodata')" @confirm="onbankList"></lb-picker>
      </template>
			<template v-else>
				<uni-list :border="false">
					<uni-list-item :showArrow="item.showIcon" v-for="(item,index) in dataList" :key="index" clickable @click="ondataList(index)">
						<view slot="body" class="item-ipt">
							<input :name="item.name" maxlength="50" :disabled="item.showIcon || item.disabled" :value="item.disabled ? 'TRC20' : ''" :type="item.type" :placeholder="item.pla"/>
						</view>
					</uni-list-item>
				</uni-list>
				<lb-picker v-if="type=='5'" ref="picker" v-model="dataList[3].value" mode="selector" :list="pixTypeList" :props="{label:'name',value:'name'}"
					:cancelText="$t('xf_cancle')" :confirmText="$t('xf_sure')" :emptyText="$t('xf_nodata')" @confirm="onTypeList"></lb-picker>
			</template>
			<view v-if="type !=='1' && type !== '5' && type !== '2' && type !== '8'" class="transfer-img row-center" @click="uploadImg">
				<image v-if="imgUrl" :src="imgUrl" mode="aspectFit"></image>
				<text v-else>{{$t('v_djscjt')}}</text>
			</view>
			<view class="btn-box">
				<button v-if="dataListIdx" class="xf-btn" :style="'background-color:'+$colors.button2" @click="showCpwd()">{{$t('v_del')}}</button>
				<button class="xf-btn" :style="'background-color:'+$colors.button1" form-type="submit">{{$t('v_bkcp')}}</button>
			</view>
		</form>
		<uni-popup ref="cpwd" type="dialog">
			<uni-popup-dialog type="info" :title="$t('xf_cpwd')" :cancelText="$t('xf_cancle')" :okText="$t('xf_sure')" @confirm="delBank()">
				<input v-model="cpwd" style="border: 1px solid #cccccc;border-radius: 5px;" password class="cpwd" name="cpwd" :placeholder="$t('xf_cpwdi')">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				type: '1', //添加类型bank ali
				dataList: [],
				dataListIdx: '',
				bankList: [],
				pixTypeList: [],
				selectedPixType: {value: 111},
				imgUrl: '',
				cpwd: ''
			}
		},
		onLoad(opt) {
			console.log(opt, 'onload')
			this.type = opt.type
			if(opt.type=='1'){
				this.dataListIdx =opt.idx
			}
			this.getDataList()
		},
		computed:{
			...mapState(['walletInfo']),
			pageTitle(){
				if(this.type=='1'){
					return this.dataListIdx?this.$t('v_vmjiynhhaka'):this.$t('v_tmjwynhhaka')
				}else if(this.type=='4'){
					return this.$t('v_tjzfb')
				}else if(this.type=='3'){
					return this.$t('v_tjwx')
				}else if(this.type=='2'){
					return this.$t('v_tjusdt')
				}else if(this.type=='5'){
					return this.$t('v_tjpix')
				}else if(this.type=='6'){
					if (this.environment === 'pt_pro') {
						return this.$t('v_tjemail')
					} else {
						return this.$t('v_tjebaby')
					}
				} else if(this.type=='7'){
					return this.$t('v_tjebaby')
				} else if(this.type=='8'){
          return 'clabe'
        }
			}
		},
		methods: {
			// 保存
			onsubmit(e){
				console.log(e.detail, 'onsubmit data')
				let url='addQb',data = e.detail.value
				if(this.type== '1'){
					url='do_bankinfo'
					data.id =this.dataListIdx?this.walletInfo.bankInfo[this.dataListIdx].id:''
				}else if(this.type== '4'){
					if (!data.name) {
						this.openShowToast(this.$t('v_trmc'))
						return
					}
					if (!data.number) {
						this.openShowToast(this.$t('v_trhm'))
						return
					}
					data.qrcode = this.imgUrl
				} else if (this.type == '3') {
					data = {
						name: data.name,
						number: data.number,
					}
					if (!this.imgUrl) {
						this.openShowToast(this.$t('v_qscjt'))
						return
					}
					data.qrcode = this.imgUrl
				} else if (this.type=='2') {
					url='addQb'
					data.qrcode = this.imgUrl
				} else if (this.type=='5') {
          url='addQb'
					data = {
						name: data.name,
						number: data.number,
						identity_no: data.identityNo,
						identity_type: this.selectedPixType.id
					}
				} else if (this.type=='8') {
          url='addQb'
          data = {
            name: data.name,
            number: data.number,
            bankname: this.dataList[1].value,
          }
        }
				this.$http.post(url,{...data, type: Number(this.type)}).then(res => {
					this.openShowToast(res.data.info)
					if (res && res.data && res.data.code == 200) {
						this.delayPerform(()=>{
							this.$store.commit('getwalletInfo')
							this.goBack()
						})
					}
				});
			},
			showCpwd(){
				this.cpwd = ''
				this.$refs.cpwd.open()
			},
			delBank(){
				this.$http.post('confirm_password',{
					pwd: this.cpwd,
				}).then(res => {
					if (res && res.data && res.data.code == 200) {
						this.$http.get('del_bank',{
							id: this.walletInfo.bankInfo[this.dataListIdx].id
						}).then(res => {
							this.openShowToast(res.data.info)
							if (res && res.data && res.data.code == 200) {
								this.$store.commit('getwalletInfo')
								this.goBack()
							}
						});
					} else {
						this.openShowToast(res.data.info)
					}
				})
			},
			onbankList(e){
				this.dataList[1].value = e.value
			},
			onTypeList(e){
				this.dataList[3].value = e.value
				this.selectedPixType = e.item
				console.log(e.item, this.dataList[3], 'onTypeList')
			},
			ondataList(idx){
				console.log(idx, 'picker')
				if(this.type === '1' && idx == 1){
					this.$refs.picker.show()
				}
				if(this.type === '5' && idx == 3){
					this.$refs.picker.show()
				}
        if(this.type === '8' && idx == 1){
          this.$refs.picker.show()
        }
			},
			getDataList(e){
				if(this.type=='1'){
					this.$http.get('bankList').then(res => {
						if (res && res.data && res.data.code == 200) {
							this.bankList =res.data.data.list
						}
					});
					this.dataList =[
						{name:'username',pla:this.$t('v_vfuixmm'),type:'text',showIcon:false,value:''},
						{name:'bankname',pla:this.$t('v_ynhh'),type:'text',showIcon:true,value:''},
						{name:'cardnum',pla:this.$t('v_ynhhkahk'),type:'number',showIcon:false,value:''},
					]
          if (this.environment === 'ja_pro') {
            this.dataList.push({name:'zhidianming',pla:this.$t('v_yhzdmz'),type:'text',showIcon:false,value:''})
          }
          this.dataList.push({name:'tel',pla:this.$t('v_dmhw'),type:'number',showIcon:false,value:''})
					if(this.dataListIdx){
						this.dataList[0].value =this.walletInfo.bankInfo[this.dataListIdx].username
						this.dataList[1].value =this.walletInfo.bankInfo[this.dataListIdx].bankname
						this.dataList[2].value =this.walletInfo.bankInfo[this.dataListIdx].cardnum
            if (this.environment === 'ja_pro') {
              this.dataList[3].value =this.walletInfo.bankInfo[this.dataListIdx].zhidianming
              this.dataList[4].value =this.walletInfo.bankInfo[this.dataListIdx].tel
            } else {
              this.dataList[3].value =this.walletInfo.bankInfo[this.dataListIdx].tel
            }
					}
				} else if(this.type=='2'){
					this.dataList =[
						{name:'name',pla:this.$t('v_vhhumig'), disabled: true},
						{name:'number',pla:this.$t('v_vhhkhkma')},
					]
				} else if(this.type=='4'){
					this.dataList =[
						{name:'name',pla:this.$t('v_vhhumig')},
						{name:'number',pla:this.$t('v_vhhkhkma')},
					]
				} else if(this.type=='5'){
					this.$http.get('identityType').then(res => {
						if (res && res.data && res.data.code == 200) {
							this.pixTypeList = res.data.data.list
						}
					});
					this.dataList =[
						{name:'name',pla:this.$t('v_vhhumig'),type:'text',showIcon:false,},
						{name:'number',pla:this.$t('v_vhhkhkma'),type:'text',showIcon:false,},
						{name:'identityNo',pla:this.$t('v_vhhkhkid'),type:'text',showIcon:false,},
						{name:'identityType',pla:this.$t('v_vhhkhktype'),type:'text',showIcon:true,},
					]
				} else if (this.type=='6'){
					this.dataList =[
						{name:'name',pla:this.$t('v_vhhumig')},
						{name:'number',pla:this.$t('v_vhhkhkma')},
					]
				} else if (this.type=='8'){
          this.$http.get('bankList').then(res => {
            if (res && res.data && res.data.code == 200) {
              this.bankList =res.data.data.list
            }
          });
          this.dataList =[
            {name:'name',pla:this.$t('v_vhhumig')},
            {name:'bankname',pla:this.$t('v_ynhh'),type:'text',showIcon:true,value:''},
            {name:'number',pla:this.$t('v_vhhkhkma')},
          ]
        } else{
					this.dataList =[
						{name:'name',pla:this.$t('v_vhhumig')},
						{name:'number',pla:this.$t('v_vhhkhkma')},
					]
				}
			},
			uploadImg(){
				uni.chooseImage({
					count: 1,
					sourceType: ['album'], //从相册选择
					success: res => {
						uni.uploadFile({
							url: this.$http.config.baseUrl + 'Upload_qrcode', //接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							header:{
								token:this.token
							},
							success: uploadFileRes => {
								let data = JSON.parse(uploadFileRes.data);
								if (data.code == 200) {
									this.imgUrl = data.srcUrl
								}else{
									this.openShowToast(this.$t('v_uhiruibl'))
								}
							}
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.page-box{
		padding: 10px 0 65px;
	}
	.uni-list{
		margin: 0 10px;
		border-radius: 5px;
		overflow: hidden;
		.item-ipt{
			flex: 1;
		}
		.uni-list-item--hover{
			background-color: #FFFFFF;
		}
		::v-deep .uni-icon-wrapper{
			transform: rotateZ(90deg);
		}
	}
	.btn-box{
		width: 100%;
		padding-bottom: 10px;
		position: fixed;
		bottom: 0;
		z-index: 1;
		background-color: #f6f6ff;
		.xf-btn{
			width: calc(100% - 20px);
			height: 50px;
			font-size: 16px;
			margin: 10px auto 0;
			border-radius: 40px;
		}
	}
	.transfer-img{
		width: 300rpx;
		height: 500rpx;
		font-size: 14px;
		color: #999;
		margin: 15px auto;
		border: 1px solid #000;
	}
</style>
