(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-mine-discount-mingxi"],{"0a03":function(t,a,i){"use strict";i.r(a);var n=i("ad4c"),e=i("ebea");for(var s in e)"default"!==s&&function(t){i.d(a,t,(function(){return e[t]}))}(s);i("e3bd");var o,c=i("f0c5"),d=Object(c["a"])(e["default"],n["b"],n["c"],!1,null,"e3c6892c",null,!1,n["a"],o);a["default"]=d.exports},"11d8":function(t,a,i){var n=i("5b3f");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var e=i("4f06").default;e("62cb199c",n,!0,{sourceMap:!1,shadowMode:!1})},"5b3f":function(t,a,i){var n=i("24fb");a=n(!1),a.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.page-box[data-v-e3c6892c]{font-size:13px}.page-box .list[data-v-e3c6892c]{display:flex;flex-direction:row;padding:10px;margin:10px;background-color:#fff;border-radius:10px}.page-box .list .list-item[data-v-e3c6892c]{padding:10px;background-color:#fff}.page-box .list .list-item .item1[data-v-e3c6892c]{display:flex}.page-box .list .list-item .item1 .name[data-v-e3c6892c]{font-weight:700;margin-right:10px;width:150px}.page-box .list .list-item .item2[data-v-e3c6892c]{margin-top:5px}',""]),t.exports=a},ad4c:function(t,a,i){"use strict";i.d(a,"b",(function(){return e})),i.d(a,"c",(function(){return s})),i.d(a,"a",(function(){return n}));var n={pageMeta:i("6d42").default,navigationBar:i("9832").default,uniLoadMore:i("dafd").default},e=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("v-uni-view",[i("page-meta",[i("navigation-bar",{attrs:{title:t.$t("xf_461"),"front-color":t.$colors.white,"background-color":t.$colors.mainColor}})],1),i("v-uni-view",{staticClass:"page-box"},t._l(t.dataList,(function(a,n){return i("v-uni-view",{staticClass:"list"},[i("v-uni-view",{staticClass:"list-item"},[i("v-uni-view",{staticClass:"item1"},[i("v-uni-view",{staticClass:"name"},[t._v(t._s(a.discount_name))]),i("v-uni-view",[t._v(t._s(t.$t("xf_515"))+"："+t._s(a.discount_num))])],1),i("v-uni-view",{staticClass:"item2"},[t._v(t._s(t.$t("xf_481"))+"："+t._s(a.addtime))])],1)],1)})),1),i("uni-load-more",{attrs:{status:t.loadState}})],1)},s=[]},d714:function(t,a,i){"use strict";i("99af"),Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n={data:function(){return{dataList:[],loadState:"loading",page:1,limit:20}},onLoad:function(t){this.getDataList()},onPullDownRefresh:function(){this.page=1,this.loadState="loading",this.getDataList()},onReachBottom:function(){"loading"===this.loadState&&(this.page++,this.getDataList())},methods:{getDataList:function(){var t=this;this.$http.get("discount_record",{page:this.page,limit:this.limit}).then((function(a){if(1===t.page&&(t.dataList=[]),a&&a.data&&200===a.data.code){var i=a.data.data||[];uni.stopPullDownRefresh(),t.dataList=t.dataList.concat(i),i.length<t.limit&&(t.loadState="noMore")}}))}}};a.default=n},e3bd:function(t,a,i){"use strict";var n=i("11d8"),e=i.n(n);e.a},ebea:function(t,a,i){"use strict";i.r(a);var n=i("d714"),e=i.n(n);for(var s in n)"default"!==s&&function(t){i.d(a,t,(function(){return n[t]}))}(s);a["default"]=e.a}}]);