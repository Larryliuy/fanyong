(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-home-detail"],{"635b":function(t,n,e){"use strict";e("99af"),Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i={data:function(){return{dataList:[],type:1,toDetai:!1,opt:{},pageTitle:""}},onLoad:function(t){this.type=t.type,this.opt=t,"ko_pro"!==this.environment&&"sw_pro"!==this.environment||"1"!==t.type&&"3"!==t.type&&"5"!==t.type||"home"!==t.from&&"mine"!==t.from||(this.toDetai=!0),"ps_pro"===this.environment&&"1"===t.type&&(this.toDetai=!0),this.pageTitle=t.name,this.getDataList()},onPullDownRefresh:function(){this.getDataList()},methods:{getDataList:function(){var t=this;this.$http.get("get_msg",{type:this.type}).then((function(n){if(uni.stopPullDownRefresh(),n&&n.data&&200==n.data.code&&(t.dataList=n.data.data.list,t.dataList[0]&&t.toDetai)){var e="./content?name=".concat(t.dataList[0].title,"&id=").concat(t.dataList[0].id,"&from=").concat(t.opt.from);t.onJumpPage(e)}}))}}};n.default=i},7434:function(t,n,e){"use strict";var i=e("7840"),a=e.n(i);a.a},7840:function(t,n,e){var i=e("9b47");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=e("4f06").default;a("88600cb4",i,!0,{sourceMap:!1,shadowMode:!1})},7949:function(t,n,e){"use strict";e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return i}));var i={pageMeta:e("6d42").default,navigationBar:e("9832").default,uniList:e("067b").default,uniListItem:e("7724").default},a=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",[e("page-meta",[e("navigation-bar",{attrs:{title:t.pageTitle,"front-color":t.$colors.white,"background-color":t.$colors.mainColor}})],1),e("v-uni-view",{staticClass:"page-box"},[e("uni-list",{attrs:{border:!1}},t._l(t.dataList,(function(t,n){return e("uni-list-item",{key:n,attrs:{title:t.title,ellipsis:1,showArrow:!0,to:"./content?name="+t.title+"&id="+t.id}})})),1)],1)],1)},o=[]},"9b47":function(t,n,e){var i=e("24fb");n=i(!1),n.push([t.i,'@charset "UTF-8";\n/**\n * 这里是uni-app内置的常用样式变量\n *\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\n *\n */\n/**\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\n *\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\n */\n/* 颜色变量 */\n/* 行为相关颜色 */\n/* 文字基本颜色 */\n/* 背景颜色 */\n/* 边框颜色 */\n/* 尺寸变量 */\n/* 文字尺寸 */\n/* 图片尺寸 */\n/* Border Radius */\n/* 水平间距 */\n/* 垂直间距 */\n/* 透明度 */\n/* 文章场景相关 */.uni-list-item[data-v-e3b579fe]{padding:5px}[data-v-e3b579fe] .uni-list-item__content-title{font-size:%?30?%}',""]),t.exports=n},c4fc:function(t,n,e){"use strict";e.r(n);var i=e("635b"),a=e.n(i);for(var o in i)"default"!==o&&function(t){e.d(n,t,(function(){return i[t]}))}(o);n["default"]=a.a},f92e:function(t,n,e){"use strict";e.r(n);var i=e("7949"),a=e("c4fc");for(var o in a)"default"!==o&&function(t){e.d(n,t,(function(){return a[t]}))}(o);e("7434");var s,r=e("f0c5"),u=Object(r["a"])(a["default"],i["b"],i["c"],!1,null,"e3b579fe",null,!1,i["a"],s);n["default"]=u.exports}}]);