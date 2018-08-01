<template>
<div class="bind-second">
  <div class="top">
    <Icon name="second-user" />
    <p>【二手业主】房产绑定</p>
  </div>
  <div class="content">
    <p class="tip">* 请选择所在项目</p>
    <x-select v-model="form.project" placeholder="请选择所在项目">
      <x-option
        v-for="(item, index) in items"
        :key="'item-'+index+Math.random().toString(36).substr(2)"
        :label="item.label"
        :value="item.value"
      ></x-option>
    </x-select>
    <p class="tip">* 请输入所在楼栋</p>
    <XInput v-model="form.building" placeholder="请输入楼栋"/>
    <p class="tip">* 请输入所在单元</p>
    <XInput v-model="form.unit" placeholder="请输入单元"/>
    <p class="tip">* 请输入房号</p>
    <XInput v-model="form.houseid" placeholder="请输入房号"/>
    <p class="tip">* 请输入申请人的姓名</p>
    <XInput v-model="form.name" placeholder="请输入2-6位中文"/>
    <p class="tip">* 请输入身份证</p>
    <XInput  v-model="form.id" placeholder="请输入身份证"/>
    <p class="tip">* 请输入手机号码</p>
    <XInput v-model="form.tel" placeholder="请输入手机号码" htmlType="tel"/>
    <p class="tip">* 请上传买卖合同、房产证及身份证正反面照片</p>
    <img-row
      :group="uploadedImgs"
      :canUpload="true"
      :maxCount="9"
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
    <Btn type="primary" size="lar" text="提交" @click="submitHandler"/>
  </div>
</div>
</template>
<script>
import {
  Icon,
  XSelect,
  XOption,
  XInput,
  Btn,
  ImgRow,
  ImgCell,
  Fitimg
} from 'components'
import api from 'common/api'
import {
  NAME_REG,
  TEL_REG,
  ID_CHECK
} from 'common/data'
export default {
  name: 'BindSecond',
  components: {
    Icon,
    XSelect,
    XOption,
    XInput,
    Btn,
    ImgRow,
    ImgCell,
    Fitimg
  },
  data () {
    return {
      form: {
        project: '',
        building: '',
        unit: '',
        houseid: '',
        name: '',
        id: '',
        tel: ''
      },
      items: null,
      uploadedImgs: []
    }
  },
  created () {
    this.getItem()
  },
  methods: {
    getItem () {
      api.bind.getStageList()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let [...items] = res.data.Data
          this.items = items.map(item => {
            return {
              label: item.Name,
              value: item.ID
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
      if (!this.form.project) {
        window.$alert('请选择项目')
        return
      }
      if (!this.form.building) {
        window.$alert('请输入楼 - ')
        return
      }
      if (!this.form.unit) {
        window.$alert('请输入单元')
        return
      }
      if (!this.form.houseid) {
        window.$alert('请输入房号')
        return
      }
      if (!this.form.name.match(NAME_REG)) {
        window.$alert('请填写正确格式的姓名')
        return
      }
      if (!ID_CHECK(this.form.id)) {
        window.$alert('请填写正确的身份证号码')
        return
      }
      if (!this.form.tel.match(TEL_REG)) {
        window.$alert('请填写正确格式的手机号码')
        return
      }
      if (!this.uploadedImgs.length) {
        window.$alert('请上传房产证及身份证正反面照片')
        return
      }
      let opt = {
        StageID: this.form.project.value,
        Building: this.form.building,
        Unit: this.form.unit,
        HouseNo: this.form.houseid,
        Name: this.form.name,
        Tel: this.form.tel,
        Images: this.uploadedImgs.join(','),
        CertNumber: this.form.id
      }
      let _self = this
      api.bind.secondApply(opt)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '提交成功，请等待工作人员审核！',
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
    uploadImg (res) {
      // alert(res)
      this.uploadedImgs.push(res)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.bind-second {
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
      color:$text-sub-color;
      font-size: p2r(26);
      margin-top: p2r(30);
      font-weight: 200;
      line-height: 1.4;
      &:first-child{
        margin-top: 0;
      }
    }
    .x-select,
    .x-input{
      display: block;
      width:100%;
      height: p2r(90);
      margin-top: p2r(15);
    }
    .btn{
      width:100%;
      margin: {
        top: p2r(100);
        bottom: p2r(60);
      }
    }
  }
}
</style>
