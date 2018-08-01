<template>
  <div class="bind-relative">
    <div class="top">
      <h3 class="title">【{{typeid === 2 ? '家属' : typeid === 1 ? '租户' : ''}}】会员注册审核</h3>
      <div class="sub-title">绑定居住房源，获得物业专属服务权益</div>
    </div>
    <div class="content">
      <p class="tip title"><b v-if="member">{{member.NickName}}</b>要以【{{typeid === 2 ? '家属' : typeid === 1 ? '租户' : ''}}】身份注册会员，以下是注册信息，请确认是否属实。如果审核通过，用户将以业主等同身份享受您所在物业的服务！</p>
      <p class="tip">* 请选择房源</p>
      <x-select
        v-model="selectedItem"
        placeholder="请选择房源"
        class="roundbar"
      >
        <x-option
          v-for="(item, index) in houseList"
          :key="'myhouse-'+index+Math.random().toString(36).substr(2)"
          :label="item.label"
          :value="item.value"
        ></x-option>
      </x-select>
      <p class="tip">* 姓名</p>
      <XInput v-model="form.name" readonly placeholder="请输入姓名"/>
      <p class="tip">* 身份证</p>
      <XInput  v-model="form.id" :readonly="member && member.CertNumber !== ''" placeholder="请输入身份证"/>
      <p class="tip">* 手机号码</p>
      <XInput v-model="form.tel" readonly placeholder="请输入手机号码" htmlType="tel"/>
      <Btn type="primary" size="lar" text="提交" @click="submitHandler"/>
      <Btn type="default" size="lar" text="取消" @click="back"/>
    </div>
  </div>
</template>
<script>
import {
  Icon,
  XInput,
  XSelect,
  XOption,
  Btn
} from 'components'
import api from 'common/api'
import wxConf from 'common/utils/wxConf'
export default {
  name: 'BindOwnerConfirm',
  components: {
    Icon,
    XInput,
    Btn,
    XSelect,
    XOption
  },
  data () {
    return {
      houseList: [],
      selectedItem: '',
      form: {
        name: '',
        tel: '',
        id: ''
      },
      member: null,
      typeid: null,
      memberid: null
    }
  },
  created () {
    this.typeid = parseInt(this.$route.params.typeid)
    this.memberid = parseInt(this.$route.params.memberid)
    this.getMyhouse()
    this.getApplier()
  },
  watch: {
    '$route' (to, from) {
      this.typeid = parseInt(to.params.typeid)
      this.memberid = parseInt(to.params.memberid)
      this.getMyhouse()
      this.getApplier()
    }
  },
  methods: {
    getMyhouse () {
      let _self = this
      api.bind.getMyHouse()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          if (res.data.Data.length < 1) {
            let index = window.$alert({
              content: '您还未绑定房源，<br/>请先去绑定房源',
              yes () {
                window.$close(index)
                _self.$router.push({
                  name: 'bind'
                })
              }
            })
          } else {
            let houseList = res.data.Data
            this.houseList = houseList.map(item => {
              return {
                label: item.ProjectName + '--' + item.Building + ' - ' + item.Unit + '单元' + item.HouseNo,
                value: item.ID
              }
            })
          }
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getApplier () {
      api.bind.getApplier(this.memberid)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.member = res.data.Data
          if (this.member) {
            this.form = {
              name: this.member.Name,
              tel: this.member.Tel,
              id: this.member.CertNumber
            }
          }
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getPass () {
      let _self = this
      let opt = {
        HouseID: this.selectedItem.value,
        MemberID: this.memberid,
        Type: this.typeid
      }
      api.bind.getPass(opt)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '已审核通过！',
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
    },
    submitHandler () {
      if (!this.selectedItem.value) {
        window.$alert('请选择房源')
        return
      }
      this.getPass()
    },
    back () {
      if (window.history.length >= 2) {
        window.history.go(-1)
      } else {
        if (window.wx) {
          wxConf.closeWindow()
        } else {
          window.close()
        }
      }
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
    height: p2r(200);
    background: lighten($primary-color,5%);
    color:#fff;
    text-align: center;
    line-height: 1.5;
    text-shadow: 1px 1px 2px rgba(0,0,0,.4);
    .title{
      padding-top: p2r(30);
      font-size: p2r(50);
    }
    .sub-title{
      font-size: p2r(24);
      font-weight: 200;
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
    .x-input,
    .x-select{
      display: block;
      width:100%;
      height: p2r(90);
      margin-top: p2r(20);
    }
    .btn{
      width:100%;
      margin-top: p2r(40);
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
