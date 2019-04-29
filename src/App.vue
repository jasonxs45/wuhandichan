<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
// swiper
.swiper-pagination-bullets{
  .swiper-pagination-bullet{
    background: #ffffff;
    width:6px;
    height:6px;
    &.swiper-pagination-bullet-active{
      width: 12px;
      border-radius: 12px;
    }
  }
}
//  报修弹窗
.rs-alertbox{
  &.layui-m-layerchild{
    background: url('/static/images/rsbg.png') center/cover no-repeat;
    .icon{
      width:p2r(240);
      margin:p2r(60) auto;
    }
    .title{
      color:#fff;
      font-size: p2r(40);
    }
    .text{
      color:#fff;
      font-size: p2r(26);
    }
    .layui-m-layerbtn{
      border-top:none;
      display: block;
      width:p2r(500);
      margin: p2r(40) auto p2r(80);
      border-radius: 25px;
      height: auto;
      line-height: auto;
      box-shadow: 0 1px 8px 1px lighten($primary-color, 10%);
      overflow: hidden;
      span{
        text-align: center;
        padding:p2r(30) 0;
        line-height: 1;
        font-size: p2r(36);
        background:#fff;
        color:$primary-color;
      }
    }
  }
}
// 一些过渡
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform .2s;
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100%);
}
.slide-in-right-enter-active, .slide-in-right-leave-active{
  transition: transform .2s;
}
.slide-in-right-enter, .slide-in-right-leave-to{
  transform: translateX(100%);
}
.clearfix{
  clear: both;
}
</style>
