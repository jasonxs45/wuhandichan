<template>
  <div class="index">
    <div class="swiper">
      <swiper :options="swiperOption" ref="mySwiper" @slideChange="swipeChangeHandler">
        <!-- slides -->
        <swiper-slide
          v-for="(item, index) in banners"
          :key="'banner-'+index"
        >
          <Fitimg :src="item.Thumbnail" alt="" />
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
    </div>
    <flexbox
      class="entries"
      wrap="wrap"
      align="center"
      justify="center">
      <flexbox-item
        v-for="(item, index) in entries"
        :key="'entery'+index">
        <router-link :to="item.link" tag="div" class="entry">
          <Icon :name="item.icon"/>
          <p class="name">{{item.name}}</p>
        </router-link>
      </flexbox-item>
    </flexbox>
    <Split />
    <flexbox class="notice-board" style="display:none">
      <flexbox-item class="head">
        <img src="static/images/notice-board.png" alt="" @click="goNewsCenter"/>
      </flexbox-item>
      <flexbox-item>
        <flexbox
          class="notice-wrapper"
          direction="column"
          justify="center"
        >
          <flexbox-item
            v-for="(item, index) in newslist"
            :key="'news'+index"
          >
            <p class="notice" :data-id="item.ID" @click="goNewsDetail">{{item.Title}}</p>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
    <Split />
    <div class="activity-board">
      <statisctitle text="武汉地产·美好生活家">
        <router-link tag="div" to="/activitylist/activity" slot="more">
          <span class="text">更多</span><Icon name="arrow-right1"/>
        </router-link>
      </statisctitle>
      <activitycard
        v-for="(item, index) in list"
        :data-id="item.id"
        :key="'activity-'+index"
        :img="item.img"
        :title="item.title"
        :playDateRange="item.playDateRange"
        :read-num="item.readNum"
        :state="item.state"
      ></activitycard>
    </div>
  </div>
</template>
<script>
 import {
    Icon,
    Fitimg,
    Flexbox,
    FlexboxItem,
    Split,
    Statisctitle,
    Activitycard
  } from 'components'
  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import api from 'common/api'
  import {
    formatDate
  } from 'common/utils/date'
  import {
    webRoot,
    entries
  } from 'common/data'
  export default {
    name: 'Home',
    components: {
      Icon,
      Fitimg,
      Flexbox,
      FlexboxItem,
      Split,
      Statisctitle,
      Activitycard,
      swiper,
      swiperSlide
    },
    data () {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          freeModeMomentumBounce: false,
          effect: 'slide'
        },
        entries: entries.filter(
          item => item.name === '个人中心' ||
                  item.name === '合同查询' ||
                  item.name === '工程进度' ||
                  item.name === '业主报修' ||
                  item.name === '投诉建议' ||
                  item.name === '武汉地产家书'
        ),
        newslist: [],
        activityList: []
      }
    },
    computed: {
      banners () {
        return this.newslist
      },
      list () {
        return this.activityList.map(item => {
          return {
            id: item.ID,
            img: item.Img,
            title: item.Name,
            applyDateRange: formatDate(new Date(item.ApplyStart), 'yyyy/MM/dd') + '-' + formatDate(new Date(item.ApplyEnd), 'yyyy/MM/dd'),
            playDateRange: formatDate(new Date(item.PlayStart), 'yyyy/MM/dd') + '-' + formatDate(new Date(item.PlayEnd), 'yyyy/MM/dd'),
            readNum: item.ViewCount,
            state: item.IsOver ? 1 : 0
          }
        })
      },
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    created () {
      this.getActivityList()
      this.getNewsList()
    },
    methods: {
      getActivityList () {
        api.activity.list()
        .then(({res, index}) => {
          if (res.data.IsSuccess) {
            let activityList = res.data.Data
            this.activityList = activityList.filter((item, index) => {
              item.PlayStart = formatDate(new Date(item.PlayStart), 'yyyy/MM/dd hh:mm')
              item.PlayEnd = formatDate(new Date(item.PlayEnd), 'yyyy/MM/dd hh:mm')
              item.Img = webRoot + item.Img
              return index < 2
            })
          } else {
            window.$alert(res.data.Message)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getNewsList () {
        api.news.list()
        .then(({res, index}) => {
          if (res.data.IsSuccess) {
            let newslist = res.data.Data
            this.newslist = newslist.filter((item, index) => {
              item.Thumbnail = webRoot + item.Thumbnail
              return index < 2
            })
          } else {
            window.$alert(res.data.Message)
          }
        })
        .catch(err => {
          console.log(err)
        })
      },
      swipeChangeHandler () {
        console.log(this.swiper.activeIndex)
      },
      goNewsCenter () {
        this.$router.push({
          name: 'newscenter'
        })
      },
      goNewsDetail (e) {
        let id = e.currentTarget.dataset.id
        this.$router.push({
          name: 'newsdetail',
          params: {
            id
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.swiper{
  width:100%;
  height:p2r(300);
  background: #fff;
  .swiper-container{
    width:100%;
    height:100%;
  }
}
.entries{
  background: #fff;
  height:p2r(320);
  .flexbox-item{
    flex: 0 0 33.3333333%;
    .entry{
      text-align: center;
      height:p2r(160);
      padding-top:p2r(40);
      .iconfont{
        font-size: p2r(40);
        color:$primary-color;
      }
      .name{
        margin-top: p2r(20);
        font-size: p2r(26);
        color:$text-color;
        font-weight: 200;
      }
    }
  }
}
.notice-board{
  width:100%;
  height: p2r(96);
  background:#fff;
  .head{
    flex:0 0 p2r(254);
  }
  .notice-wrapper{
    width:100%;
    height:100%;
    overflow: hidden;
    .notice{
      color:$text-color;
      font-size: p2r(24);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      height:p2r(48);
      line-height: p2r(48);
      padding-left:p2r(30);
      position: relative;
      font-weight: 200;
      &:before{
        content: '';
        display: inline-block;
        width: p2r(10);
        height: p2r(10);
        background: $primary-color;
        position: absolute;
        left: p2r(10);
        top:50%;
        margin-top: p2r(-5);
      }
    }
  }
}
.activity-board{
  padding: p2r($base-padding);
  background:#fff;
  .title{
    .more{
      .text{
        font-weight: 200;
      }
      .iconfont{
        font-size: p2r(24);
        margin-left: p2r(10);
      }
    }
  }
}
</style>
