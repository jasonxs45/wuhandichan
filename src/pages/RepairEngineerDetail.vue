<template>
  <div class="repair-detail">
    <div
      :class="[
                'repair-detail-wrapper',
                role,
                singleBtn,
                repair.State === 1
                ? 'triple'
                : ''
              ]"
    >
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
            <Fitimg :src="item" @on-click="previewImg(item, imgs)"/>
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
        <template v-if="repair.EvaluateScore">
          <Split type="line"/>
          <flexbox class="order-score">
            <flexbox-item class="left">
              维修评价
            </flexbox-item>
            <flexbox-item class="right">
              <Star :size="24" readOnly :score="repair.EvaluateScore"/>
            </flexbox-item>
          </flexbox>
        </template>
      </div>
      <div v-if="repair.State === 5" class="refuse-info">
        <Split type="line"/>
        <div class="refuse-info-wrapper">
          <flexbox>
            <flexbox-item class="left">
              已拒单
            </flexbox-item>
            <flexbox-item class="right">
              {{repair.RefuseTime|formatdate}}
            </flexbox-item>
          </flexbox>
          <x-textarea class="refuse-reason" readonly :value="repair.RefuseReason"></x-textarea>
        </div>
      </div>
      <div v-if="detailList.length > 0" class="sub-order-list">
        <div
          v-for="(item, index) in detailList"
          :key="'detail-'+index"
          class="sub-order"
        >
          <flexbox v-if="repair.State > 1">
            <flexbox-item class="state" :class="item.State === 0 ? 'handling' : 'done'">{{item.State === 0 ? '处理中' : '已完成'}}</flexbox-item>
            <flexbox-item v-if="item.Status" class="timelimit"><span class="tag">{{item.Status}}</span></flexbox-item>
          </flexbox>
          <div class="desc">{{item.TypeName}}</div>
          <div v-if="item.Images.length > 0" class="more-detail">
            <img-row
              :group="item.Images"
              :canUpload="false"
              class="imgs"
            >
              <img-cell
                v-for="(img, index) in item.Images"
                :index="index"
                :canUpload="false"
                :group="item.Images"
                :key="'subupimg-'+index"
              >
                <Fitimg :src="img" @on-click="previewImg(img, item.Images)"/>
              </img-cell>
            </img-row>
            <Split type="line" />
          </div>
          <flexbox v-if="repair.State > 1">
            <flexbox-item class="builder-name">
              处理时间：
            </flexbox-item>
            <flexbox-item class="tel">
              {{item.AddTime|formatdate}}
            </flexbox-item>
          </flexbox>
          <flexbox v-if="repair.State > 1">
            <flexbox-item class="builder-name">
              预计完成时间：
            </flexbox-item>
            <flexbox-item class="tel">
              {{item.ExpectTime|formatdate}}
            </flexbox-item>
          </flexbox>
          <flexbox v-if="item.FinishTime">
            <flexbox-item class="builder-name">
              完成时间：
            </flexbox-item>
            <flexbox-item class="tel">
              {{item.FinishTime|formatdate}}
            </flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item class="builder-name">
              处理单位：{{item.BuilderName}}
            </flexbox-item>
            <flexbox-item class="tel">
              <a :href="`tel:${item.BuilderTel}`">{{item.BuilderTel}}</a>
            </flexbox-item>
          </flexbox>
          <div class="operation">
            <Split type="line"/>
            <div class="operation-btns">
              <span
                v-if="repair.State ===2 && item.State === 0"
                done
                class="btn"
                @click="finishSubOrder(item.ID)"
              >完成</span>
              <span
                v-if="repair.State === 1"
                del
                class="btn"
                @click="delSubOrder(item.ID)"
              >删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="[
                  'btns',
                  singleBtn,
                  repair.State === 1
                  ? 'triple'
                  : ''
                 ]">
      <!-- 工程师 -->
      <Btn
        v-if="repair.State === 0"
        type="primary"
        text="确认受理"
        size="lar"
        @click="handleConfirm"
      />
      <flexbox class="double">
        <Btn
          v-if="repair.State === 1"
          type="primary"
          :text="detailList && detailList.length > 0 ? '继续添加' : '添加问题'"
          class="inline flexbox-item"
          @click="goAllot"
        />
        <Btn
          v-if="repair.State === 1 && detailList && detailList.length > 0"
          type="primary"
          text="开始维修"
          class="inline flexbox-item"
          @click="startRepair"
        />
        <Btn
          v-if="repair.State === 1 && !detailList.length"
          type="primary"
          size="lar"
          text="取消受理"
          class="inline flexbox-item"
          @click="toggleRefuse"
        />
      </flexbox>
      <Btn
        v-if="repair.State === 2 && detailList.every(item => item.State === 1)"
        type="primary"
        text="完成维修"
        size="lar"
        @click="finishOrder(repair.ID)"
      />
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
          <x-textarea v-model="refuseReason" placeholder="请填写拒绝理由"></x-textarea>
          <Btn type="primary" text="提交" size="lar" @click="submitRefuse"/>
          <Btn type="default" text="取消" size="lar" @click="toggleRefuse"/>
        </div>
      </transition>
    </div>
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
  XTextarea
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
  name: 'RepairEngineerDetail',
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
    XTextarea
  },
  data () {
    return {
      role: '',
      id: '',
      refuseReason: '',
      content: null,
      desc: '',
      showRefuse: false
    }
  },
  computed: {
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
    },
    singleBtn () {
      let see = this.content
                ? this.content.repair.State === 2 && this.content.detailList.some(item => item.State !== 1)
                : false
      if (this.content) {
        console.log(this.content.repair.State === 2 && this.content.detailList.some(item => item.State !== 1))
      }
      return this.content
             ? this.content.repair.State === 3 ||
               this.content.repair.State === 4 ||
               this.content.repair.State === 5 ||
               see
             ? 'single'
             : ''
             : ''
    }
  },
  watch: {
    '$route' (to, from) {
      this.role = to.params.role
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
      let current = window.location.origin + cur
      let urls = groups.map(item => window.location.origin + item)
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
    // 工程师
    handleConfirm () {
      api.repair.engineer.handleConfirm(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert({
            content: '已受理成功'
          })
          this.repair.State = 1
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    /* =====拒绝受理==== */
    // 弹层
    toggleRefuse () {
      this.showRefuse = !this.showRefuse
    },
    // 拒绝
    submitRefuse () {
      let _self = this
      if (!this.refuseReason) {
        window.$alert('请填写拒绝理由')
        return
      }
      api.repair.engineer.refuse(this.id, this.refuseReason)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert({
            content: '拒单申请已提交',
            yes () {
              _self.$router.push({
                name: 'repairengineer',
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
    /* =====分单相关操作==== */
    // 转到分单提交页
    goAllot () {
      this.$router.push({
        name: 'repairorderallot',
        params: {
          id: this.id
        }
      })
    },
    // 删除分单
    delSubOrder (id) {
      let _self = this
      let index = window.$confirm({
        content: '确定删除吗？',
        yes () {
          window.$close(index)
          if (_self.content.detailList) {
            _self.content.detailList = _self.content.detailList.filter(item => item.ID !== id)
          }
          api.repair.engineer.delSubOrder(id)
          .then(({res, index}) => {
            if (res.data.IsSuccess) {
              window.$alert({
                content: '删除成功！'
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
    // 开始维修
    startRepair () {
      let _self = this
      let index = window.$confirm({
        content: '开始维修后，不可删除子报修单<br/>确定吗？',
        yes () {
          window.$close(index)
          api.repair.engineer.startRepair(_self.repair.ID)
          .then(({res, index}) => {
            if (res.data.IsSuccess) {
              window.$alert({
                content: '提交成功！'
              })
              _self.content.repair.State = 2
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
    // 完成子报修单
    finishSubOrder (id) {
      let _self = this
      api.repair.engineer.finishSubOrder(id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '提交成功！',
            yes () {
              window.$close(index)
              _self.getDetail()
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
    // 完成总单
    finishOrder (id) {
      let _self = this
      api.repair.engineer.finishOrder(id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert({
            title: '恭喜您',
            content: '报修工单完成！',
            yes () {
              _self.$router.push({
                name: 'repairengineer',
                params: {
                  state: 'finished'
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
.repair-detail{
  width: 100vw;
  background: $background-color;
  .repair-detail-wrapper{
    min-height: 100vh;
    padding-bottom: p2r(340);
    background: $background-color;
    &.single{
      padding-bottom: p2r(200);
    }
    &.triple{
      padding-bottom: p2r(350);
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
      .engineer-name,
      .tel{
        font-size: p2r(26);
        margin-top: p2r(40);
      }
      .tel{
        text-align: right;
      }
      .progress{
        margin-top: p2r(20);
        padding:p2r($base-padding);
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
      .order-score{
        margin-top: p2r(30);
        .left,.right{
          color: $thr-color;
          font-size: 12px;
        }
        .right{
          text-align: right;
        }
      }
    }
    .refuse-info {
      background: #fff;
      padding-top: p2r(50);
      .refuse-info-wrapper{
        padding: p2r($base-padding);
        .left,
        .right{
          font-size: p2r(26);
        }
        .left{
          color: $primary-color;
        }
        .right{
          text-align: right;
          color: $thr-color;
        }
        .refuse-reason{
          width: 100%;
          border: none;
          height: auto;
          font-size: p2r(24);
          margin-top: p2r($base-padding);
        }
      }
    }
    .sub-order-list{
      .sub-order{
        background: #fff;
        margin-top: p2r(10);
        padding: p2r($base-padding);
        &:first-child{
          margin-top: p2r(20);
        }
        .desc{
          background: #eee;
          padding: p2r(30) p2r(20);
          border-radius: 4px;
          // margin-top: p2r(20);
        }
        .more-detail{
          margin: p2r(10) p2r(-10) 0;
          .split{
            margin-top: p2r(30);
          }
        }
        .builder-name, .tel{
          margin-top: p2r(20);
          color: $thr-color;
          font-size: p2r(22);
        }
        .tel, .timelimit{
          text-align: right;
        }
        .state, .timelimit{
          font-size: p2r(22);
          margin-bottom: p2r(20);
        }
        .state{
          padding-top: p2r(5);
          &.handling{
            color:$success-color;
          }
          &.done{
            color:$primary-color;
          }
        }
        .timelimit{
          .tag{
            background: $primary-color;
            color:#fff;
            display: inline-block;
            border-radius: 25px;
            padding:p2r(5) p2r(20);
          }
        }
        .operation{
          margin-top: p2r(20);
          .operation-btns{
            margin-top: p2r(20);
            font-size: 0;
            text-align: right;
            .btn{
              display: inline-block;
              vertical-align: top;
              font-size: p2r(24);
              padding: p2r(15) p2r(60);
              margin-left: p2r(20);
              border-radius: 4px;
              &[done]{
                background: $link-color;
                border:none;
                color:#fff;
              }
              &[del]{
                background: $warning-color;
                border:none;
                color:#fff;
              }
            }
          }
        }
      }
    }
  }
  &>.btns{
    position: relative;
    margin-top: p2r(-300);
    background: $background-color;
    &.single{
      margin-top: p2r(-150);
    }
    &.triple{
      margin-top: p2r(-300);
    }
    .double{
      width: p2r(600);
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
      margin: {
        top: p2r(30);
      }
      font-size: p2r(30);
      &.inline{
        width: p2r(280);
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
}
</style>
