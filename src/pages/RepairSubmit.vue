<template>
<div class="repair-submit">
  <div class="panel-group">
    <div class="panel">
      <h3 class="title">选择房源</h3>
      <div class='guide' @click='toggleGuide'>
        报修操作说明<Icon class="icon" name="help"/>
      </div>
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
      <div v-if="form.house" class="tags">
        <flexbox justify="justify">
          <h3 class="title">选择房间</h3>
          <div class="selected-span" @click="toggleTags('roomAll')">
            <span :class="selectedRoom ? 'color' : ''" class="text">{{selectedRoomName || '全部'}}</span>
            <Icon :class="roomAll?'show':'hide'" class="arrow-right" name="arrow-right1"/>
          </div>
        </flexbox>
        <flexbox wrap="wrap" class="tags-row" :class="roomAll ? 'show': 'hide'">
          <label v-for="(item, index) in rooms" :key="'room-'+index+item.ID" class="radio-tag">
            <input v-model="selectedRoom" class="radio" type="radio" name="room" :value="item.ID">
            <span class="text">{{item.Name}}</span>
          </label>
        </flexbox>
      </div>
      <div v-if="selectedRoom" class="tags">
        <flexbox justify="justify">
          <h3 class="title">选择部位</h3>
          <div class="selected-span" @click="toggleTags('partAll')">
            <span :class="selectedPart ? 'color' : ''" class="text">{{selectedPartName || '全部'}}</span>
            <Icon :class="partAll?'show':'hide'" class="arrow-right" name="arrow-right1"/>
          </div>
        </flexbox>
        <flexbox wrap="wrap" class="tags-row" :class="partAll ? 'show': 'hide'">
          <label v-for="(item, index) in parts" :key="'part-'+index+item.ID" class="radio-tag">
            <input v-model="selectedPart" class="radio" type="radio" name="part" :value="item.ID">
            <span class="text">{{item.Name}}</span>
          </label>
        </flexbox>
      </div>
      <div v-if="selectedPart" class="tags">
        <flexbox justify="justify">
          <h3 class="title">选择部品</h3>
          <div class="selected-span" @click="toggleTags('partresAll')">
            <span :class="selectedPartRes ? 'color' : ''" class="text">{{selectedPartResName || '全部'}}</span>
            <Icon :class="partresAll?'show':'hide'" class="arrow-right" name="arrow-right1"/>
          </div>
        </flexbox>
        <flexbox wrap="wrap" class="tags-row" :class="partresAll ? 'show': 'hide'">
          <label v-for="(item, index) in partres" :key="'partres-'+index+item.ID" class="radio-tag">
            <input v-model="selectedPartRes" class="radio" type="radio" name="partres" :value="item.ID">
            <span class="text">{{item.Name}}</span>
          </label>
        </flexbox>
      </div>
      <div v-if="selectedPartRes" class="tags">
        <flexbox justify="justify">
          <h3 class="title">选择问题</h3>
          <div class="selected-span" @click="toggleTags('troubleAll')">
            <span :class="selectedTrouble ? 'color' : ''" class="text">{{selectedTroubleName || '全部'}}</span>
            <Icon :class="troubleAll?'show':'hide'" class="arrow-right" name="arrow-right1"/>
          </div>
        </flexbox>
        <flexbox wrap="wrap" class="tags-row" :class="troubleAll ? 'show': 'hide'">
          <label v-for="(item, index) in trouble" :key="'trouble-'+index+item.ID" class="radio-tag">
            <input v-model="selectedTrouble" class="radio" type="radio" name="trouble" :value="item.ID">
            <span class="text">{{item.Name}}</span>
          </label>
        </flexbox>
      </div>
      <div v-if="selectedRoomName" class="selected-info">
        <Split type="line"/>
        <flexbox align="center" justify="justify">
          <h3 class="head">报修问题：</h3>
          <div class="body">
            <div class="selected-tag">
              <span class="text">{{selectedRoomName}}</span>
              <span v-if="selectedPartName" class="text">-{{selectedPartName}}</span>
              <span v-if="selectedPartResName" class="text">-{{selectedPartResName}}</span>
              <span v-if="selectedTroubleName" class="text">-{{selectedTroubleName}}</span>
            </div>
          </div>
        </flexbox>
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
      <h3 class="title" style="margin-top:15px;">联系人信息</h3>
      <XInput v-model="form.name" placeholder="联系人姓名" class="name" />
      <XInput v-model="form.tel" placeholder="联系人电话" htmlType="tel" class="tel" />
    </div>
  </div>
  <Btn
    text="提交"
    size="lar"
    class="submit"
    @click="submitHandler"
  />
  <div class='guide-box' v-show='guideShow'>
    <div class='bg' @click='toggleGuide'></div>
    <div class='wrapper' @click='toggleGuide'>
      <h2 class='tit'>在线报修操作说明</h2>
      <p class='sub-tit'>以下操作说明以报修“主卧木地板破损”为例：</p>
      <p class='p'>第一步，“选择房间”，即选择报修项目所在的区域，例：在“选择房间”中点击“主卧”；</p>
      <p class='p'>第二步，“选择部位”，即选择报修项目的部位，例：在“选择部位”中点击“地面（精装）”；</p>
      <p class='p'>第三步，“选择部品”，即选择报修的部品，例：在“选择部品”中点击“木地板”；</p>
      <p class='p'>第四步，“选择问题”，即选择报修部品的问题，例：在“选择问题”中点击“刮花、破损”；</p>
      <p class='p'>第五步，在录入框中输入报修的具体内容详细描述，例：“主卧靠近窗台木地板破损,需维修”；并上传图片；</p>
      <p class='p'>第六步，填写联系人姓名及联系方式并提交。</p>
    </div>
  </div>
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
      troubleGroup: {},
      roomAll: true,
      selectedRoom: '',
      partAll: true,
      selectedPart: '',
      partresAll: true,
      selectedPartRes: '',
      troubleAll: true,
      selectedTrouble: '',
      uploadedImgs: [],
      form: {
        house: '',
        desc: '',
        name: '',
        tel: ''
      },
      guideShow: false
    }
  },
  computed: {
    state () {
      return this.$store.state.userInfo.state
    },
    rooms () {
      let house = this.houses.find(item => item.ID === this.form.house.value)
      if (house) {
        return this.troubleGroup.Room.filter(item => item.HuxingID === house.HuxingID)
      } else {
        return this.troubleGroup.Room
      }
    },
    parts () {
      let rid = this.selectedRoom
      return this.troubleGroup.Part.filter(item => item.RoomID === rid)
    },
    partres () {
      let pid = this.selectedPart
      return this.troubleGroup.PartRes.filter(item => item.PartID === pid)
    },
    trouble () {
      let pid = this.selectedPartRes
      return this.troubleGroup.Trouble.filter(item => item.PartResID === pid)
    },
    selectedRoomName () {
      let name = ''
      if (this.rooms && this.rooms.length > 0 && this.selectedRoom) {
        if (this.rooms.find(item => item.ID === this.selectedRoom)) {
          name = this.rooms.find(item => item.ID === this.selectedRoom).Name
        } else {
          name = ''
        }
      }
      return name
    },
    selectedPartName () {
      let name = ''
      if (this.rooms && this.parts.length > 0 && this.selectedPart) {
        if (this.parts.find(item => item.ID === this.selectedPart)) {
          name = this.parts.find(item => item.ID === this.selectedPart).Name
        } else {
          name = ''
        }
      }
      return name
    },
    selectedPartResName () {
      let name = ''
      if (this.partres && this.partres.length > 0 && this.selectedPartRes) {
        if (this.partres.find(item => item.ID === this.selectedPartRes)) {
          name = this.partres.find(item => item.ID === this.selectedPartRes).Name
        } else {
          name = ''
        }
      }
      return name
    },
    selectedTroubleName () {
      let name = ''
      if (this.trouble && this.trouble.length > 0 && this.selectedTrouble) {
        if (this.trouble.find(item => item.ID === this.selectedTrouble)) {
          name = this.trouble.find(item => item.ID === this.selectedTrouble).Name
        } else {
          name = ''
        }
      }
      return name
    }
  },
  watch: {
    state (newVal, oldVal) {
      if (newVal !== 4) {
        this.checkIdentity()
      }
      if (newVal === 3 || newVal === 4) {
        this.getHouses()
        this.getParts()
      }
    },
    selectedRoom () {
      this.selectedPart = ''
      this.selectedPartRes = ''
      this.selectedTrouble = ''
      this.partAll = true
    },
    selectedPart () {
      this.selectedPartRes = ''
      this.selectedTrouble = ''
      this.partresAll = true
    },
    selectedPartRes () {
      this.selectedTrouble = ''
      this.troubleAll = true
    }
  },
  created () {
    if (this.state !== 4) {
      this.checkIdentity()
    }
    if (this.state === 3 || this.state === 4) {
      this.getHouses()
      this.getParts()
    }
  },
  methods: {
    checkIdentity () {
      if (this.$store.state.userInfo.state !== null && this.$store.state.userInfo.state !== 3) {
        let index = window.$alert({
          title: '对不起',
          content: '请先绑定房源！',
          yes: () => {
            window.$close(index)
            this.$router.replace({
              name: 'bind'
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
          let troubleGroup = res.data.Data
          this.troubleGroup = troubleGroup
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toggleTags (str) {
      this[str] = !this[str]
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
      if (!this.selectedRoom) {
        window.$alert({
          content: '请选择房间'
        })
        return
      }
      if (!this.selectedPart) {
        window.$alert({
          content: '请选择报修部位'
        })
        return
      }
      if (!this.selectedPartRes) {
        window.$alert({
          content: '请选择报修部品'
        })
        return
      }
      if (!this.selectedTrouble) {
        window.$alert({
          content: '请选择报修问题'
        })
        return
      }
      if (!this.form.desc) {
        window.$alert({
          content: '请填写您要报修的具体内容'
        })
        return
      }
      if (!this.form.name.trim()) {
        window.$alert({
          content: '姓名不能为空！'
        })
        return
      }
      if (!this.form.name.match(NAME_REG)) {
        // window.$alert({
        //   content: '请填写正确格式的姓名（2-6位中文字）'
        // })
        // return
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
        TroubleID: this.selectedTrouble,
        Content: this.form.desc,
        Images: this.uploadedImgs.join(',')
      }
      // 提交
      api.repair.user.submit(opt)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert({
            title: '提示',
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
    },
    toggleGuide () {
      this.guideShow = !this.guideShow
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
    padding:p2r(40) p2r(30) p2r(60);
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
      color: $text-sub-color;
      padding: p2r(10) 0;
    }
    .selected-span{
      text-align: right;
      font-size: 0;
      padding: p2r(10) 0 p2r(10) p2r(20);
      .text{
        display: inline-block;
        font-size: p2r(26);
        padding-right: p2r(10);
        color: $thr-color;
        &.color{
          color:$primary-color;
        }
      }
      .iconfont{
        display: inline-block;
        font-size: p2r(26);
        color:$thr-color;
        &.hide{
          transform: rotate(90deg);
        }
        &.show{
          transform: rotate(-90deg);
        }
      }
    }
    .selected-info{
      padding: p2r(20) 0;
      .flexbox{
        margin-top: p2r(30);
      }
      .head{
        flex:0 0 auto;
        font-size: p2r(26);
        color:$text-color;
        font-weight: 200;
        line-height: p2r(40);
      }
      .body{
        font-size: 0;
        .selected-tag{
          display: inline-block;
          background: $primary-color;
          // height: p2r(60);
          // line-height: p2r(60);
          line-height: 1.5;
          padding: p2r(10);
          border-radius: p2r(4);
          font-size: 0;
          text-align: center;
          .text{
            display: inline-block;
            font-size: p2r(24);
            vertical-align: top;
            color:#fff;
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
      margin-top: p2r(30);
      .tags-row{
        margin-left: p2r(-20);
        margin-right: p2r(-20);
        margin-top: p2r(20);
        &.hide{
          overflow: hidden;
          height: p2r(80);
        }
        &.show{
          height: auto;
        }
        .radio-tag{
          display: inline-block;
          position: relative;
          margin:p2r(10) 0;
          width: 33.333%;
          padding:0 p2r(15);
          .radio{
            position: absolute;
            top:0;
            left:0;
            width: 100%;
            height: 100%;
            opacity: 0;
            &:checked{
              & + .text{
                background: $primary-color;
                border-color: $primary-color;
                color:#fff;
              }
            }
          }
          .text{
            display: block;
            border:1px solid $thr-color;
            height: p2r(60);
            line-height: p2r(60);
            padding:0 p2r(10);
            border-radius: p2r(4);
            font-size: p2r(24);
            text-align: center;
            color:$thr-color;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
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
  .guide{
    position: absolute;
    top: p2r(40);
    right: p2r(30);
    font-size: p2r(24);
    padding: p2r(10) 0;
    color: #666;
    .icon{
      font-size: p2r(30);
      margin-left: p2r(10);
      vertical-align: middle;
    }
  }
  .guide-box{
    .bg{
      position: fixed;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
      z-index: 9999;
    }
    .wrapper{
      position: fixed;
      top: 10%;
      left: 6%;
      width: 88%;
      height: 80%;
      background: #fff;
      z-index: 10000;
      border-radius: 4px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: p2r(30);
      -webkit-overflow-scrolling: touch;
      .tit{
        text-align: center;
        font-weight: 600;
        font-size: p2r(36);
        margin: p2r(30) 0;
        color: #333;
      }
      .sub-tit{
        font-size: p2r(26);
        color: #666;
        margin: p2r(40) 0;
      }
      .p{
        font-size: p2r(26);
        color: #666;
        margin: p2r(20) 0;
        line-height: 1.7;
      }
    }
  }
}
</style>
