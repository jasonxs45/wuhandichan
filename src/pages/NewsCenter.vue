<template>
  <div class="news-center">
    <div class="swiper">
      <swiper :options="swiperOption" ref="mySwiper" @slideChange="swipeChangeHandler">
        <!-- slides -->
        <swiper-slide
          v-for="(item, index) in banners"
          :key="'banner-'+index"
          :data-id="item.ID"
          @click.native="newsDetail"
        >
          <Fitimg :src="item.Thumbnail" alt="" />
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
    </div>
    <div class="news-list">
      <template v-for="(item, index) in newslist">
        <Split :key="'news-item'+index+Math.random().toString(36).substr(2)"/>
        <flexbox
          :key="'news-item'+index+Math.random().toString(36).substr(2)"
          :data-id="item.ID"
          :data-link="item.Url"
          class="item"
          @click="newsDetail"
        >
          <flexbox-item class="thumb">
            <Fitimg
              :src="item.Thumbnail"
            />
          </flexbox-item>
          <flexbox-item class="text">
            <p class="title">
              {{item.Title}}
            </p>
            <p class="date">{{item.AddTime}}</p>
          </flexbox-item>
        </flexbox>
      </template>
    </div>
  </div>
</template>
<script>
import {
  Icon,
  Split,
  Flexbox,
  FlexboxItem,
  Fitimg
} from 'components'
import {
  webRoot
} from 'common/data'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import api from 'common/api'
export default {
  name: 'NewsCenter',
  components: {
    Icon,
    Split,
    Flexbox,
    FlexboxItem,
    swiper,
    swiperSlide,
    Fitimg
  },
  data () {
    return {
      newslist: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        freeModeMomentumBounce: false,
        effect: 'slide'
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    banners () {
      return this.newslist.slice(0, 5)
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      api.news.list()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.newslist = res.data.Data
          this.newslist.forEach(item => {
            item.Thumbnail = webRoot + item.Thumbnail
            item.Title = item.Title.length > 42 ? item.Title.substring(0, 42) + '...' : item.Title
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    swipeChangeHandler () {
      console.log(this.swiper.activeIndex)
    },
    newsDetail (e) {
      if (!e.currentTarget.dataset.link) {
        this.$router.push({
          name: 'newsdetail',
          params: {
            id: e.currentTarget.dataset.id
          }
        })
      } else {
        window.location.href = e.currentTarget.dataset.link
      }
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
.news-center{
  .news-list{
    .item{
      @include _1px();
      .thumb{
        flex: 0 0 p2r(300);
        height: p2r(200);
        .fit-img{
          width: 100%;
          height: 100%;
        }
      }
      .text{
        padding:p2r(20) p2r(40) p2r(22) p2r(30);
        position: relative;
        .title{
          font-size: p2r(28);
          color:$text-color;
          line-height: p2r(40);
          font-weight: 600;
        }
        .date{
          font-size: p2r(24);
          color:$thr-color;
          font-weight: 200;
          position: absolute;
          bottom: p2r(22);
          left: p2r(30);
        }
      }
    }
  }
}
</style>
