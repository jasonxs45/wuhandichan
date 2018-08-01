<template>
  <div class="modify">
    <div class="modify-wrapper">
      <flexbox class="border">
        <flexbox-item class="fh">
          姓名
        </flexbox-item>
        <flexbox-item class="fb">
          <input
            v-model="name"
            type="text"
            placeholder="请输入您的姓名"
            class="input"
          />
        </flexbox-item>
      </flexbox>
      <flexbox class="border">
        <flexbox-item class="fh">
          电话
        </flexbox-item>
        <flexbox-item class="fb">
          <input
            v-model="tel"
            type="tel"
            placeholder="请输入新的手机号码"
            class="input"
          />
        </flexbox-item>
      </flexbox>
      <flexbox class="border area">
        <flexbox-item class="fh">
          收件地址
        </flexbox-item>
        <flexbox-item class="fb">
          <input
            v-model="address"
            type="text"
            readonly
            placeholder="完善收件地址"
            class="input"
            @click="toggoleShowArea"
            @focus="focus"
          />
          <Icon name="arrow-right1"/>
        </flexbox-item>
      </flexbox>
    </div>
    <Btn
      type="primary"
      size="lar"
      text="确认修改"
      class="submit"
      @click="submitHandler"
    />
    <Btn
      type="default"
      size="lar"
      text="返回"
      class="back"
      @click="goBack"
    />
    <transition name="slide-in-right">
      <div v-show="showAreaPage" class="area-pick-page">
        <flexbox class="border">
          <flexbox-item class="fh">
            所在地区
          </flexbox-item>
          <flexbox-item class="fb">
            <area-picker
              border
              class="area-pick"
              @selected="getArea"
            ></area-picker>
          </flexbox-item>
        </flexbox>
        <flexbox class="border area">
          <flexbox-item class="fh">
            详细地址
          </flexbox-item>
          <flexbox-item class="fb">
            <input
              v-model="desc"
              type="text"
              placeholder="街道、楼牌号等"
              class="input"
            />
          </flexbox-item>
        </flexbox>
        <div class="btns">
          <Btn
            type="primary"
            size="lar"
            text="确定"
            @click="changeArea"
          />
          <Btn
            type="default"
            size="lar"
            text="取消"
            @click="toggoleShowArea"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  AreaPicker,
  Flexbox,
  FlexboxItem,
  Icon,
  Btn
} from 'components'
import api from 'common/api'
import {
  NAME_REG,
  TEL_REG
} from 'common/data'
export default {
  name: 'Modify',
  components: {
    AreaPicker,
    Flexbox,
    FlexboxItem,
    Icon,
    Btn
  },
  data () {
    return {
      name: '',
      tel: '',
      address: null,
      showAreaPage: false,
      pickedArea: '',
      desc: ''
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    focus (e) {
      e.target.blur()
    },
    goBack () {
      this.$router.go(-1)
    },
    getArea (val) {
      this.pickedArea = val
    },
    toggoleShowArea () {
      this.showAreaPage = !this.showAreaPage
    },
    changeArea () {
      if (!this.pickedArea) {
        window.$alert('请选择地区')
        return
      }
      if (!this.desc) {
        window.$alert('请填写详细地址')
        return
      }
      this.address = this.pickedArea + this.desc
      this.showAreaPage = false
    },
    getInfo () {
      api.modify.get()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.name = res.data.Data.Name
          this.tel = res.data.Data.Tel
          this.address = res.data.Data.Address
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitHandler () {
      if (!this.name.match(NAME_REG)) {
        window.$alert('请填写正确格式的姓名')
        return
      }
      if (!this.tel.match(TEL_REG)) {
        window.$alert('请填写正确格式的手机号码')
        return
      }
      if (!this.address) {
        window.$alert('请完善收件地址')
        return
      }
      let _self = this
      api.modify.save(this.name, this.tel, this.address)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            title: '恭喜您',
            content: '资料修改成功！',
            yes () {
              _self.$router.push({
                name: 'usercenter'
              })
              window.$close(index)
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
.modify{
  width: 100vw;
  height: 100vh;
  .modify-wrapper{
    min-height: 100%;
    padding: p2r($base-padding) p2r($base-padding) p2r(300);
  }
  .border{
    margin:p2r(30) 0;
    position: relative;
    @include _1px();
    &:first-child{
      margin-top: 0;
    }
    &.area{
      .iconfont{
        position: absolute;
        right:0;
        top:0;
        height: p2r(90);
        line-height: p2r(90);
        font-size: p2r(24);
        color: $thr-color;
      }
    }
    .fh{
      flex: 0 0 p2r(120);
      width: p2r(120);
      font-size: p2r(28);
      font-weight: 200;
      color: $text-sub-color;
      height: p2r(90);
      line-height: p2r(90);
    }
    .fb{
      .input{
        display: block;
        width:100%;
        height: 100%;
        padding:0 p2r(30);
        font-size: p2r(28);
        background: none;
        -webkit-appearance: none;
        outline: none;
        color:$text-color;
        &::-webkit-input-placeholder{
          color:lighten($text-sub-color, 20%);
          font-weight: 200;
        }
      }
    }
  }
  .x-input{
    margin: p2r(30) 0 0;
    height: p2r(90);
    line-height: p2r(90);
    border-radius: 0;
    background: none;
    border:none;
    color: $text-color;
    @include _1px();
    &:first-child{
      margin-top: 0;
    }
    &.block{
      display: block;
    }
  }
  .submit{
    position: relative;
    margin-top: p2r(-280);
  }
  .back{
    position: relative;
    margin-top: p2r(30);
  }
  .area-pick-page{
    position: fixed;
    width:100%;
    height: 100%;
    top:0;
    left:0;
    background: #fff;
    z-index:1;
    padding: p2r($base-padding);
    .btns{
      position: absolute;
      bottom: 0;
      left:0;
      width: 100%;
      .btn{
        margin: p2r(40) auto;
      }
    }
  }
}
</style>
