
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/home","pages/home/detail","pages/home/content","pages/company/company","pages/company/introduce","pages/drawback/drawback","pages/drawback/payDeatil","pages/drawback/orderDeatil","pages/energy/energy","pages/energy/payDeatil","pages/energy/orderDeatil","pages/miner/miner","pages/miner/payDeatil","pages/miner/orderDeatil","pages/vip/vip","pages/vip/level","pages/mine/mine","pages/mine/forgetCPwd","pages/mine/wallet/wallet","pages/mine/yuebao/yeb","pages/mine/yuebao/mingxi","pages/mine/discount/list","pages/mine/discount/mingxi","pages/mine/deal","pages/mine/wallet/bankCard","pages/mine/wallet/recharge","pages/mine/wallet/rechargeSuc","pages/mine/wallet/withDraw","pages/mine/expandLink","pages/mine/languages","pages/login/register","pages/login/login","pages/login/forgetPwd","components/asyncError/asyncError"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"","navigationBarBackgroundColor":"#caa160","backgroundColor":"#F4F4F4"},"tabBar":{"color":"#666666","selectedColor":"#FFC24F","backgroundColor":"","borderStyle":"none","list":[{"pagePath":"pages/home/home","text":"","iconPath":"static/tabbar/home.png","selectedIconPath":"static/tabbar/home_act.png"},{"pagePath":"pages/company/company","text":"","iconPath":"static/tabbar/company.png","selectedIconPath":"static/tabbar/company_act.png"},{"pagePath":"pages/drawback/drawback","text":"","iconPath":"static/tabbar/drawback_us_pro.png","selectedIconPath":"static/tabbar/drawback_act_us_pro.png"},{"pagePath":"pages/vip/vip","text":"","iconPath":"static/tabbar/vip.png","selectedIconPath":"static/tabbar/vip_act.png"},{"pagePath":"pages/mine/mine","text":"","iconPath":"static/tabbar/mine.png","selectedIconPath":"static/tabbar/mine_act.png"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"YunMeng","compilerVersion":"3.3.11","entryPagePath":"pages/home/home","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/home","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom"}},{"path":"/pages/home/detail","meta":{},"window":{"enablePullDownRefresh":true}},{"path":"/pages/home/content","meta":{},"window":{}},{"path":"/pages/company/company","meta":{"isQuit":true,"isTabBar":true},"window":{"titleNView":{"buttons":[{"text":"Rule Intro","fontSize":"14px","color":"#000000","width":"80px"}]}}},{"path":"/pages/company/introduce","meta":{},"window":{}},{"path":"/pages/drawback/drawback","meta":{"isQuit":true,"isTabBar":true},"window":{"enablePullDownRefresh":true}},{"path":"/pages/drawback/payDeatil","meta":{},"window":{}},{"path":"/pages/drawback/orderDeatil","meta":{},"window":{}},{"path":"/pages/energy/energy","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/energy/payDeatil","meta":{},"window":{}},{"path":"/pages/energy/orderDeatil","meta":{},"window":{}},{"path":"/pages/miner/miner","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/miner/payDeatil","meta":{},"window":{}},{"path":"/pages/miner/orderDeatil","meta":{},"window":{}},{"path":"/pages/vip/vip","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/vip/level","meta":{},"window":{}},{"path":"/pages/mine/mine","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/mine/forgetCPwd","meta":{},"window":{}},{"path":"/pages/mine/wallet/wallet","meta":{},"window":{}},{"path":"/pages/mine/yuebao/yeb","meta":{},"window":{"enablePullDownRefresh":true}},{"path":"/pages/mine/yuebao/mingxi","meta":{},"window":{"enablePullDownRefresh":true}},{"path":"/pages/mine/discount/list","meta":{},"window":{"enablePullDownRefresh":true}},{"path":"/pages/mine/discount/mingxi","meta":{},"window":{"enablePullDownRefresh":true}},{"path":"/pages/mine/deal","meta":{},"window":{"enablePullDownRefresh":true}},{"path":"/pages/mine/wallet/bankCard","meta":{},"window":{}},{"path":"/pages/mine/wallet/recharge","meta":{},"window":{}},{"path":"/pages/mine/wallet/rechargeSuc","meta":{},"window":{}},{"path":"/pages/mine/wallet/withDraw","meta":{},"window":{}},{"path":"/pages/mine/expandLink","meta":{},"window":{"transparentTitle":"auto"}},{"path":"/pages/mine/languages","meta":{},"window":{}},{"path":"/pages/login/register","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/login/login","meta":{},"window":{"navigationStyle":"custom"}},{"path":"/pages/login/forgetPwd","meta":{},"window":{}},{"path":"/components/asyncError/asyncError","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
