<template>
  <div class="repair-detail">
    <p class="tag">{{repair.State|formatStatus}}</p>
    <div :class="['repair-detail-wrapper',single ? 'single' : '']">
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
        <div v-if="imgs.length > 0" class="before">
          <p class="title">整改前</p>
          <img-row
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
        </div>
        <template v-if="repair.Name">
          <flexbox>
            <flexbox-item class="engineer-name">
              联系人：{{repair.Name}}
            </flexbox-item>
            <flexbox-item class="tel">
              <a :href="`tel:${repair.Tel}`">{{repair.Tel}}</a>
            </flexbox-item>
          </flexbox>
        </template>
        <div v-if="repair.State === 1" class="current">
          <Split style="margin-bottom: 15px" type="line"/>
          <p class="title">请上传整改后的照片</p>
          <img-row
            :group="uploadImgs"
            :canUpload="true"
            class="imgs"
          >
            <img-cell
              v-for="(item, index) in uploadImgs"
              :index="index"
              :canUpload="true"
              :group="uploadImgs"
              :key="'uploadImg-'+index"
            >
              <Fitimg :src="item" @on-click="previewImg(item, uploadImgs)"/>
            </img-cell>
          </img-row>
          <x-textarea v-model="desc" class="bakinfo" placeholder="请添加整改备注"></x-textarea>
        </div>
      </div>
      <div v-if="detailList.length > 0" class="sub-order-list">
        <div
          v-for="(item, index) in detailList"
          :key="'detail-'+index"
          class="sub-order"
        >
          <flexbox v-if="repair.State > 1">
            <flexbox-item v-if="repair.State === 2" class="state handling">已处理</flexbox-item>
            <flexbox-item v-if="repair.State === 3" class="state done">已完成</flexbox-item>
            <flexbox-item v-if="item.Status" class="timelimit"><span class="tag">{{item.Status}}</span></flexbox-item>
          </flexbox>
          <div class="desc">{{item.Desc}}</div>
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
              处理人：{{item.BuilderName}}
            </flexbox-item>
            <flexbox-item class="tel">
              <a :href="`tel:${item.BuilderTel}`">{{item.BuilderTel}}</a>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
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
    <div :class="['btns', single ? 'single' : '']">
      <Btn
        v-if="repair.State === 1"
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
      id: '',
      uploadImgs: [],
      content: null,
      desc: ''
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
    single () {
      return this.repair.State !== 0
    },
    currentProgress () {
      return this.content
             ? this.content.logList
             : []
    }
  },
  watch: {
    '$route' (to, from) {
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
          str = '已处理'
          break
        case 3:
          str = '已完成'
          break
        case 4:
          str = '已完成'
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
      this.$router.replace({
        name: 'repairengineer',
        params: {
          state: 'treating'
        }
      })
    },
    // 完成总单
    finishOrder () {
      // if (this.uploadImgs.length < 1) {
      //   window.$alert('请上传整改后的照片')
      //   return
      // }
      let desc = this.desc
      if (!desc.trim()) {
        window.$alert('整改备注不能为空')
        return
      }
      let index = window.$confirm({
        title: '提示',
        content: '确定完成吗？',
        btns: ['取消', '确定'],
        yes: () => {
          window.$close(index)
          api.repair.engineer.finishOrder(this.id, this.uploadImgs.join(','), this.desc)
          .then(({res, index}) => {
            if (res.data.IsSuccess) {
              window.$alert({
                title: '提示',
                content: '维修工单已处理！',
                yes: () => {
                  this.$router.push({
                    name: 'repairengineer',
                    params: {
                      state: 'treated'
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
  &>.tag{
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
      .before,
      .current{
        margin-top: p2r(30);
      }
      .current{
        .bakinfo{
          width: 100%;
          margin: p2r(30) 0;
        }
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
    }
    .sub-order-list{
      .sub-order{
        background: #fff;
        margin-top: p2r(10);
        padding: p2r($base-padding);
        position: relative;
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
            color:$primary-color;
          }
          &.done{
            color:$success-color;
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
    position: relative;
    margin-top: p2r(-300);
    background: $background-color;
    padding:p2r(30) 0;
    &.single{
      margin-top: p2r(-180);
    }
    .btn{
      margin-top:p2r(30);
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
