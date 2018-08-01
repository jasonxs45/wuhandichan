<template>
  <div class="magazine">
    <h2 class="title">武汉地产家书</h2>
    <p class="desc">{{desc}}</p>
    <div v-if="fetchedList.length>0" class="date">{{this.fetchedList[activeSwipeIndex].AddTime}}</div>
    <div class="swiper">
      <swiper :options="swiperOption" ref="mySwiper" @slideChange="swipeChangeHandler">
        <!-- slides -->
        <swiper-slide
          v-for="(item, index) in banners"
          :key="'banner-'+index"
          :data-id="item.id"
          @click.native="goInner"
        >
          <p class="tit">{{item.title}}</p>
          <Fitimg :src="item.img" alt="" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {
  Fitimg
} from 'components'
import {
  formatDate
} from 'common/utils/date'
import {
  webRoot
} from 'common/data'
import api from 'common/api'
export default {
  name: 'Magazine',
  components: {
    swiper,
    swiperSlide,
    Fitimg
  },
  data () {
    return {
      fetchedList: [],
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
      activeSwipeIndex: 0
    }
  },
  computed: {
    banners () {
      return this.fetchedList.map(item => {
        return {
          title: item.Title,
          img: item.CoverImg,
          id: item.ID,
          desc: item.Description
        }
      })
    },
    desc () {
      if (this.banners.length > 0) {
        return this.banners[this.activeSwipeIndex].desc
      }
    },
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  created () {
    this.getMagazineList()
  },
  methods: {
    getMagazineList () {
      api.magazine.list()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let fetchedList = res.data.Data
          fetchedList.forEach(item => {
            item.CoverImg = webRoot + item.CoverImg
            item.AddTime = formatDate(new Date(item.AddTime), 'MM')
          })
          this.fetchedList = fetchedList
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    swipeChangeHandler (val) {
      this.activeSwipeIndex = this.swiper.activeIndex
    },
    goInner (e) {
      let id = e.currentTarget.dataset.id
      this.$router.push({
        name: 'magazineinner',
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
.magazine{
  width: 100vw;
  height: 100vh;
  position: relative;
  background: url('../../static/images/magabg.png') center bottom/contain no-repeat;
  .title{
    padding-top: p2r(60);
    padding-left: p2r(60);
    font-size: p2r(62);
    color:$thr-color;
    font-weight: bold;
  }
  .desc{
    font-size: p2r(24);
    color:$text-color;
    line-height: 1.3;
    padding: p2r(20) p2r(60) 0;
  }
  .date{
    position: absolute;
    z-index: -1;
    font-weight: bolder;
    font-size: p2r(460);
    line-height: 1;
    top: p2r(-90);
    left: p2r(-90);
    color: $text-color;
    opacity: .05;
  }
  .swiper{
    width:100%;
    height: p2r(900);
    position: absolute;
    bottom: 0;
    .swiper-container{
      width:100%;
      height: 100%;
      padding-top: p2r(20);
      .swiper-slide{
        width:p2r(500) !important;
        height:p2r(795) !important;
        transform: scale(.9);
        transition: transform .3s;
        &.swiper-slide-active{
          transform: scale(1);
        }
        .tit{
          font-size: p2r(30);
          color: $text-color;
          margin: p2r(30) 0;
        }
        .fit-img{
          display: block;
          width:100%;
          height: p2r(682);
          background: #fff;
          padding: p2r(20);
          box-shadow: 0 8px 20px 0 rgba(0,0,0,.2);
        }
      }
    }
  }
}
</style>
