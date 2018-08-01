<template>
<div class="repair-submit">
  <div class="panel-group">
    <div class="panel">
      <h3 class="title">选择房源</h3>
      <x-select
        v-model="form.house"
        placeholder="请选择您要报修的房源"
        class="select-house"
      >
        <x-option
          v-for="(item, index) in houses"
          :key="'houses-'+index"
          :label="item.houseFull"
          :value="item.ID"
        ></x-option>
      </x-select>
    </div>
    <div class="panel">
      <h3 class="title">选择具体部位</h3>
      <div class="tags super">
        <flexbox
          wrap="wrap"
          class="tags-row"
        >
          <div
            v-for="(item, index) in supertags"
            :key="'supertag-'+index+item.ID"
            class="radio-tag"
          >
            <span
             :class="item.checked && currentSuperTagIndex === index ? 'checked' : selectedTags.some(item1 => item1.startsWith(item.Name)) ? 'checking' : ''"
             :data-index="index"
             class="text"
             @click="superChangeHandler"
            >{{item.Name}}</span>
          </div>
        </flexbox>
      </div>
      <Split v-if="subtags.length > 0" type="line"/>
      <div class="tags sub">
        <flexbox
          wrap="wrap"
          class="tags-row"
        >
          <div
            v-for="(item, index) in subtags"
            :key="'subtag-'+currentSuperTagIndex+index+item.ID"
            class="radio-tag"
          >
            <span
              :class="item.checked ? 'checked' : ''"
              :data-index="index"
              class="text"
              @click="subChangeHandler"
            >{{item.Name}}</span>
          </div>
        </flexbox>
      </div>
      <Split type="line"/>
      <div class="selected-info">
        <h3 class="head">已选部位：</h3>
        <div class="body">
          <div
            v-for="(item, index) in selectedTags"
            :key="'st-'+index"
            class="selected-tag"
          >
            <span class="text">{{item}}</span>
          </div>
        </div>
      </div>
      <XTextarea
        v-model="form.desc"
        placeholder="请输入您要报修的具体内容"
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
    <div class="panel">
      <h3 class="title">联系人信息</h3>
      <XInput
        v-model="form.name"
        placeholder="联系人姓名"
        class="name"
      />
      <XInput
        v-model="form.tel"
        placeholder="联系人电话"
        htmlType="tel"
        class="tel"
      />
    </div>
  </div>
  <Btn
    text="提交"
    size="lar"
    class="submit"
    @click="submitHandler"
  />
</div>
</template>
<script>
import {
  Icon,
  XInput,
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
import {
  NAME_REG,
  TEL_REG
} from 'common/data'
import api from 'common/api'
export default {
  name: 'RepairSubmit',
  components: {
    Icon,
    XInput,
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
      houses: [],
      tagsState: 0,
      supertags: [],
      subtags: [],
      currentSuperTagIndex: '',
      currentSubTagIndex: '',
      uploadedImgs: [],
      form: {
        house: '',
        desc: '',
        name: '',
        tel: ''
      }
    }
  },
  computed: {
    state () {
      return this.$store.state.userInfo.state
    },
    selectedTags () {
      let selectedArr = []
      let arr = this.supertags.filter(item => item.checked === true)
      for (let i = 0; i < arr.length; i++) {
        let subarr = arr[i].Sub.filter(item => {
          if (item.checked === true) {
            return item.Name
          }
        })
        for (let j = 0; j < subarr.length; j++) {
          let str = `${arr[i].Name}-${subarr[j].Name}`
          selectedArr.push(str)
        }
      }
      return selectedArr
    }
  },
  watch: {
    state (newVal, oldVal) {
      if (newVal !== 4) {
        this.checkIdentity()
      }
    }
  },
  created () {
    if (this.state !== 4) {
      this.checkIdentity()
    }
    this.getHouses()
    this.getParts()
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
      api.bind.getMyHouse()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let houses = res.data.Data
          houses.forEach(item => {
            item.houseFull = `${item.ProjectName + item.StageName + ' ' + item.Building} - ${item.Unit}-${item.HouseNo}`
          })
          this.houses = houses
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    getParts () {
      api.repair.user.parts()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let supertags = res.data.Data
          supertags.forEach(item => {
            item.checked = false
            item.Sub.forEach(item => {
              item.checked = false
            })
          })
          this.supertags = supertags
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    superChangeHandler (e) {
      let index = e.target.dataset.index
      if (this.currentSuperTagIndex === parseInt(index)) {
        this.supertags[this.currentSuperTagIndex].checked = !this.supertags[this.currentSuperTagIndex].checked
      } else {
        this.currentSuperTagIndex = parseInt(index)
        this.supertags[this.currentSuperTagIndex].checked = true
      }
      if (!this.supertags[this.currentSuperTagIndex].checked) {
        this.supertags[this.currentSuperTagIndex].Sub.forEach(item => {
          item.checked = false
        })
        this.subtags = []
      } else {
        this.subtags = this.supertags[index].Sub
      }
    },
    subChangeHandler (e) {
      let index = e.target.dataset.index
      this.currentSubTagIndex = parseInt(index)
      this.supertags[this.currentSuperTagIndex].Sub[index].checked = !this.supertags[this.currentSuperTagIndex].Sub[index].checked
      this.supertags[this.currentSuperTagIndex].checked = this.supertags[this.currentSuperTagIndex].Sub.some(item => item.checked)
      if (!this.supertags[this.currentSuperTagIndex].checked) {
        this.subtags = []
      }
    },
    uploadImg (res) {
      this.uploadedImgs.push(res)
    },
    submitHandler () {
      if (!this.form.house) {
        window.$alert({
          content: '请选择房源'
        })
        return
      }
      if (this.selectedTags.length < 1) {
        window.$alert({
          content: '请选择报修部位'
        })
        return
      }
      if (!this.form.desc) {
        window.$alert({
          content: '请填写您要报修的具体内容'
        })
        return
      }
      if (!this.form.name.match(NAME_REG)) {
        window.$alert({
          content: '请填写正确格式的联系人姓名'
        })
        return
      }
      if (!this.form.tel.match(TEL_REG)) {
        window.$alert({
          content: '请填写正确格式的联系人电话'
        })
        return
      }
      let _self = this
      let opt = {
        HouseID: this.form.house.value,
        Name: this.form.name,
        Tel: this.form.tel,
        Part: this.selectedTags.join(';'),
        Content: this.form.desc,
        Images: this.uploadedImgs.join(',')
      }
      // 提交
      api.repair.user.submit(opt)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert({
            title: '恭喜您！',
            content: '提交成功！',
            yes () {
              _self.$router.push({
                name: 'repairuser',
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
.repair-submit{
  padding:p2r($base-padding) p2r($base-padding) p2r($base-padding * 2);
  background: linear-gradient(#3a7bc9, $primary-color);
  .top{
    position: absolute;
    width:100%;
    z-index: 0;
    left:0;
    top:0;
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
      color: $text-color;
    }
    .selected-info{
      padding: p2r(20) 0;
      .head{
        flex:0 0 auto;
        font-size: p2r(26);
        color:$text-color;
        font-weight: 200;
        line-height: p2r(60);
        padding-top: p2r(10);
      }
      .body{
        margin-left: p2r(-10);
        margin-right: p2r(-10);
        font-size: 0;
        .selected-tag{
          display: inline-block;
          border:1px solid $primary-color;
          height: p2r(60);
          line-height: p2r(60);
          padding:0 p2r(20);
          min-width: p2r(120);
          border-radius: p2r(4);
          font-size: 0;
          text-align: center;
          color:lighten($primary-color, 8%);
          margin:p2r(10);
          .text{
            display: inline-block;
            font-size: p2r(24);
            vertical-align: top;
          }
          .icon{
            display: inline-block;
            vertical-align: top;
            width: p2r(50);
            height: p2r(60);
            margin-right: p2r(-20);
            .iconfont{
              font-size: p2r(24);
            }
          }
        }
      }
    }
    .select-house{
      height: p2r(100);
      margin-top: p2r(40);
    }
    .tags{
      margin-top: p2r(20);
      .tags-row{
        margin-left: p2r(-20);
        margin-right: p2r(-20);
        .radio-tag{
          display: inline-block;
          position: relative;
          margin:p2r(10) p2r(20);
          .radio{
            position: absolute;
            top:0;
            left:0;
            width:0;
            height:0;
          }
          .text{
            display: block;
            border:1px solid $thr-color;
            height: p2r(60);
            line-height: p2r(60);
            padding:0 p2r(20);
            min-width: p2r(120);
            border-radius: p2r(4);
            font-size: p2r(24);
            text-align: center;
            color:$thr-color;
            &.checking{
              background:lighten($text-sub-color, 30%);
              border-color:lighten($text-sub-color, 30%);
              color:#fff;
            }
            &.checked{
              background: $primary-color;
              color:#fff;
            }
          }
        }
      }

    }
    .desc{
      margin-top: p2r(20);
      font-size: p2r(26);
      width: 100%;
    }
    .img-row{
      .img-cell{
        .fit-img{
          width: p2r(120);
          height: p2r(120);
        }
      }
    }
    .tips{
      color:$text-color;
      font-size: p2r(24);
      margin-top: p2r(40);
    }
    .name,
    .tel{
      height: p2r(100);
      font-size: p2r(24);
      margin-top: p2r(20);
    }
    .name{
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
  .select-tag-box{
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height: 100%;
    z-index: 2;
    background: #fff;
    padding-bottom: p2r(260);
    .btns{
      position: absolute;
      width:100%;
      height: p2r(260);
      background: #fff;
      left:0;
      bottom:0;
      .btn{
        margin-top: p2r(20);
      }
    }
  }
}
</style>
