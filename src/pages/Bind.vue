<template>
  <div class="bind">
    <div class="logo">
      <img src="static/images/logo.png" alt="" />
    </div>
    <flexbox class="entries" wrap="wrap" justify="justify">
      <flexbox-item class="entry middle">
        <router-link to="/bind/bindowner" tag="div" class="entry-wrapper">
          <Icon class="icon" name="user"/>
          <span class="text">我是业主</span>
        </router-link>
      </flexbox-item>
      <flexbox-item class="entry middle">
         <router-link to="/bind/bindrelative" tag="div" class="entry-wrapper">
            <Icon class="icon" name="group"/>
            <span class="text">我是家属</span>
          </router-link>
      </flexbox-item>
      <flexbox-item class="entry middle">
        <router-link to="/bind/bindrenter" tag="div" class="entry-wrapper">
          <Icon class="icon" name="rent"/>
          <span class="text">我是租户</span>
        </router-link>
      </flexbox-item>
      <flexbox-item class="entry middle">
        <router-link to="/bind/bindsecond" tag="div" class="entry-wrapper">
          <Icon class="icon" name="second-user"/>
          <span class="text">二手房业主</span>
        </router-link>
      </flexbox-item>
    </flexbox>
    <p class="tip">
      绑定房源可享受更多服务
    </p>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  Icon
} from 'components'
export default {
  name: 'Bind',
  components: {
    Flexbox,
    FlexboxItem,
    Icon
  },
  computed: {
    identity () {
      return this.$store.state.userInfo.state
    }
  },
  watch: {
    identity (newVal, oldVal) {
      if (newVal === 0) {
        this.$router.replace({
          name: 'regist'
        })
      }
    }
  },
  created () {
    if (this.identity === 0) {
        this.$router.replace({
          name: 'regist'
        })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.bind{
  width:100vw;
  height: 100vh;
  padding-top: p2r(30);
  background:$primary-color url('../../static/images/bindtop.png') center/cover no-repeat;
  .logo{
    width:p2r(360);
    height: p2r(234);
    margin: p2r(70) auto 0;
  }
  .entries{
    margin-top: p2r(162);
    padding:p2r($base-padding);
    .entry{
      background: #fff;
      height:p2r(200);
      border-radius: 4px;
      margin-top: p2r(30);
      box-shadow: 1px 1px 2px 0 rgba(0,0,0,.2);
      display: table;
      .entry-wrapper{
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        font-size: 0;
        .icon{
          font-size: p2r(56);
          height:p2r(56);
          color:$primary-color;
          display: inline-block;
          vertical-align: top;
        }
        .text{
          color:$primary-color;
          font-size: p2r(36);
          height:p2r(56);
          display: inline-block;
          vertical-align: top;
        }
      }
      &.large{
        flex:0 0 100%;
        width: 100%;
        line-height: p2r(200);
        .icon{
          margin-right: p2r(10);
        }
      }
      &.middle{
        flex:0 0 47%;
        width: 47%;
        .icon{
          margin-top: p2r(30);
        }
        .text{
          display: block;
          margin-top: p2r(10);
        }
      }
    }
  }
  .tip{
    margin-top: p2r(90);
    color:#fff;
    font-weight: 200;
    padding:0 p2r(140);
    line-height: 1.4;
    text-align: center;
  }
}
</style>
