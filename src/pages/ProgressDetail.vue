<template>
  <div class="progress-detail">
    <h2 class="title">
      {{detail.Title}}
    </h2>
    <p class="date">
      {{detail.AddTime}}
    </p>
    <div class="content" v-html="detail.Content"></div>
  </div>
</template>
<script>
import api from 'common/api'
import {
  formatDate
} from 'common/utils/date'
import {
  webRoot
} from 'common/data'
export default {
  name: 'ProgressDetail',
  data () {
    return {
      fetchedDetail: {},
      id: null
    }
  },
  computed: {
    detail () {
      return this.fetchedDetail
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.getMonthlyDetail()
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getMonthlyDetail()
  },
  methods: {
    getMonthlyDetail () {
      api.projectprogress.detail(this.id)
      .then(({res, index}) => {
        window.$close(index)
        if (res.data.IsSuccess) {
          this.fetchedDetail = res.data.Data
          this.fetchedDetail.AddTime = formatDate(new Date(this.fetchedDetail.AddTime.replace(/-/g, '/')), 'yyyy年MMM月')
          this.fetchedDetail.Content = this.fetchedDetail.Content.replace(/src="\//g, `src="${webRoot}/`)
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.progress-detail{
  padding:p2r($base-padding);
  .title{
    font-size: p2r(32);
    font-weight: 600;
    line-height: 1.4;
  }
  .date{
    font-size: p2r(24);
    color:$thr-color;
    line-height: 1.4;
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
