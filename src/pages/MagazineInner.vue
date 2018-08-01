<template>
  <div class="magazine-inner">
    <div class="bg">
      <Fitimg
        :src="bg"
      />
      <div class="cover"></div>
    </div>
    <div class="panel">
      <Split type="line" />
      <img src="static/images/i2.png" class="i2" alt="">
      <h3 class="title">{{title}}</h3>
      <nodata v-if="links.length<1">暂无内容</nodata>
      <div v-else class="links">
        <div
          v-for="(item, index) in links"
          :key="'link-'+index"
          class="link-item"
        >
          <span
            v-if="!item.Url"
            :data-id="item.ID"
            class="txt"
            @click="goDetail"
          >{{item.Title}}</span>
          <a v-else class="txt" :href="item.Url">{{item.Title}}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Split,
  Fitimg,
  Nodata
} from 'components'
import api from 'common/api'
export default {
  name: 'MagazineInner',
  components: {
    Split,
    Fitimg,
    Nodata
  },
  data () {
    return {
      id: null,
      fetchedData: {}
    }
  },
  computed: {
    title () {
      if (this.fetchedData.Periodical) {
        return this.fetchedData.Periodical.PeriodicalNum
      }
    },
    bg () {
      let bg = 'static/images/coverbg.png'
      // if (this.fetchedData.Periodical) {
      //   bg = 'http://jindi.1juke.cn' + this.fetchedData.Periodical.CoverImg
      // }
      return bg
    },
    links () {
      return this.fetchedData.ArticleList || []
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.getMagazineInner()
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getMagazineInner()
  },
  methods: {
    getMagazineInner () {
      api.magazine.inner(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let fetchedData = res.data.Data
          this.fetchedData = fetchedData
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    goDetail (e) {
      let id = e.currentTarget.dataset.id
      this.$router.push({
        name: 'magazinedetail',
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
.magazine-inner{
  width: 100vw;
  height: 100vh;
  .bg{
    width:100%;
    height: 100%;
    position: relative;
    .fit-img{
      width:100%;
      height: 100%;
      // filter: blur(10px);
    }
    .cover{
      position: absolute;
      top:0;
      left:0;
      width:100%;
      height:100%;
      // background: rgba(0,0,0,.4);
      // backdrop-filter: blur(10px);
    }
  }
  .panel{
    position: absolute;
    top:8%;
    left:5%;
    width:90%;
    height: 82%;
    background: rgba(255,255,255,.9);
    padding:p2r($base-padding*2) p2r($base-padding);
    .nodata{
      margin-top: p2r(100);
    }
    .line{
      & + .i2{
        width: p2r(60);
        height: p2r(60);
        position: absolute;
        top: p2r(97);
        right: p2r(40);
      }
    }
    .title{
      font-size: p2r(44);
      color:$text-color;
      font-weight: 600;
      margin-top: p2r(40);
    }
    .links{
      margin-top: .5rem;
      width:100%;
      height: calc(100% - 3rem);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .link-item{
        display: block;
        padding-left: p2r(55);
        position: relative;
        font-size: p2r(26);
        line-height: 1.5;
        color:$text-color;
        margin: p2r(50) p2r(40);
        .txt{
          color:$text-color;
          font-weight: 600;
        }
        &:before{
          content:'';
          display: block;
          background:url('../../static/images/i1.png') center/cover no-repeat;
          width:p2r(38);
          height:p2r(38);
          position: absolute;
          left:0;
        }
      }
    }
  }
}
</style>
