<template>
  <div class="news-detail">
    <h2 class="title">{{detail.Title}}</h2>
    <p class="date">{{detail.AddTime}}</p>
    <div class="content" v-html="detail.Content"></div>
  </div>
</template>
<script>
import api from 'common/api'
import {
  webRoot
} from 'common/data'
export default {
  name: 'NewsDetail',
  data () {
    return {
      id: '',
      detail: {}
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getNewsDetail()
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.getNewsDetail()
    }
  },
  methods: {
    getNewsDetail () {
      api.news.detail(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.detail = res.data.Data
          this.detail.Content = this.detail.Content.replace(/src="\/UploadFiles\//g, `src="${webRoot}/UploadFiles/`)
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
.news-detail{
  overflow-x: hidden;
  padding:p2r($base-padding);
  .title{
    font-size: p2r(36);
    font-weight: 600;
    color:$text-color;
    line-height: 1.4;
  }
  .date{
    font-size: p2r(24);
    color:$thr-color;
    font-weight: 200;
    margin-top: p2r(20);
  }
  .content{
    color: $text-sub-color;
    line-height: 2 !important;
    font-size: p2r(26) !important;
    text-indent: 0 !important;
    font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif !important;
    padding: {
      top: p2r(40);
      bottom: p2r(40);
    }
  }
}
</style>
