<template>
  <div class="trade-progress">
    <div class="top">
      <tabnav class="tab" justify="justify">
        <router-link tag="div" to="/thirdserviceprogress/open" class="tabnav-item">工地开放验房查询</router-link>
        <router-link tag="div" to="/thirdserviceprogress/deliver" class="tabnav-item">集中交付验房查询</router-link>
      </tabnav>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import {
  Tabnav
} from 'components'
export default {
  name: 'ThirdServiceProgress',
  components: {
    Tabnav
  },
  computed: {
    state () {
      return this.$store.state.userInfo.state
    }
  },
  watch: {
    state (newVal, oldVal) {
      if (newVal !== 3) {
        // this.checkIdentity()
      }
    }
  },
  created () {
    // this.checkIdentity()
  },
  methods: {
    checkIdentity () {
      if (this.$store.state.userInfo.state && this.$store.state.userInfo.state !== 3) {
        let index = window.$alert({
          title: '对不起',
          content: '请先绑定业主身份！',
          yes: () => {
            window.$close(index)
            this.$router.replace({
              name: 'bindowner'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
  .trade-progress{
    width:100vw;
    height: 100vh;
    .top{
      width: 100%;
      height: p2r(300);
      background: url('../../static/images/uctop.png') center/cover no-repeat;
      .tab{
        height: p2r(100);
        background: #fff;
        .tabnav-item{
          height: inherit;
          font-size: p2r(28);
          display: table-cell;
          vertical-align: middle;
          position: relative;
          padding: 0;
          text-align: center;
          &.router-link-active{
            color:$primary-color;
            &:after{
              background:$primary-color;
            }
          }
          &:after{
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            width:50%;
            left:25%;
            height:4px;
            border-radius: 25px;
          }
        }
      }
    }
  }
</style>
