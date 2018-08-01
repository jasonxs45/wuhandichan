<template>
<div>
  <div class="trades" v-if="fetchedData.length>0">
    <div class="swiper">
      <swiper
        v-if="banners.length>0"
        :options="swiperOption"
        :activeIndex="activeSwipeIndex"
        ref="mySwiper"
        @slideChange="swipeChangeHandler"
      >
        <swiper-slide
          v-for="(item, index) in banners"
          :key="'house-'+index"
        >
          <span class="house-name">{{item}}</span>
        </swiper-slide>
      </swiper>
    </div>
    <div v-if="currentProgress.length>0" class="progress">
      <div>
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
              <p class="time">{{item.StatusTime|formatdate}}</p>
              <p class="desc">
                {{
                  item.Status === '已受理'
                  ? '尊敬的业主，您好！您在收楼时报修的问题，我中心已安排维修处理，并将在维修完成后电话通知您。如有其它问题欢迎致电：'
                  : '尊敬的业主，您好！您在收楼时报修的问题已维修处理完毕，请您及时查看现场，如您还有其它疑问，欢迎致电：'
                }}
              </p>
              <div class="info">
                <p>保修中心：{{item.RepairName}}</p>
                <p>保修电话：<a :href="`tel:${item.RepairTel}`">{{item.RepairTel}}</a></p>
              </div>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <!-- <p class="tip">温馨提示：以上数据在每周五更新，具体以您收到的通知领取短信及实际领取时间为准。</p> -->
    </div>
    <div v-else class="no-data-guide">
      <nodata>暂无信息</nodata>
    </div>
  </div>
  <div v-if="state === 0" class="no-data-guide">
    <nodata>暂无房源信息</nodata>
    <Btn type="primary" text="绑定房产" @click="goBind"/>
  </div>
</div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  Icon,
  Nodata,
  Btn
} from 'components'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {
  formatDate
} from 'common/utils/date'
import api from 'common/api'
export default {
  name: 'Deliver',
  components: {
    swiper,
    swiperSlide,
    Flexbox,
    FlexboxItem,
    Icon,
    Nodata,
    Btn
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 20,
        pagination: {
          el: '.swiper-pagination'
        },
        freeModeMomentumBounce: false,
        effect: 'slide'
      },
      activeSwipeIndex: 0,
      fetchedData: []
    }
  },
  computed: {
    state () {
      return this.$store.state.userInfo.state
    },
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    banners () {
      if (this.fetchedData) {
        return this.fetchedData.map(item => {
          return item.House.StageName + ' ' + item.House.Building + ' - ' + item.House.Unit + '单元' + item.House.HouseNo
        })
      }
    },
    currentProgress () {
      let currentArr = []
      if (this.fetchedData.length) {
        let progressArr = this.fetchedData.map(item => {
          return item.Process
        })
        currentArr = progressArr[this.activeSwipeIndex]
      }
      return currentArr
    }
  },
  watch: {
    state (newVal, oldVal) {
      if (newVal !== 3) {
        // this.checkIdentity()
      }
    }
  },
  filters: {
    formatdate (val) {
      return formatDate(new Date(val), 'yyyy/MM/dd')
    }
  },
  created () {
    // this.checkIdentity()
    this.getProgress()
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
    getProgress () {
      api.thirdserviceprogress.list()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.fetchedData = res.data.Data.Permit
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    swipeChangeHandler () {
      this.activeSwipeIndex = this.swiper.activeIndex
    },
    goBind () {
      this.$router.push('/bind/bindowner')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
  .trade-progress{
    width:100vw;
    height: 100vh;
    .top{
      width: 100%;
      height: p2r(300);
      background: url('../../../static/images/uctop.png') center/cover no-repeat;
      .tab{
        height: p2r(100);
        background: #fff;
        .tabnav-item{
          font-size: p2r(28);
          &.tabnav-item-active{
            color:$primary-color;
          }
          &:after{
            width:50%;
            left:25%;
            height:4px;
            border-radius: 25px;
          }
        }
      }
    }
    .trades{
      height:calc(100% - 6.4rem);
      padding-top: p2r(10);
      .swiper{
        margin-top: p2r(-70);
        height:p2r(180);
        .swiper-container{
          height:100%;
          .swiper-slide{
            width:p2r(560);
            text-align: center;
            .house-name{
              width:p2r(500);
              height:p2r(140);
              font-size: p2r(28);
              color:$primary-color;
              text-align: center;
              line-height: p2r(140);
              display: inline-block;
              box-shadow: 0 2px 20px 0 rgba(0,0,0,.3);
              border-radius: 4px;
              background: #fff;
            }
          }
        }
      }
      .progress{
        padding:p2r($base-padding) p2r($base-padding / 3 * 4);
        height:calc(100% - 2.3466666rem);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .tip{
          font-size: p2r(24);
          color: $thr-color;
          line-height: 1.5;
          margin: p2r(60) 0 p2r(30);
          text-align: center;
        }
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
              z-index: -1;
            }
          }
          .item-body{
            padding-left: p2r(54);
            .time{
              font-size: p2r(24);
              color:$thr-color;
              font-weight: 200;
            }
            .desc{
              margin-top: p2r(20);
              font-size: p2r(26);
              line-height: 1.5;
              color: $text-sub-color;
              .status{
                color:$primary-color;
              }
            }
            .info{
              margin-top: p2r(30);
              margin-bottom: p2r(50);
              font-size: p2r(24);
              color:$text-color;
              background: $background-color;
              padding: p2r(20);
              font-weight: 200;
              line-height: 1.7;
              border-radius: 4px;
              &.opa{
                height: 1px;
                padding:0;
              }
            }
          }
        }
      }
    }
    .no-data-guide{
      padding:p2r(300) p2r($base-padding) 0;
      text-align: center;
    }
  }
</style>
