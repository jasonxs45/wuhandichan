<template>
<div class="advise-submit">
  <!-- <div class="top">
    <img src="static/images/rstop.jpg" alt="" />
  </div> -->
  <!-- <div class="logo">
    <Icon name="info"/>
  </div> -->
  <div class="panel-group">
    <div class="panel">
      <h3 class="title">选择类别及小区</h3>
      <x-select
        v-model="form.category"
        placeholder="请选择类别"
      >
        <x-option
          v-for="(item, index) in categories"
          :key="'category-'+index"
          :label="item"
          :value="item"
        ></x-option>
      </x-select>
      <x-select
        v-model="form.house"
        :options="houses"
        placeholder="请选择房源"
      >
        <x-option
          v-for="(item, index) in houses"
          :key="'house-'+index"
          :label="item.StageName+ ' ' + item.Building+' - '+item.Unit+'单元'+item.HouseNo"
          :value="item.ID"
        ></x-option>
      </x-select>
    </div>
    <div class="panel">
      <h3 class="title">填写详情</h3>
      <XTextarea
        v-model="form.desc"
        placeholder="请输入您要填写的具体内容"
        class="desc"
      />
      <p class="tips">上传照片（最多四张）</p>
      <img-row
        :group="uploadedImgs"
        :canUpload="true"
        @on-upload="uploadImg"
      >
        <img-cell
          v-for="(item, index) in uploadedImgs"
          :index="index"
          :canUpload="true"
          :del="true"
          :group="uploadedImgs"
          :key="'upimg-'+index"
        >
          <Fitimg :src="item"/>
        </img-cell>
      </img-row>
    </div>
  </div>
  <Btn
    text="提交"
    size="lar"
    class="submit"
    @click="submitHandler"
  />
  <div class="bottom">
    <!-- <img src="static/images/rsbot.jpg" alt="" srcset=""> -->
  </div>
</div>
</template>
<script>
import {
  Icon,
  XSelect,
  XOption,
  Flexbox,
  FlexboxItem,
  Split,
  XTextarea,
  Fitimg,
  Btn,
  ImgRow,
  ImgCell
} from 'components'
import api from 'common/api'
// import wx from 'weixin-js-sdk'
export default {
  name: 'AdviseSubmit',
  components: {
    Icon,
    XSelect,
    XOption,
    Flexbox,
    FlexboxItem,
    Split,
    XTextarea,
    Fitimg,
    Btn,
    ImgRow,
    ImgCell
  },
  data () {
    return {
      categories: [
        '表扬',
        '投诉',
        '建议'
      ],
      houses: [],
      uploadedImgs: [],
      form: {
        category: '',
        house: '',
        desc: ''
      }
    }
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
    this.getHouses()
  },
  methods: {
    checkIdentity () {
      if (this.$store.state.userInfo.state !== null && this.$store.state.userInfo.state !== 3) {
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
    },
    getHouses () {
      api.myHouse.list()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.houses = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    uploadImg (res) {
      this.uploadedImgs.push(res)
    },
    submitHandler () {
      if (!this.form.category.value) {
        window.$alert('请选择类别')
        return
      }
      if (!this.form.house.value) {
        window.$alert('请选择房源')
        return
      }
      if (!this.form.desc) {
        window.$alert('请填写具体内容')
        return
      }
      let Type = this.form.category.value
      let HouseID = this.form.house.value
      let Content = this.form.desc
      let Images = this.uploadedImgs.join(',')
      let _self = this
      api.advise.submit(Type, HouseID, Content, Images)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            title: '提示',
            content: '提交成功！',
            yes () {
              window.$close(index)
              // wx.closeWindow()
              _self.$router.push({
                name: 'adviseuser',
                params: {
                  state: 'untreated'
                }
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.advise-submit{
  padding:p2r($base-padding);
  background:$primary-color;
  height: 100vh;
  overflow-x:hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .top{
    position: absolute;
    width:100%;
    z-index: 0;
    left:0;
    top:0;
  }
  .logo{
    width:p2r(200);
    height: p2r(200);
    margin:0 auto;
    border-radius: 50%;
    line-height: p2r(200);
    text-align: center;
    position: relative;
    border:1px solid transparent;
    background: linear-gradient(#fff, $primary-color);
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.2);
    background-clip: padding-box;
    overflow: hidden;
    padding:1px;
    .iconfont{
      display:block;
      width:100%;
      height: 100%;
      font-size: p2r(120);
      color:#fff;
      background: $primary-color;
      border-radius: inherit;
    }
  }
  .panel{
    width:100%;
    height:auto;
    padding:p2r(40) p2r(45) p2r(60);
    background: #fff;
    border-radius: 4px;
    margin:p2r(40) 0;
    position: relative;
    &:before,
    &:after{
      content: '';
      display: block;
      width: p2r(20);
      height: p2r(120);
      background: url('../../static/images/chain.png') center/100% 100% no-repeat;
      position: absolute;
      z-index: 2;
      bottom: p2r(-80);
      left: p2r(80);
    }
    &:after{
      left: auto;
      right: p2r(80);
    }
    &:last-child{
      &:before,
      &:after{
        display: none;
      }
    }
    .title{
      font-size: p2r(26);
      text-align: center;
      margin: p2r(20) auto;
      color: $text-sub-color;
    }
    .x-select{
      height: p2r(100);
      margin-top: p2r(50);
    }
    .desc{
      width:100%;
      margin-top: p2r(30);
      font-size: p2r(26);
    }
    .tips{
      color:lighten($text-color, 10%);
      font-size: p2r(24);
      margin-top: p2r(40);
    }
  }
  .submit{
    margin-top: p2r(100);
    font-size: p2r(36) !important;
  }
  .bottom{
    text-align: center;
    margin:p2r(60) p2r(-$base-padding) p2r(-$base-padding);
  }
}
</style>
