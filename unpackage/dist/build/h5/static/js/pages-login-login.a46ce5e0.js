(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-login-login"],{"0d26":function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return a}));var a={mpHtml:n("7e5a").default},i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"page-box column-center"},[n("v-uni-image",{staticClass:"logo-img",attrs:{src:t.$baseUrl.logoImg(t.environment),mode:"widthFix"}}),n("v-uni-view",{staticClass:"form-box"},[n("v-uni-view",{staticClass:"content-box"},[n("v-uni-form",{staticClass:"uni-form-self",on:{submit:function(e){arguments[0]=e=t.$handleEvent(e),t.login.apply(void 0,arguments)}}},[n("v-uni-view",{staticClass:"title"},[t._v(t._s(t.$t("v_quuphone")))]),n("v-uni-view",{staticClass:"input-box flex"},[n("v-uni-input",{attrs:{type:"number","placeholder-style":"color: #ccc;",placeholder:t.$t("v_quurubjihk2")},model:{value:t.tel,callback:function(e){t.tel=e},expression:"tel"}})],1),n("v-uni-view",{staticClass:"title"},[t._v(t._s(t.$t("v_quupwd")))]),n("v-uni-view",{staticClass:"input-box flex"},[n("v-uni-input",{attrs:{password:!0,"placeholder-style":"color: #ccc;",placeholder:t.$t("v_quurumima2")},model:{value:t.pwd,callback:function(e){t.pwd=e},expression:"pwd"}})],1)],1)],1)],1),"sw_pro"===t.environment?n("v-uni-view",{staticClass:"mui-input-row mui-checkbox",staticStyle:{"align-self":"flex-start","margin-left":"45px","margin-bottom":"10px"}},[n("v-uni-checkbox-group",{on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.checkboxChange.apply(void 0,arguments)}}},[n("v-uni-checkbox",{staticClass:"RememberCheck",attrs:{id:"chkRem",type:"checkbox",checked:t.rememberPsw,color:t.$colors.mainColor},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.rememberPsw=!t.rememberPsw}}},[t._v(t._s(t.$t("xf_492")))])],1)],1):t._e(),n("v-uni-view",{staticClass:"register-box"},[n("v-uni-view",{staticClass:"forget",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onJumpPage("./forgetPwd")}}},[t._v(t._s(t.$t("v_vkhvmima")))]),n("v-uni-view",{staticClass:"register",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onJumpPage("./register")}}},[t._v(t._s(t.$t("v_vucevhhk")))])],1),n("v-uni-view",{staticClass:"row-center"},[n("v-uni-button",{staticClass:"xf-btn",style:"background-color:"+t.$colors.button2,on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.login.apply(void 0,arguments)}}},[t._v(t._s(t.$t("v_lijidglu")))])],1),"me_pro"!==t.environment&&"pa_pro"!==t.environment?n("v-uni-view",{staticClass:"kefu",style:"color: "+t.$colors.mainColor+";"},[n("mp-html",{attrs:{content:t.dataList_kf}})],1):t._e(),t.changeLang?n("v-uni-view",{staticClass:"language-box",style:"color:"+t.$colors.mainColor,on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onLangChange.apply(void 0,arguments)}}},[t._v(t._s(t.$t("xf_lang")))]):t._e()],1)},o=[]},"14e8":function(t,e,n){"use strict";var a=n("cbf1"),i=n.n(a);i.a},"39be":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={data:function(){return{codeList:[],countryCode:"",tel:"",pwd:"",dataList_kf:"",changeLang:!1,rememberPsw:!1}},onLoad:function(){var t=this;if(this.$http.get("confing").then((function(e){e&&e.data&&200==e.data.code&&(t.messageVerification=e.data.data.list.short_message_switch)})),this.getDataList(5),"mcl_pro"===this.environment&&(this.changeLang=!0),"sw_pro"===this.environment){var e=uni.getStorageSync("rememberPsw");if(e){this.rememberPsw=!!e;var n=uni.getStorageSync("HCuname"),a=uni.getStorageSync("HCpassw");n&&a?(this.tel=n,this.pwd=a):(this.tel="",this.pwd="")}}},methods:{login:function(t){var e=this;t.detail.value;if(!this.tel||!this.pwd)return this.openShowToast(this.$t("v_qjdxnsiwjig"));uni.showLoading(),uni.request({url:this.$http.config.baseUrl+"do_login",method:"POST",header:{"Content-Type":"application/json;charset=UTF-8"},data:{lang:this.$store.state.language,tel:this.tel,pwd:this.pwd,environment:this.environment},success:function(t){t&&t.data&&200==t.data.code?(e.$store.commit("saveToken",t.data.data.token),"sw_pro"===e.environment&&(e.rememberPsw?(uni.setStorageSync("HCuname",e.tel),uni.setStorageSync("HCpassw",e.pwd)):(uni.removeStorageSync("HCuname"),uni.removeStorageSync("HCpassw"),uni.removeStorageSync("rememberPsw"))),uni.switchTab({url:"/pages/home/home"})):e.openShowToast(t.data.info)},complete:function(){uni.hideLoading()}})},getDataList:function(t){var e=this;this.$http.get("get_msg",{type:t}).then((function(t){t&&t.data&&200==t.data.code&&t.data.data.list[0]&&(e.dataList_kf=t.data.data.list[0].content)}))},onLangChange:function(){uni.redirectTo({url:"/pages/mine/languages?from=login"})},checkboxChange:function(t){1==t.detail.value.length?(uni.getStorageSync("HCuname",this.tel),uni.getStorageSync("HCpassw",this.pwd),uni.setStorageSync("rememberPsw",1)):(uni.removeStorageSync("HCuname"),uni.removeStorageSync("HCpassw"),uni.setStorageSync("rememberPsw",0))}}};e.default=a},"7f2a":function(t,e,n){var a=n("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.page-box .language-box[data-v-4831ef50]{color:#4474f6;text-align:right}.page-box .form-box[data-v-4831ef50]{width:100%;height:30vh;background-repeat:no-repeat;background-size:100% auto;display:flex;justify-content:flex-start;align-items:flex-end}.page-box .form-box .content-box[data-v-4831ef50]{background:#fff;width:90%;height:25vh;display:flex;justify-content:center;align-items:center}.page-box .form-box .content-box .uni-form-self[data-v-4831ef50]{width:80%}.page-box .form-box .content-box .uni-form-self .title[data-v-4831ef50]{padding-left:15px;color:#5a5a5a}uni-page-body[data-v-4831ef50]{background-color:#fff}.logo-img[data-v-4831ef50]{width:300px;margin:50px 0 20px 0}.input-box[data-v-4831ef50]{align-items:center;width:600 rpx;height:45px;font-size:14px;line-height:45px;padding:0 15px;border-radius:45px}.input-box uni-image[data-v-4831ef50]{width:33px;height:20px;border-right:1px solid #c1c1c1;padding-right:10px}.input-box uni-input[data-v-4831ef50]{flex:1}.xf-btn[data-v-4831ef50]{width:600 rpx;border-radius:8px;margin:20px 0;height:52px}.register-box[data-v-4831ef50]{display:flex;justify-content:space-between;font-size:14px;color:#caa160;padding:0 10%;width:100vw}.RememberCheck[data-v-4831ef50]{color:#adadad}body.?%PAGE?%[data-v-4831ef50]{background-color:#fff}',""]),t.exports=e},a41e:function(t,e,n){"use strict";n.r(e);var a=n("0d26"),i=n("e95a1");for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);n("14e8");var s,r=n("f0c5"),c=Object(r["a"])(i["default"],a["b"],a["c"],!1,null,"4831ef50",null,!1,a["a"],s);e["default"]=c.exports},cbf1:function(t,e,n){var a=n("7f2a");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var i=n("4f06").default;i("28a50938",a,!0,{sourceMap:!1,shadowMode:!1})},e95a1:function(t,e,n){"use strict";n.r(e);var a=n("39be"),i=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);e["default"]=i.a}}]);