<template>
  <div class="qrcode-check">
    <div class="result">
      <img :src="resImg" class="res-img" alt="" />
      <p class="res-info" :class="state === 1 ? 'fail' : 'succ'">{{info}}</p>
    </div>
    <Btn type="base" size="lar" text="确定" @click="closeWXwindow"/>
  </div>
</template>
<script>
import {
  Btn
} from 'components'
import api from 'common/api'
import wx from 'weixin-js-sdk'
export default {
  name: 'QRCodeCheck',
  components: {
    Btn
  },
  data () {
    return {
      id: null,
      state: ''
    }
  },
  computed: {
    resImg () {
      return this.state === 1 ? 'static/images/rsfail.png' : 'static/images/rssuc.png'
    },
    info () {
      return this.state === 0
             ? '恭喜您，签到成功！'
             : this.state === 1
             ? '对不起，您还未报名此活动！'
             : '您好，您已经签到成功！'
    }
  },
  created () {
    this.id = parseInt(this.$route.params.id)
    this.check()
  },
  watch: {
    '$route' (to, from) {
      this.id = parseInt(to.params.id)
      this.check()
    }
  },
  methods: {
    check () {
      api.activity.qrcodeCheck(this.id)
      .then(({res, idnex}) => {
        if (res.data.IsSuccess) {
          this.state = res.data.Data
          // window.$alert(res.data.Data)
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    closeWXwindow () {
      wx.closeWindow()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.qrcode-check{
  width: 100vw;
  height: 100vh;
  position: relative;
  background: url('../../static/images/rsbg.png') center/cover no-repeat;
  .result{
    padding-top: p2r(240);
    text-align: center;
    .res-img{
      width: p2r(240);
      height: p2r(220);
    }
    .res-info{
      color:#fff;
      font-size: p2r(36);
      margin:p2r(70) p2r(50);
    }
  }
  .btn{
    position: absolute;
    bottom: p2r(100);
    left: 50%;
    margin-left: p2r(-300) !important;
  }
}
</style>
