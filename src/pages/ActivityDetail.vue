<template>
  <div class="activity-detail">
    <div class="activity-detail-wrapper">
      <div class="banner">
        <Fitimg :src="usedActivity.Img" alt="" class="img" />
      </div>
      <div class="details">
        <flexbox class="oneline">
          <flexbox-item class="title">{{usedActivity.Name}}</flexbox-item>
          <flexbox-item
            class="state"
            :class="(usedActivity.ApplyState.state === 1 || usedActivity.ApplyState.state === 2)?'timeout':''"
          >{{usedActivity.ApplyState.state === 1?'未开始':usedActivity.ApplyState.state === 2?'已过期':'进行中'}}</flexbox-item>
        </flexbox>
        <p class="desc">
          {{usedActivity.Desc}}
        </p>
        <flexbox class="date">
          <flexbox-item class="icon">
            <Icon name="clock"/>
          </flexbox-item>
          <flexbox-item>
            <p class="text">
              {{usedActivity.PlayStart}} - {{usedActivity.PlayEnd}}
            </p>
          </flexbox-item>
        </flexbox>
        <flexbox class="location" v-if="usedActivity.Location">
          <flexbox-item class="icon">
            <Icon name="location"/>
          </flexbox-item>
          <flexbox-item>
            <p class="text">
              {{usedActivity.Location}}
            </p>
          </flexbox-item>
        </flexbox>
        <flexbox  align="center" class="content-title">
          <flexbox-item class="line"></flexbox-item>
          <div class="text">活动明细</div>
          <flexbox-item class="line"></flexbox-item>
        </flexbox>
        <div class="content-detail" v-html="usedActivity.Content"></div>
      </div>
    </div>
    <div class="btn-area">
      <Btn
        v-if="usedActivity.ApplyState.state || usedActivity.ApplyState.state === 0"
        type="primary"
        :text="usedActivity.ApplyState.message"
        :disabled="usedActivity.ApplyState.state !== 0 ? true:false"
        @click="btnClick"
      />
    </div>
    <div class="mask">
      <transition name="slide-in-right">
        <div class="panel" v-show="showPanel">
          <div class="panel-wrapper">
            <!-- 场次 -->
            <section v-if="usedActivity.Options" class="section round">
              <dl class="choosing-item">
                <dt class="title">{{usedActivity.Options.title}}</dt>
                <dd class="content">
                  <label
                    v-for="(item, index) in usedActivity.Options.items"
                    :key="'choosingtag-'+index+Math.random().toString(36).substr(2)"
                    class="radio-wrapper"
                  >
                    <input
                      v-model="extraInfos.selectedItem"
                      type="radio"
                      name="item"
                      :value="item.name"
                      class="radio"
                    >
                    <span class="text">{{item.name}}</span>
                  </label>
                </dd>
              </dl>
            </section>
            <!-- 参与人数 -->
            <section v-if="usedActivity.MaxNum>1||usedActivity.NeedInfo" class="section participant">
              <flexbox class="controller">
                <flexbox-item class="title">参与人数</flexbox-item>
                <flexbox-item class="cells">
                  <button
                    v-if="usedActivity.MaxNum > 1"
                    :disabled="extraInfos.participant.length <= 1"
                    class="cell minus"
                    @click="decrePartyCount"
                  >
                    <Icon name="minus" />
                  </button>
                  <span class="cell span">
                    <input
                      v-model="extraInfos.participant.length"
                      readonly
                      type="tel"
                      class="input"
                      @focus="'event.target.blur()'"
                    >
                  </span>
                  <button
                    v-if="usedActivity.MaxNum > 1"
                    :disabled="extraInfos.participant.length >= usedActivity.MaxNum"
                    class="cell plus"
                    @click="increPartyCount"
                  >
                    <Icon name="plus" />
                  </button>
                </flexbox-item>
              </flexbox>
              <dl
                v-if="usedActivity.NeedInfo"
                v-for="(item, index) in extraInfos.participant"
                :key="'participant-'+index"
                class="userinfo-input-group"
              >
                <dd class="input-wrapper">
                  <XInput
                    :placeholder="`请输入参与者${index + 1}的姓名`"
                    v-model="extraInfos.participant[index].name"
                  />
                </dd>
                <dd class="input-wrapper">
                  <XInput
                    :placeholder="`请输入参与者${index + 1}的电话`"
                    v-model="extraInfos.participant[index].tel"
                  />
                </dd>
                <dd class="input-wrapper">
                  <XInput
                    :placeholder="`请输入参与者${index + 1}的身份证号码`"
                    v-model="extraInfos.participant[index].id"
                  />
                </dd>
              </dl>
            </section>
            <!-- 收货人资料 -->
            <section v-if="usedActivity.NeedAddr" class="section address">
              <dl>
                <dt class="title">收件人资料</dt>
                <dd class="input-wrapper">
                  <XInput v-model="extraInfos.consignee.name" placeholder="填写收件人姓名"/>
                </dd>
                <dd class="input-wrapper">
                  <XInput v-model="extraInfos.consignee.tel" placeholder="填写收件人电话"/>
                </dd>
                <dd class="input-wrapper">
                  <XInput
                    v-model="extraInfos.consignee.address"
                    type="text"
                    readonly
                    placeholder="填写收货地址"
                    class="input"
                    @on-focus="focus"
                  />
                  <Icon name="arrow-right1"/>
                </dd>
              </dl>
            </section>
          </div>
          <div class="btns">
            <Btn type="primary" size="lar" text="确定" @click="optionSignIn"/>
            <Btn type="default" size="lar" text="取消" @click="toggleMask"/>
          </div>
        </div>
      </transition>
    </div>
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
              v-model="extraInfos.consignee.desc"
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
  Flexbox,
  FlexboxItem,
  Icon,
  Btn,
  XInput,
  AreaPicker,
  Fitimg
} from 'components'
import api from 'common/api'
import {
  formatDate
} from 'common/utils/date'
import {
  NAME_REG,
  TEL_REG,
  ID_CHECK,
  webRoot
} from 'common/data'
import wxConf from 'common/utils/wxConf'
export default {
  name: 'ActivityDetail',
  components: {
    Flexbox,
    FlexboxItem,
    Icon,
    Btn,
    XInput,
    AreaPicker,
    Fitimg
  },
  data () {
    return {
      activity: {
        ApplyState: {
          state: null,
          message: null
        }
      },
      activityId: null,
      showPanel: false,
      extraInfos: {
        // 选择的场次 时间等等
        selectedItem: '',
        // 收货人资料
        consignee: {
          name: '',
          tel: '',
          address: '',
          pickedArea: '',
          detail: ''
        },
        //  参与人数
        participant: [
          {
            name: '',
            tel: '',
            id: ''
          }
        ]
      },
      showAreaPage: false
    }
  },
  computed: {
    id () {
      return this.activityId
    },
    usedActivity () {
      return this.activity
    }
  },
  watch: {
    '$route' (to, from) {
      this.activityId = to.params.id
      this.getActivityInfo()
    }
  },
  created () {
    this.activityId = this.$route.params.id
    this.getActivityInfo()
    // this.changeShare()
  },
  methods: {
    focus (e) {
      e.target.blur()
      this.toggoleShowArea()
    },
    goBack () {
      if (window.history.length >= 2) {
        window.history.go(-1)
      } else {
        if (window.wx) {
          wxConf.closeWindow()
        } else {
          window.close()
        }
      }
    },
    getArea (val) {
      this.extraInfos.consignee.pickedArea = val
    },
    toggoleShowArea () {
      this.showAreaPage = !this.showAreaPage
    },
    changeArea () {
      if (!this.extraInfos.consignee.pickedArea) {
        window.$alert('请选择地区')
        return
      }
      if (!this.extraInfos.consignee.desc) {
        window.$alert('请填写详细地址')
        return
      }
      this.extraInfos.consignee.address = this.extraInfos.consignee.pickedArea + this.extraInfos.consignee.desc
      this.showAreaPage = false
    },
    increPartyCount () {
      if (this.extraInfos.participant.length >= this.usedActivity.MaxNum) {
        return
      }
      this.extraInfos.participant.push({
        name: '',
        tel: '',
        id: ''
      })
    },
    decrePartyCount () {
      if (this.extraInfos.participant.length > 1) {
        this.extraInfos.participant.pop()
      }
    },
    getActivityInfo () {
      let id = this.id
      api.activity.detail(id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let activity = res.data.Data
          activity.Img = webRoot + activity.Img
          activity.Content = activity.Content.replace(/src="\/Content\//g, `src="${webRoot}/Content/`)
          activity.PlayStart = formatDate(new Date(activity.PlayStart), 'yyyy/MM/dd')
          activity.PlayEnd = formatDate(new Date(activity.PlayEnd), 'yyyy/MM/dd')
          activity.state = activity.IsOver ? 0 : 1
          if (activity.Options) {
            activity.Options = JSON.parse(activity.Options)
          }
          this.activity = activity
          this.extraInfos.consignee = {
            name: activity.UserInfo.Name,
            tel: activity.UserInfo.Tel,
            address: activity.UserInfo.Address
          }
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    btnClick () {
      if (this.usedActivity.NeedMoreInfo) {
        this.toggleMask()
      } else {
        this.directSignIn()
      }
    },
    directSignIn () {
      api.activity.apply(this.activityId)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert({
            title: '恭喜您！',
            content: '报名成功！'
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    optionSignIn () {
      let _self = this
      if (this.usedActivity.Options) {
        if (!this.extraInfos.selectedItem) {
          window.$alert(`请选择${this.usedActivity.Options.title}！`)
          return
        }
      }
      if (this.usedActivity.NeedInfo) {
        let check = this.extraInfos.participant.every((item, index) => {
          if (!item.name.match(NAME_REG)) {
            window.$alert(`请填写参与者${index + 1}正确格式的姓名`)
            return item.name.match(NAME_REG)
          }
          if (!item.tel.match(TEL_REG)) {
            window.$alert(`请填写参与者${index + 1}正确格式的电话号码`)
            return item.tel.match(TEL_REG)
          }
          if (!ID_CHECK(item.id)) {
            window.$alert(`请填写参与者${index + 1}正确的身份证号码`)
            return ID_CHECK(item.id)
          }
          return true
        })
        if (!check) return
      }
      if (this.usedActivity.NeedAddr) {
        if (!this.extraInfos.consignee.name.match(NAME_REG)) {
          window.$alert(`请填写正确的收货人姓名`)
          return
        }
        if (!this.extraInfos.consignee.tel.match(TEL_REG)) {
          window.$alert(`请填写正确格式的电话号码`)
          return
        }
        if (!this.extraInfos.consignee.address) {
          window.$alert(`请填写收货地址`)
          return
        }
      }
      let ActivityID = this.activityId
      let Options = this.extraInfos.selectedItem
      let TotalNum = this.extraInfos.participant.length
      let Info = JSON.stringify(this.extraInfos.participant)
      let Address = JSON.stringify(this.extraInfos.consignee)
      api.activity.apply(ActivityID, {Options, TotalNum, Info, Address})
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert({
            title: '恭喜您！',
            content: '报名成功！',
            yes () {
              window.$closeAll()
              _self.toggleMask()
            }
          })
        } else {
          window.$alert({
            content: res.data.Message,
            yes () {
              window.$closeAll()
              _self.toggleMask()
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toggleMask () {
      this.showPanel = !this.showPanel
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.activity-detail{
  width:100vw;
  height: 100vh;
  padding-bottom: p2r(140);
  overflow: hidden;
  position: relative;
  .activity-detail-wrapper{
    width:100%;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .banner{
      width:100%;
      overflow: hidden;
      .img{
        max-width: 100%;
      }
    }
    .details{
      padding:p2r($base-padding) p2r($base-padding) p2r(40);
      .oneline{
        margin: p2r(15) 0;
      }
      .title{
        font-size: p2r(28);
        color:$text-color;
        font-weight: 500;
        line-height: p2r(32);
        display: inline-block;
        padding-right: p2r(20);
      }
      .desc{
        color:$thr-color;
        font-size: p2r(24);
        line-height: 1.4;
        margin-top: p2r(28);
        font-weight: 200;
      }
      .date,.location{
        color:$text-color;
        margin-top: p2r(20);
        .icon{
          font-size: p2r(30);
          flex: 0 0 p2r(40);
          .iconfont{
            line-height:1.2;
          }
        }
        .text{
          font-weight: 200;
          font-size: p2r(26);
          line-height:1.4;
        }
      }
      .date{
        margin-top: p2r(40);
      }
      .read-num{
        font-size: p2r(24);
        color:$thr-color;
        font-weight: 200;
        flex:0 0 p2r(180);
        text-align: right;
      }
      .state{
        font-size: 10px;
        font-weight: 200;
        height: 16px;
        line-height: 16px;
        border-radius: 25px;
        background:$primary-color;
        color:#fff;
        width:p2r(100);
        text-align: center;
        flex:0 0 p2r(100);
        &.timeout{
          background:$btn-disable-color;
          color:$text-sub-color;
        }
      }
      .content-title{
        margin-top: p2r(80);
        font-size: p2r(28);
        color:$text-color;
        .line{
          height: 1px;
          @include _1px();
        }
        .text{
          margin:0 p2r(30)
        }
      }
      .content-detail{
        padding-top: p2r(40);
        font-size: p2r(24) !important;
        color:$text-color !important;
        font-weight: 200 !important;
        line-height: 1.4 !important;
        *{
          font-size: p2r(24) !important;
          color:$text-color !important;
          font-weight: 200 !important;
          line-height: 1.4 !important;
        }

      }
    }
  }
  .btn-area{
    position: fixed;
    bottom: 0;
    left:0;
    text-align: center;
    width:100%;
    padding-bottom: p2r(20);
    z-index:1
  }
  .mask{
    .panel{
      position: absolute;
      width:100%;
      height: 100%;
      background: #fff;
      bottom:0;
      z-index:$zindex-notification;
      padding:0;
      .panel-wrapper{
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding: p2r(30) p2r(30) p2r(300);
        .section{
          padding: p2r(30) 0;
          margin: p2r(30) 0;
          &:first-child{
            padding-top: 0;
            margin-top: 0;
          }
          &:last-child{
            background: #fff;
          }
          @include _1px();
          .title{
            font-size: p2r(28);
            color:$text-sub-color;
            font-weight: 600;
          }
          .userinfo-input-group{
            margin-top: p2r(40);
          }
          .input-wrapper{
            position: relative;
            width:100%;
            height: p2r(80);
            line-height: p2r(80);
            margin: p2r(30) 0;
            .iconfont{
              height: p2r(80);
              line-height: p2r(80);
              position: absolute;
              right:p2r(30);
              top:0;
              font-size: p2r(24);
              color: $thr-color;
            }
          }
        }
        .choosing-item{
          overflow: hidden;
          &:first-child{
            margin-top: 0;
          }
          .content{
            margin: {
              top:p2r(30);
              left: p2r(-30);
              right: p2r(-30);
              bottom:p2r(30);
            }
            .radio-wrapper{
              display: inline-block;
              position: relative;
              width:p2r(190);
              height:p2r(60);
              margin:p2r(20) p2r(30) 0;
              .radio{
                width:0;
                height:0;
                display: block;
                &:checked + .text{
                  background: $primary-color;
                  color:#fff;
                }
              }
              .text{
                color:lighten($primary-color, 15%);
                font-size: p2r(24);
                display: block;
                width:100%;
                height: 100%;
                border-radius: 4px;
                border:1px solid lighten($primary-color, 15%);
                line-height: p2r(58);
                text-align: center;
                font-weight: 200;
              }
            }
          }
        }
        .controller {
          .title{
            line-height: p2r(60);
          }
          .cells{
            text-align: right;
            font-size: 0;
            .cell{
              display: inline-block;
              vertical-align: top;
              height: p2r(60);
              outline: none;
              -webkit-appearance: none;
              border:none;
              background: $primary-color;
              border-radius: 4px;
              &:disabled{
                background: lighten($primary-color, 15%);
              }
              &.span{
               background: none;
              }
              .input,
              .iconfont{
                display: block;
                height: 100%;
                text-align: center;
                line-height: p2r(60);
                font-size: p2r(24);
              }
              .iconfont{
                width: p2r(60);
                color:#fff;
              }
              .input{
                margin:0 p2r(10);
                display: inline-block;
                width:p2r(80);
                color:$text-color;
                border:1px solid $primary-color;
                border-radius: 4px;
                outline: none;
                -webkit-appearance: none;
              }
            }
          }
        }
      }
      .btns{
        position: absolute;
        bottom: 0;
        left:0;
        width:100%;
        background: #fff;
        .btn{
          margin: p2r(30) auto;
        }
      }
    }
  }
}
.area-pick-page{
  position: fixed;
  width:100%;
  height: 100%;
  top:0;
  left:0;
  background: #fff;
  z-index:$zindex-header;
  padding: p2r($base-padding);
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
</style>
