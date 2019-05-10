<template>
  <div class="bind-relative">
    <div class="top">
      <Icon name="group" />
      <p>【租户】房产绑定</p>
    </div>
    <div class="content">
      <p class="tip">* 请输入姓名</p>
      <XInput v-model="form.name" :readonly="readonly" placeholder="请输入姓名"/>
      <p class="tip">* 请输入身份证</p>
      <XInput  v-model="form.id" :readonly="readonly" placeholder="请输入身份证"/>
      <p class="tip">* 请输入手机号码</p>
      <XInput v-model="form.tel" :readonly="readonly" placeholder="请输入手机号码" htmlType="tel"/>
      <p class="tip">租户绑定房源，必须业主审核，<br/>请将此页面转发给业主，提醒业主审核您的家属身份。</p>
      <Btn type="primary" size="lar" text="提交" @click="submitHandler"/>
      <Btn type="default" size="lar" text="返回" @click="$router.go(-1)"/>
    </div>
    <transition name="fade">
      <div class="share" v-if="showShare" @click="toggleShare"></div>
    </transition>
  </div>
</template>
<script>
import {
  Icon,
  XInput,
  Btn
} from 'components'
import {
  NAME_REG,
  TEL_REG
} from 'common/data'
import api from 'common/api'
import wx from 'weixin-js-sdk'
export default {
  name: 'BindRelative',
  components: {
    Icon,
    XInput,
    Btn
  },
  data () {
    return {
      showShare: false,
      form: {
        name: '',
        tel: '',
        id: ''
      },
      user: null,
      typeid: 2,
      memberid: null
    }
  },
  computed: {
    readonly () {
      return !!this.user
    },
    wxReady () {
      return this.$store.state.global.wxReady
    }
  },
  created () {
    this.getMemberInfo()
    // 获取个人微信昵称
    this.$store.dispatch('getInfoAsync')
  },
  methods: {
    getMemberInfo () {
      api.bind.getMemberInfo()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.user = res.data.Data
          if (this.user) {
            this.form = {
              name: this.user.Name,
              tel: this.user.Tel,
              id: this.user.CertNumber
            }
          } else {
            this.form = {
              name: '',
              tel: '',
              id: ''
            }
          }
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeShare () {
      let shareData = {
          title: `${this.$store.state.userInfo.nickname}申请加入武汉地产`,
          desc: '请审核身份真实有效性后进行绑定',
          link: location.origin + location.pathname + `#/bind/bindownerconfirm/type/${this.typeid}/member/${this.memberid}`,
          imgUrl: 'https://whdc.1juke.cn/whdcMicro/static/images/logo.png'
      }
      wx.onMenuShareAppMessage(shareData)
      wx.updateAppMessageShareData(shareData)
    },
    getRegist () {
      // let _self = this
      api.bind.memberRegist(this.form.name, this.form.tel, this.form.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.memberid = res.data.Data.ID
          this.changeShare()
          let index = window.$alert({
            title: '申请已提交！',
            content: '点击右上角，将本页面转发给已绑定的业主审核，<br/>待业主审核通过后才能完成租户注册流程！',
            yes () {
              window.$close(index)
              // _self.toggleShare()
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitHandler () {
      if (!this.form.name) {
        window.$alert('姓名不能为空')
        return
      }
      if (!this.form.name.match(NAME_REG)) {
        window.$alert('请填写正确格式的姓名')
        return
      }
      if (!this.form.id) {
        window.$alert('身份证号码不能为空')
        return
      }
      // if (!this.form.id.match(ID_REG)) {
      //   window.$alert('请填写正确格式的身份证号码')
      //   return
      // }
      if (!this.form.tel) {
        window.$alert('手机号码不能为空')
        return
      }
      if (!this.form.tel.match(TEL_REG)) {
        window.$alert('请填写正确格式的手机号码')
        return
      }
      this.getRegist()
    },
    toggleShare () {
      this.showShare = !this.showShare
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.bind-relative{
  .top{
    padding-top: p2r(20);
    width:100%;
    height: p2r(240);
    background: lighten($primary-color,5%);
    color:#fff;
    font-size: p2r(40);
    text-align: center;
    line-height: 1.5;
    text-shadow: 1px 1px 2px rgba(0,0,0,.4);
    .iconfont{
      font-size: p2r(80);
    }
  }
  .content{
    padding:p2r($base-padding) p2r(45);
    .tip{
      color:$primary-color;
      font-size: p2r(26);
      margin-top: p2r(30);
      font-weight: 200;
      line-height: 1.4;
      &:first-child{
        margin-top: 0;
      }
    }
    .x-input{
      display: block;
      height: p2r(90);
      margin-top: p2r(15);
    }
    .btn{
      width:100%;
      margin-top: p2r(30);
    }
  }
  .share{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.7);
    top:0;
    left:0;
    z-index: 99999999;
  }
}
</style>
