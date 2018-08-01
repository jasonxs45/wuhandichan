<template>
  <div class="repair-detail" :class="sh">
    <p class="tag">{{repair.State|formatStatus}}</p>
    <div :class="['repair-detail-wrapper', repair.State !== 3 ? 'single' : '' ]">
      <div class="detail">
        <flexbox>
          <flexbox-item class="house-name">
            {{repair.ProjectName+repair.StageName}} {{repair.Building}} - {{repair.Unit}}-{{repair.HouseNo}}
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
        <template v-if="repair.AdminName">
          <Split type="line"/>
          <flexbox>
            <flexbox-item class="engineer-name">
              工程师：{{repair.AdminName}}
            </flexbox-item>
            <flexbox-item class="tel">
              <a :href="`tel:${repair.AdminTel}`">{{repair.AdminTel}}</a>
            </flexbox-item>
          </flexbox>
        </template>
        <div v-if="currentProgress && currentProgress.length > 0" class="progress">
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
    </div>
    <div :class="['btns', repair.State !== 3 ? 'single' : '']">
      <!-- 用户 -->
      <Btn
        v-if="repair.State === 3"
        type="primary"
        size="lar"
        text="我要评价"
        @click="toggleShowEvaluate"
      />
      <Btn
        type="default"
        size="lar"
        text="返回"
        @click="back"
      />
    </div>
    <transition name="slide-in-right">
      <div class="evaluate" v-show="showEvaluate">
        <div class="evaluate-wrapper">
          <flexbox
            v-for="(item, index) in questions"
            :key="'question-'+index"
            class="evaluate-item"
          >
            <flexbox-item class="head">{{item}}：</flexbox-item>
            <flexbox-item class="body">
              <span class="left">非常不满意</span>
              <Star :size="36" :data-index="index" @on-rate="gatherScore"/>
              <span class="right">非常满意</span>
            </flexbox-item>
          </flexbox>
          <Split type="line"/>
          <x-textarea v-model="desc" placeholder="请输入您要补充的评价"></x-textarea>
          <img-row
            :group="uploadImgs"
            :canUpload="true"
            @on-upload="uploadImg"
            class="imgs"
          >
            <img-cell
              v-for="(item, index) in uploadImgs"
              :index="index"
              :canUpload="true"
              :group="uploadImgs"
              :del="true"
              :key="'uploadImg-'+index"
            >
              <Fitimg :src="item" @on-click="previewImg(item, uploadImgs)"/>
            </img-cell>
          </img-row>
        </div>
        <Btn type="primary" text="提交" size="lar" class="submit" @click="evaluate"/>
        <Btn type="default" text="取消" size="lar" class="cancel" @click="toggleShowEvaluate"/>
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
  name: 'RepairUserDetail',
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
      showEvaluate: false,
      role: '',
      id: '',
      content: null,
      desc: '',
      uploadImgs: [],
      questions: ['响应速度', '服务态度', '解决问题', '维修保护'],
      scoreArr: [0, 0, 0, 0],
      sh: ''
    }
  },
  computed: {
    repair () {
      return this.content ? this.content.repair : {}
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
    currentProgress () {
      return this.content
             ? this.content.logList
             : []
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
    formatStatus (val) {
      let str = ''
      switch (val) {
        case 0:
          str = '待处理'
          break
        case 1:
          str = '处理中'
          break
        case 2:
          str = '处理中'
          break
        case 3:
          str = '未评价'
          break
        case 4:
          str = '已评价'
          break
        case 5:
          str = '已取消'
          break
        default:
          break
      }
      return str
    },
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
    toggleShowEvaluate () {
      this.showEvaluate = !this.showEvaluate
      if (this.showEvaluate) {
        this.sh = 'sh'
        window.document.querySelector('html').style.overflow = 'hidden'
        window.document.querySelector('html').style.height = '100%'
        window.document.querySelector('body').style.overflow = 'hidden'
        window.document.querySelector('body').style.height = '100%'
      } else {
        this.sh = ''
        window.document.querySelector('html').style.overflow = ''
        window.document.querySelector('html').style.height = ''
        window.document.querySelector('body').style.overflow = ''
        window.document.querySelector('body').style.height = ''
      }
    },
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
    uploadImg (res) {
      this.uploadImgs.push(res)
    },
    previewImg (cur, groups) {
      let current = window.location.origin + cur
      let urls = groups.map(item => window.location.origin + item)
      wxConf.previewImg({
        current,
        urls
      })
    },
    gatherScore (val) {
      let index = event.currentTarget.dataset.index
      this.scoreArr[index] = val
    },
    evaluate () {
      let _self = this
      if (this.scoreArr.some(item => item === 0)) {
        window.$alert('请完成评分！')
        return
      }
      let opt = {
        ID: this.id,
        EvaluateScore1: this.scoreArr[0],
        EvaluateScore2: this.scoreArr[1],
        EvaluateScore3: this.scoreArr[2],
        EvaluateScore4: this.scoreArr[3],
        EvaluateContent: this.desc,
        Images: this.uploadImgs.join(',')
      }
      api.repair.user.evaluate(opt)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '提交成功',
            yes () {
              window.$close(index)
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
.repair-detail{
  width: 100vw;
  &.sh{
    overflow: hidden;
  }
  .tag{
    display: inline-block;
    background: #ccc;
    color:$text-color;
    padding: p2r(10) p2r(15);
    border-top-right-radius: 4px;
    position: absolute;
    top:0;
    right:0;
  }
  .repair-detail-wrapper{
    min-height: 100vh;
    padding-bottom: p2r(340);
    background: $background-color;
    &.single{
      min-height: 100vh;
      padding-bottom: p2r(200);
      background: $background-color;
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
  }
  &>.btns{
    position: relative;
    margin-top: p2r(-250);
    &.single{
      margin-top: p2r(-150);
    }
    .btn{
      margin: p2r(20) auto;
      &:first-child{
        margin-top: 0;
      }
    }
  }
  .evaluate{
    position: fixed;
    width:100%;
    height: 100%;
    top: 0;
    left:0;
    z-index: 1200;
    background: $background-color;
    .evaluate-wrapper{
      background: #fff;
      padding: p2r($base-padding);
      .evaluate-item{
        margin: p2r(30) 0 0;
        &:first-child{
          margin-top: 0;
        }
        .head{
          flex: 0 0 p2r(150);
          width:p2r(150);
          line-height: p2r(36);
          font-size: p2r(26);
        }
        .body{
          .left,
          .star,
          .right{
            display: inline-block;
            vertical-align: top;
            color: $text-sub-color;
          }
          .left,
          .right{
            line-height: p2r(36);
            font-size: p2r(24);
          }
          .star{
            margin: 0 p2r(30);
          }
        }
      }
      .split{
        margin-top: p2r($base-padding * 2);
      }
      .textarea-wrapper{
        width:100%;
        margin-top: p2r($base-padding * 1.5);
        background: #f2f2f2;
        border: none;
      }
      .imgs{
        margin-top: p2r($base-padding);
      }
    }
    &>.btn{
      position: absolute;
      left: 50%;
      bottom: p2r(80);
      margin-left: p2r(-295);
      &.submit{
        bottom: p2r(200);
      }
    }
  }
}
</style>
