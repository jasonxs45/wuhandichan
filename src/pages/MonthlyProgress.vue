<template>
  <div class="monthly-progress">
    <div
      v-for="(item, index) in list"
      :key="'monthlyprogress-'+index"
      :data-id="item.ID"
      class="item"
      @click="goProgressDetail"
    >
      <h3 class="title">{{item.AddTime}}</h3>
      <div class="img">
        <Fitimg :src="item.Img" />
      </div>
      <p class="desc">{{item.Title}}</p>
    </div>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  Fitimg
} from 'components'
import api from 'common/api'
import {
  formatDate
} from 'common/utils/date'
import {
  webRoot
} from 'common/data'
export default {
  name: 'MonthlyProgress',
  components: {
    Flexbox,
    FlexboxItem,
    Fitimg
  },
  data () {
    return {
      fetchedList: null,
      id: null
    }
  },
  computed: {
    list () {
      return this.fetchedList
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.getMonthlyList()
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getMonthlyList()
  },
  methods: {
    getMonthlyList () {
      api.projectprogress.monthlist(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.fetchedList = res.data.Data
          this.fetchedList.forEach(item => {
            item.AddTime = formatDate(new Date(item.AddTime.replace(/-/g, '/')), 'yyyy年MMM月')
            item.Img = webRoot + item.Img
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    goProgressDetail (e) {
      let id = e.currentTarget.dataset.id
      this.$router.push({
        name: 'progressdetail',
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
.monthly-progress{
  padding: p2r($base-padding);
  width:100vw;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: $background-color;
  .item{
    margin:p2r(30) 0;
    background: #fff;
    padding: p2r(30);
    border-radius: 4px;
    &:first-child{
      margin-top: 0;
    }
    .title{
      font-size: p2r(32);
      color:$primary-color;
      font-weight: 600;
    }
    .img{
      width:100%;
      height: p2r(260);
      margin:p2r(30) 0;
      .fit-img{
        border-radius: 4px;
        box-shadow: 0 0 1px 0 rgba(0,0,0,.2);
      }
    }
    .text{
      position: relative;
      .name{
        font-size: p2r(30);
        line-height: 1.7;
        font-weight: 600;
      }
      .updatetime{
        font-size: p2r(24);
        color:$text-sub-color;
        font-weight: 200;
        line-height: 1.7;
        position: absolute;
        left:0;
        bottom:0;
      }
    }
  }
}
</style>
