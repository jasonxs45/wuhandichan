<template>
  <div class="page-not-found">
    <h3 class="title">
      404
    </h3>
    <p class="text">对不起，页面未找到</p>
    <img src="static/images/logo.png" alt="" class="logo1" />
  </div>
</template>
<script>
export default {
  name: 'PageNotFound'
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.page-not-found{
  width:100vw;
  height: 100vh;
  background: $background-color;
  .title{
    padding-top: p2r(120);
    text-align: center;
    font-size: p2r(120);
    color:$text-sub-color;
    font-weight: 600;
  }
  .text{
    margin-top: p2r(60);
    text-align: center;
    font-size: p2r(40);
    color:$text-sub-color;
  }
  .logo1,
  .logo2{
    width: p2r(280);
    display: block;
    margin:p2r(50) auto;
  }
  .logo1{
    width: p2r(320);
    margin-top: p2r(100);
  }
}
</style>
