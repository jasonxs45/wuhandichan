<template>
  <div class="repair-detail">
    <div :class="['repair-detail-wrapper', singleBtn ? 'single' : '']">
      <div class="detail">
        <flexbox>
          <flexbox-item class="house-name">
            {{repair.ProjectName + repair.StageName}} {{repair.Building}} - {{repair.Unit}}-{{repair.HouseNo}}
          </flexbox-item>
          <!-- <flexbox-item class="date">
            {{repair.AddTime|formatdate}}
          </flexbox-item> -->
        </flexbox>
        <div class="info">{{repair.Part}}</div>
        <div class="desc">{{repair.Content}}</div>
        <img-row
          v-if="imgs.length > 0"
          :group="imgs"
          :canUpload="false"
          class="imgs"
        >
          <img-cell
            v-for="(item, index) in imgs"
            :index="index"
            :canUpload="false"
            :group="imgs"
            :key="'upimg-'+index"
          >
            <Fitimg :src="item" @on-click="previewImg(item)"/>
          </img-cell>
        </img-row>
        <template v-if="repair.Name">
          <Split type="line"/>
          <!-- <flexbox>
            <flexbox-item class="engineer-name">
              联系人：{{repair.Name}}
            </flexbox-item>
            <flexbox-item class="tel">
              <a :href="`tel:${repair.Tel}`">{{repair.Tel}}</a>
            </flexbox-item>
          </flexbox> -->
        </template>
        <flexbox class="submit-date">
          <flexbox-item class="tit">提交时间：</flexbox-item>
          <flexbox-item class="date">
            {{repair.AddTime|formatdate}}
          </flexbox-item>
        </flexbox>
      </div>
      <!-- <div class="refuse-info">
        <Split type="line"/>
        <div class="refuse-info-wrapper">
          <flexbox>
            <flexbox-item class="engineer-name">
              工程师：{{repair.AdminName}}
            </flexbox-item>
            <flexbox-item class="tel">
              <a :href="`tel:${repair.AdminTel}`">{{repair.AdminTel}}</a>
            </flexbox-item>
          </flexbox>
          <x-textarea
            v-if="repair.RefuseReason"
            :value="repair.RefuseReason"
            readonly
            class="refuse-desc"
          ></x-textarea>
        </div>
      </div> -->
      <div v-if="currentProgress && currentProgress.length > 0" class="progress-wrapper">
        <div class="progress">
          <flexbox
            v-for="(item, index) in currentProgress"
            :key="'item-'+index"
            class="progress-item"
          >
            <flexbox-item class="icon">
              <Icon :name="index===0?'radio-check':'radio'"/>
            </flexbox-item>
            <flexbox-item class="item-body">
              <div class="item-body-wrapper">
                <p class="time">{{item.AddTime}}</p>
                <h3 class="status">{{item.Title}}</h3>
                <p class="info" :class="item.Remark? '': 'opa'">{{item.Remark}}</p>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
    <div :class="['btns', singleBtn ? 'single' : '']">
      <!-- 工程师主管 -->
      <flexbox v-if="!singleBtn" class="double">
        <Btn
          text="驳回施工单位"
          class="inline flexbox-item opa"
          @click="toggleRefuse"
        />
        <Btn
          type="base"
          size="lar"
          text="驳回维修管理员"
          class="inline flexbox-item"
          @click="toggleDispatch"
        />
        <Btn
          type="primary"
          text="关闭"
          class="inline flexbox-item"
          @click="toggleCancel"
        />
      </flexbox>
      <Btn
        type="default"
        size="lar"
        text="返回"
        @click="back"
      />
    </div>
    <div class="refuse">
      <transition name="fade">
        <div v-show="showRefuse" class="bg" @click="toggleRefuse"></div>
      </transition>
      <transition name="slide-up">
        <div v-show="showRefuse" class="refuse-wrapper">
          <x-textarea v-model="refuseReason" placeholder="请填写驳回理由"></x-textarea>
          <Btn type="primary" text="提交" size="lar" @click="submitRefuse"/>
          <Btn type="default" text="取消" size="lar" @click="toggleRefuse"/>
        </div>
      </transition>
    </div>
    <div class="refuse">
      <transition name="fade">
        <div v-show="showCancel" class="bg" @click="toggleRefuse"></div>
      </transition>
      <transition name="slide-up">
        <div v-show="showCancel" class="refuse-wrapper">
          <x-textarea v-model="cancelReason" placeholder="请填写关闭理由"></x-textarea>
          <Btn type="primary" text="提交" size="lar" @click="agree"/>
          <Btn type="default" text="取消" size="lar" @click="toggleCancel"/>
        </div>
      </transition>
    </div>
    <transition name="slide-in-right">
      <div class="dispatch" v-show="showDispatch">
        <div class="dispatch-wrapper">
          <x-textarea v-model="allotReason" placeholder="请填写重新分配的原因"></x-textarea>
        </div>
        <div class="btns">
          <Btn type="primary" text="确定" size="lar" @click="changeEngineer"/>
          <Btn type="default" text="取消" size="lar" @click="toggleDispatch"/>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  ImgRow,
  ImgCell,
  Fitimg,
  Split,
  Btn,
  Icon,
  Star,
  XTextarea,
  XSelect,
  XOption
} from 'components'
import {
  formatDate
} from 'common/utils/date'
import {
  webRoot
} from 'common/data'
import api from 'common/api'
import wxConf from 'common/utils/wxConf'
export default {
  name: 'RepairEngineerManagerDetail',
  components: {
    Flexbox,
    FlexboxItem,
    ImgRow,
    ImgCell,
    Fitimg,
    Split,
    Btn,
    Icon,
    Star,
    XTextarea,
    XSelect,
    XOption
  },
  data () {
    return {
      stateType: '',
      role: '',
      id: '',
      content: null,
      desc: '',
      showRefuse: false,
      showDispatch: false,
      refuseReason: '',
      engineerList: [],
      selectedEngineer: {},
      allotReason: '',
      showCancel: false,
      cancelReason: ''
    }
  },
  computed: {
    singleBtn () {
      return this.stateType === 'timeout'
    },
    repair () {
      return this.content ? this.content.repair : {}
    },
    detailList () {
      let list = this.content ? this.content.detailList : []
      list.map(item => {
        if (typeof item.Images === 'string') {
          let arr = item.Images.split(',')
          if (arr.length === 1 && !arr[0]) {
            item.Images = []
          } else {
            let arr1 = arr.map(img => webRoot + img)
            console.log(arr1)
            item.Images = arr1
          }
        }
      })
      return list
    },
    currentProgress () {
      return this.content
             ? this.content.logList
             : []
    },
    imgs () {
      let arr
      if (this.content) {
        arr = this.content.repair.Images.split(',')
        if (arr.length === 1 && arr[0] === '') {
          arr = []
        } else {
          arr = arr.map(item => {
            item = item.includes(webRoot) ? item : webRoot + item
            return item
          })
        }
      } else {
        arr = []
      }
      return arr
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.getDetail()
    }
  },
  filters: {
    formatdate (val) {
      return formatDate(new Date(val), 'yyyy/MM/dd hh:mm')
    }
  },
  created () {
    this.role = this.$route.params.role
    this.id = this.$route.params.id
    this.getDetail()
  },
  methods: {
    getDetail () {
      api.repair.detail(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let content = res.data.Data
          this.content = content
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    previewImg (cur, groups) {
      let current = cur.includes(window.location.origin) ? cur : window.location.origin + cur
      let urls = groups.map(item => item.includes(window.location.origin) ? item : window.location.origin + item)
      wxConf.previewImg({
        current,
        urls
      })
    },
    back () {
      try {
        this.$router.back()
      } catch (err) {
        this.$router.push({
          name: 'repairengineermanager',
          params: {
            state: 'untreated'
          }
        })
      }
    },
    /* =====驳回拒绝==== */
    submitRefuse () {
      let _self = this
      if (!this.refuseReason) {
        window.$alert('请填写驳回理由')
        return
      }
      let index1 = window.$confirm({
        title: '提示',
        content: '确定驳回吗？',
        yes: () => {
          window.$close(index1)
          api.repair.engineermanager.refuse(this.id, this.refuseReason)
          .then(({res, index}) => {
            if (res.data.IsSuccess) {
              let index1 = window.$alert({
                content: '拒单申请已驳回！',
                yes () {
                  window.$close(index1)
                  _self.$router.replace({
                    name: 'repairengineermanager',
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
      })
    },
    /* =====通过并取消==== */
    agree () {
      if (!this.cancelReason.trim()) {
        window.$alert('请填写关闭理由！')
        return
      }
      let index = window.$confirm({
        title: '提示',
        content: '确定关闭吗？',
        yes: () => {
          window.$close(index)
          api.repair.engineermanager.agree(this.id, this.cancelReason)
          .then(({res, index}) => {
            if (res.data.IsSuccess) {
              let index = window.$alert({
                content: '报修单已关闭！',
                yes: () => {
                  window.$close(index)
                  this.$router.replace({
                    name: 'repairengineermanager',
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
      })
    },
    /* =====重新分单==== */
    changeEngineer () {
      if (!this.allotReason) {
        window.$alert('请填写重新分配的原因')
        return
      }
      let _self = this
      let index1 = window.$confirm({
        title: '提示',
        content: '确定驳回吗？',
        yes: () => {
          window.$close(index1)
          api.repair.engineermanager.change(this.id, this.allotReason)
          .then(({res, index}) => {
            if (res.data.IsSuccess) {
              let index1 = window.$alert({
                content: '重新分配申请已提交！',
                yes () {
                  window.$close(index1)
                  _self.$router.replace({
                    name: 'repairengineermanager',
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
      })
    },
    // 弹层
    toggleRefuse () {
      this.showRefuse = !this.showRefuse
    },
    toggleDispatch () {
      this.showDispatch = !this.showDispatch
    },
    toggleCancel () {
      this.showCancel = !this.showCancel
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.repair-detail{
  width: 100vw;
  background: $background-color;
  .repair-detail-wrapper{
    min-height: 100vh;
    padding-bottom: p2r(320);
    background: $background-color;
    &.single{
      padding-bottom: p2r(200);
    }
    .detail{
      background: #fff;
      padding: p2r(40) p2r($base-padding) p2r($base-padding);
      .house-name{
        color:$primary-color;
        font-size: p2r(28);
        line-height: 1.5;
      }
      .date{
        flex: 0 0 p2r(200);
        width: p2r(200);
        text-align: right;
        font-weight: 200;
        font-size: p2r(24);
        line-height: p2r(28);
        color: $thr-color;
      }
      .submit-date{
        margin-top: p2r(20);
        .tit{
          color: $text-color;
          line-height: p2r(28);
        }
      }
      .info{
        background: $primary-color;
        color: #fff;
        padding: p2r($base-padding / 2) p2r($base-padding);
        border-radius: 4px;
        margin-top: p2r(20);
        line-height: 1.5;
      }
      .desc{
        margin-top: p2r(20);
        line-height: 1.5;
        color:$text-sub-color;
      }
      .imgs{
        margin-top: p2r($base-padding / 3);
      }
      .split{
        margin-top: p2r($base-padding);
      }
    }
    .engineer-name,
    .tel{
      font-size: p2r(26);
      margin-top: p2r(20);
    }
    .tel{
      text-align: right;
    }
    .refuse-info{
      background: #fff;
      .refuse-info-wrapper{
        padding:0 p2r($base-padding) p2r($base-padding);
        .engineer-name,
        .tel{
          color: $primary-color;
        }
        .tel {
          a {
            color: $primary-color;
          }
        }
        .refuse-desc{
          font-size: p2r(24);
          border: none;
          width: 100%;
          margin-top: p2r(20);
          height: auto;
        }
      }
    }
    .progress-wrapper{
      margin-top: p2r($base-padding);
      .progress{
        background: #fff;
        padding: p2r($base-padding) p2r($base-padding) 0;
        .progress-item{
          &:first-child{
            .icon{
              &:after{
                background:$primary-color;
              }
              .iconfont{
                font-size: p2r(42);
                color:$primary-color;
              }
            }
          }
          &:last-child{
            .icon{
              &:after{
                display: none;
              }
            }
          }
          .icon{
            flex:0 0 p2r(42);
            position: relative;
            text-align: center;
            .iconfont{
              font-size: p2r(30);
              background: #fff;
              color:$thr-color;
              position: relative;
              z-index: 1;
            }
            &:after{
              content: '';
              display: block;
              width: 1px;
              height:100%;
              background: $thr-color;
              position: absolute;
              top:0;
              left:p2r(19);
              z-index: 0;
            }
          }
          .item-body{
            padding-left: p2r(54);
            .time{
              font-size: p2r(24);
              color:$thr-color;
              font-weight: 200;
            }
            .status{
              font-size: p2r(28);
              color:$primary-color;
              margin-top: p2r(20);
            }
            .info{
              margin-top: p2r(20);
              margin-bottom: p2r(70);
              font-size: p2r(24);
              color:$text-color;
              background: $background-color;
              padding: p2r(20);
              font-weight: 200;
              line-height: 1.4;
              &.opa{
                opacity: 0;
                padding:0 p2r(20);
              }
            }
          }
        }
      }
    }
  }
  &>.btns{
    position: fixed;
    width:100%;
    bottom: 0;
    z-index: 1;
    background: $background-color;
    padding: 0 p2r($base-padding) p2r($base-padding);
    &.single{
      margin-top: p2r(-180);
    }
    .double{
      width: p2r(680);
      margin:0 auto;
      font-size: 0;
      justify-content: space-between;
      .btn{
        margin: {
          left: 0;
          right: 0;
        }
      }
    }
    .btn{
      font-size: p2r(26);
      width: p2r(680);
      margin: {
        top: p2r(30);
      }
      &.inline{
        width: p2r(200);
        flex: 0 0 p2r(200);
        &.opa{
          background: none;
          border: 1px solid $primary-color;
        }
      }
    }
  }
  .refuse{
    .bg{
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
      top: 0;
      left: 0;
      z-index: 1;
    }
    .refuse-wrapper{
      position: fixed;
      width: 100%;
      left:0;
      bottom: 0;
      z-index: 2;
      background: #fff;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding: p2r($base-padding);
      min-height: p2r(500);
      max-height: p2r(700);
      .textarea-wrapper{
        width: 100%;
        height: p2r(300);
        margin: p2r(20) auto;
        font-size: p2r(26);
      }
      .btn{
        margin: p2r(20) auto;
        font-size: p2r(28);
      }
    }
  }
  .dispatch{
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
    top: 0;
    left: 0;
    z-index: 1;
    padding: p2r($base-padding);
    .x-select,
    .textarea-wrapper{
      width: 100%;
      margin: p2r($base-padding) auto;
      font-size: p2r(28);
    }
    .x-select{
      height: p2r(100);
      .x-option{
        .left{
          flex: 0 0 auto;
        }
        .right{
          text-align: right;
        }
      }
    }
    .textarea-wrapper{
      border: none;
    }
    .btns{
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      padding-bottom: p2r($base-padding);
      .btn{
        font-size: p2r(28);
        margin-top: p2r($base-padding);
        margin-bottom: p2r($base-padding);
        &:first-child{
          margin-top: 0;
        }
      }
    }
  }
}
</style>
