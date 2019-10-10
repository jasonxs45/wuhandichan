<template>
  <div class="regist">
    <div class="logo">
      <img src="static/images/logo.png" alt="" />
    </div>
    <div class="input-area">
      <XInput v-model="name" classType="bottom-line" placeholder="请输入您的姓名" class="fr"/>
      <!-- <XInput v-model="id" classType="bottom-line" placeholder="请输入您的身份证号" class="fr"/> -->
      <flexbox class="fr hang">
        <flexbox-item class="code-input">
          <XInput v-model="tel" class="code" classType="bottom-line" placeholder="请输入您的手机号" />
        </flexbox-item>
        <flexbox-item class="code-btn">
          <Btn :text="btnText" :disabled="this.countDown > 0" @click="sendMsg"/>
        </flexbox-item>
      </flexbox>
      <XInput v-model="code" classType="bottom-line" placeholder="请输入您收到的短信验证码" class="fr"/>
    </div>
    <label class="about-rule">
      <input type="checkbox" v-model="checked">
      <Icon :name="checked ? 'checkbox-checked' : 'checkbox'" />
      <span class="text">我已阅读并同意</span>
      <span class="link" @click="openRule">《会员注册协议》</span>
    </label>
    <Btn
      type="primary"
      size="lar"
      text="提交"
      class="submit"
      :disabled="!checked"
      @click="submitHandler"
    />
    <transition name="slide-in-right">
      <div v-show="showRule" class="rule">
        <h3 class="title">会员注册协议</h3>
        <div class="wrapper">
          <dl>
            <dd class="p">1、您提交的入会申请一旦通过本会审核后，即成为会员，同时也视为您同意遵守本会之相关守则约束；您务必提供真实、准确、完整的个人资料，以便本会审批您的入会申请。若您提供虚假、不全的资料，将导致本会无法接受您的申请或入会，亦无法享受正常的会员权益；</dd>
            <dd class="p">2、成为会员后，您即有资格接受和享有本会提供的各项服务，会员不得利用本会或本会提供的服务、资料或信息从事任何商业行为或有损本会的行为。若会员的行为对本会造成了损害，违反会员守则，本会有权解除该会员会籍，停止会员拥有的任何权利，不再有权接收及享有本会提供的各项优惠及服务，如情节严重者，将通过法律途径维护本会及其他会员的权益；</dd>
            <dd class="p">3、本会有权对本会会员守则进行酌情更改，并以本会认为合适的任何方式通知您，本会对此及后果不承担任何责任；</dd>
            <dd class="p">4、如您打算退出本会，则表示您自动放弃享受会员专属的所有权益，您可直接解绑；</dd>
            <dd class="p">5、本会拥有对入会章程条款的最终解释权。</dd>
          </dl>
        </div>
        <Btn text="我知道了" size="lar" @click="toggleRule"/>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  XInput,
  Flexbox,
  FlexboxItem,
  Btn,
  Icon
} from 'components'
import {
  NAME_REG,
  TEL_REG
} from 'common/data'
import api from 'common/api'
export default {
  name: 'Regist',
  components: {
    XInput,
    Flexbox,
    FlexboxItem,
    Btn,
    Icon
  },
  data () {
    return {
      checked: false,
      showRule: false,
      name: '',
      id: '',
      tel: '',
      code: '',
      hotCode: '',
      countDown: 0
    }
  },
  computed: {
    btnText () {
      return this.countDown === 0 ? '获取验证码' : `${this.countDown}s后再试`
    }
  },
  methods: {
    count () {
      this.countDown = 60
      let timer = setInterval(() => {
        if (this.countDown <= 0) {
          clearInterval(timer)
          this.countDown = 0
        } else {
          this.countDown--
        }
      }, 1000)
    },
    sendMsg () {
      if (!this.tel.match(TEL_REG)) {
        window.$alert('请先填写正确格式的电话')
        return
      }
      api.regist.send(this.tel)
      .then(({res, index}) => {
        window.$close(index)
        if (res.data.IsSuccess) {
          this.count()
          window.$alert('已发送，请注意查收！')
          this.hotCode = res.data.Data
        } else {
          if (res.data.Message === '已存在') {
            window.$alert('此手机号码已注册，请更换手机号码')
          } else {
            window.$alert(res.data.Message)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    openRule (e) {
      e.preventDefault()
      this.toggleRule()
    },
    toggleRule () {
      this.showRule = !this.showRule
    },
    submitHandler () {
      let _self = this
      if (!this.name.match(NAME_REG)) {
        window.$alert('请填写正确格式的姓名！')
        return
      }
      // if (!this.id.trim()) {
      //   window.$alert('请填写身份证号！')
      //   return
      // }
      if (!this.tel.match(TEL_REG)) {
        window.$alert('请填写正确格式的电话！')
        return
      }
      // if (this.code !== this.hotCode) {
      //   window.$alert('短信验证码错误！')
      //   return
      // }
      api.regist.submit(this.name, this.tel, this.id, this.code)
      .then(({res, index}) => {
        window.$close(index)
        if (res.data.IsSuccess) {
          let index = window.$alert({
            title: '恭喜您！',
            content: '注册成功！',
            yes () {
              window.$close(index)
              _self.$router.push({
                name: 'usercenter'
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.regist{
  padding: p2r($base-padding);
  .logo{
    width: p2r(360);
    margin: p2r(70) auto p2r(84);
  }
  .hang{
    width: p2r(680);
    margin-left: auto;
    margin-right: auto;
  }
  .input-area{
    text-align: center;
    .fr{
      margin-bottom: p2r(30);
    }
    .x-input{
      width: p2r(680);
      height: p2r(96);
      &.code{
        width: 100%;
        margin-top: 0;
        margin-bottom: 0;
      }
    }
    .code-input{
       width: 100%;
       padding-right: p2r(30);
    }
    .code-btn{
      width: p2r(232);
      flex: 0 0 p2r(232);
      height: p2r(96);
      .btn{
        width: 100%;
        font-size: p2r(26);
      }
    }
  }
  .about-rule{
    display: inline-block;
    margin-top: p2r(40);
    font-size: 0;
    input{
      width:0;
      height: 0;
      opacity: 0;
      -webkit-appearance: none;
    }
    .iconfont,
    .text,
    .link
    {
      font-size: p2r(26);
      color: $primary-color;
      vertical-align: middle;
      display: inline-block;
    }
    .iconfont{
      font-size: p2r(30);
      margin-right: p2r(10);
    }
    .link{
      text-decoration: underline;
    }
  }
  .submit{
    margin-top: p2r(120);
  }
  .rule{
    position: fixed;
    width:100%;
    height: 100%;
    top:0;
    left:0;
    background: #fff;
    padding: p2r($base-padding) 0;
    .title{
      font-size: p2r(36);
      color:$primary-color;
      text-align: center;
    }
    .wrapper{
      margin-top: .5rem;
      height: calc(100% - 5.5rem);
      margin-bottom: 1rem;
      padding:0 p2r($base-padding * 2);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .p{
        font-size: p2r(26);
        line-height: 2;
        color:$text-sub-color;
      }
    }
  }
}
</style>
