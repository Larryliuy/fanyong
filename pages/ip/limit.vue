<template>
  <view class="page-box column-center">
    <div class="ip-limit"></div>
    <div>{{$t('xf_ipLimit')}}</div>
  </view>
</template>
<style lang="scss">
.page-box {
  display: flex;
  padding-top: 25vh;

  .ip-limit {
    width: 30vw;
    height: 30vw;
    background: url(../../static/imgs/ip_limit.png);
    background-size: 100% 100%;
    margin-bottom: 2vh;
  }
}
</style>
