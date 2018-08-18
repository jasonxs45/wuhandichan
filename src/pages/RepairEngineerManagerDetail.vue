<template>
  <div class="repair-detail">
    <div :class="['repair-detail-wrapper', role, singleBtn ? 'single' : '']">
      <div class="detail">
        <flexbox>
          <flexbox-item class="house-name">
            {{repair.ProjectName + repair.StageName}} {{repair.Building}} - {{repair.Unit}}-{{repair.HouseNo}}
          </flexbox-item>
          <flexbox-item class="date">
            {{repair.AddTime|formatdate}}
          </flexbox-item>
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
          <flexbox>
            <flexbox-item class="engineer-name">
              联系人：{{repair.Name}}
            </flexbox-item>
            <flexbox-item class="tel">
              <a :href="`tel:${repair.Tel}`">{{repair.Tel}}</a>
            </flexbox-item>
          </flexbox>
        </template>
      </div>
      <div class="refuse-info">
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
      </div>
    </div>
    <div :class="['btns', singleBtn ? 'single' : '']">
      <!-- 工程师主管 -->
      <flexbox v-if="!singleBtn" class="double">
        <Btn
          text="驳回"
          class="inline flexbox-item opa"
          @click="toggleRefuse"
        />
        <Btn
          type="base"
          size="lar"
          text="重新分单"
          class="inline flexbox-item"
          @click="toggleDispatch"
        />
        <Btn
          type="primary"
          text="同意"
          class="inline flexbox-item"
          @click="agree"
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
    <transition name="slide-in-right">
      <div class="dispatch" v-show="showDispatch">
        <div class="dispatch-wrapper">
          <x-select v-model="selectedEngineer" placeholder="选择重新分配的工程师">
            <x-option
              v-for="(engineer, index) in engineers"
              :key="'engineer-' + index"
              :label="engineer.CompanyName"
              :value="engineer.ID"
            >
              <flexbox>
                <flexbox-item class="left">{{engineer.CompanyName}}</flexbox-item>
                <flexbox-item class="right"></flexbox-item>
              </flexbox>
            </x-option>
          </x-select>
          <x-textarea v-model="allotReason" placeholder="请填写分配原因"></x-textarea>
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
      allotReason: ''
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
    imgs () {
      let arr
      if (this.content) {
        arr = this.content.repair.Images.split(',')
        if (arr.length === 1 && arr[0] === '') {
          arr = []
        } else {
          arr = arr.map(item => webRoot + item)
        }
      } else {
        arr = []
      }
      return arr
    }
  },
  watch: {
    '$route' (to, from) {
      this.role = to.params.role
      this.id = to.params.id
      this.stateType = to.query.type
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
    this.stateType = this.$route.query.type
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
    previewImg (cur) {
      let current = window.location.origin + cur
      let urls = this.imgs.map(item => window.location.origin + item)
      wxConf.previewImg({
        current,
        urls
      })
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
    },
    /* =====驳回拒绝==== */
    submitRefuse () {
      let _self = this
      if (!this.refuseReason) {
        window.$alert('请填写驳回理由')
        return
      }
      api.repair.engineermanager.refuse(this.id, this.refuseReason)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '已成功驳回拒单！',
            yes () {
              window.$close(index)
              if (window.history.length >= 2) {
              _self.$router.replace({
                name: 'repairengineermanager',
                params: {
                  state: 'untreated'
                }
              })
              } else {
                if (window.wx) {
                  wxConf.closeWindow()
                } else {
                  window.close()
                }
              }
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
    /* =====驳回拒绝==== */
    agree () {
      let _self = this
      api.repair.engineermanager.agree(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '已同意拒单！',
            yes () {
              window.$close(index)
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
    },
    /* =====获取工程师列表==== */
    getEngineers () {
      api.repair.engineermanager.getEngineers()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.engineerList = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    /* =====更换工程师==== */
    changeEngineer () {
      if (!this.selectedEngineer.value && this.selectedEngineer.value !== 0) {
        window.$alert('请选择分配的工程师')
        return
      }
      if (!this.allotReason) {
        window.$alert('请填写分配原因')
        return
      }
      let _self = this
      api.repair.engineermanager.change(this.id, this.selectedEngineer.value, this.allotReason)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '分单成功！',
            yes () {
              window.$close(index)
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
    },
    // 弹层
    toggleRefuse () {
      this.showRefuse = !this.showRefuse
    },
    toggleDispatch () {
      if (!this.showDispatch) {
        this.getEngineers()
      }
      this.showDispatch = !this.showDispatch
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
        line-height: p2r(28 * 1.7);
        color: $thr-color;
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
      margin-top: p2r(40);
    }
    .tel{
      text-align: right;
    }
    .refuse-info{
      background: #fff;
      padding-top: p2r($base-padding / 3 * 4);
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
  }
  &>.btns{
    position: relative;
    margin-top: p2r(-300);
    background: $background-color;
    &.single{
      margin-top: p2r(-180);
    }
    .double{
      width: p2r(640);
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
      width: p2r(640);
      margin: {
        top: p2r(30);
      }
      font-size: p2r(30);
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
