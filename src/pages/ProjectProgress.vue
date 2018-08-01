<template>
  <div class="project-progress">
    <div class="search-box">
      <div class="search">
        <XInput v-model="keywords" class="search-input" placeholder="搜索您要查看的项目"/>
        <Icon name="search" @on-click="getProjectList"/>
      </div>
    </div>
    <div class="content">
      <nodata v-if="list.length < 1">暂无数据</nodata>
      <div
        v-for="(item, index) in list"
        :key="'project-'+index"
        :data-id="item.ID"
        class="item"
        @click="goMonthlyList"
      >
        <div class="img">
          <Fitimg :src="item.Logo"/>
        </div>
        <div class="text">
          <h3 class="name">
            <span class="txt"> {{item.ProjectName}}【{{item.ShortName}}】</span>
          </h3>
          <p v-if="item.Address" class="address">地址：{{item.Address}}</p>
          <p class="updatetime">更新时间<i>{{item.Ext}}</i></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  Fitimg,
  XInput,
  Icon,
  Nodata
} from 'components'
import api from 'common/api'
import {
  formatDate
} from 'common/utils/date'
import {
  webRoot
} from 'common/data'
export default {
  name: 'ProjectProgress',
  components: {
    Flexbox,
    FlexboxItem,
    Fitimg,
    XInput,
    Icon,
    Nodata
  },
  data () {
    return {
      keywords: '',
      fetchedList: []
    }
  },
  computed: {
    list () {
      return this.fetchedList
    }
  },
  created () {
    this.getProjectList()
  },
  methods: {
    getProjectList () {
      let keywords = this.keywords
      api.projectprogress.projectlist(keywords)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let list = res.data.Data
          list.forEach(item => {
            item.Ext = formatDate(new Date(item.Ext), 'yy/MM')
            item.Logo = webRoot + item.Logo
          })
          this.fetchedList = list
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    goMonthlyList (e) {
      let id = e.currentTarget.dataset.id
      this.$router.push({
        name: 'monthlyprogress',
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
.project-progress{
  width:100vw;
  height: 100vh;
  .search-box{
    width:100%;
    height: p2r(240);
    background: url('../../static/images/ppbg.png') center/cover no-repeat;
    padding-top: p2r(75);
    .search{
      width: p2r(600);
      height: p2r(90);
      margin: 0 auto;
      position: relative;
      .search-input{
        background: #fff;
        width:100%;
        height: 100%;
        border:none;
        padding-right: p2r(90);
        & + .iconfont{
          position: absolute;
          width: p2r(90);
          height: p2r(90);
          line-height: p2r(90);
          text-align: center;
          display: block;
          right:0;
          top:0;
          color:$primary-color;
        }
      }
    }
  }
  .content{
    height: calc(100% - 5.12rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: p2r($base-padding);
    background: $background-color;
    .item{
      width: 100%;
      height: p2r(300);
      margin:p2r(20) 0;
      border-radius: 4px;
      background: #fff;
      position: relative;
      &:first-child{
        margin-top: 0;
      }
      .img{
        width:100%;
        height: 100%;
        .fit-img{
          width:100%;
          height: 100%;
          border-radius: 4px;
        }
      }
      .text{
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        background: rgba(0,0,0,.5);
        border-radius: 4px;
        text-align: center;
        padding-top: p2r(120);
        .name{
          font-size: p2r(30);
          color:#fff;
          display: flex;
          align-items: center;
          padding: 0 p2r(30);
          &:before,
          &:after{
            content: '';
            display: block;
            flex: 1;
            height: 1px;
            @include _1px(#fff);
          }
          .txt{
            display: block;
            margin: 0 p2r(20)
          }
        }
        .updatetime{
          position: absolute;
          top:0;
          right: p2r(30);
          width: p2r(140);
          font-size: p2r(20);
          color:$text-color;
          font-weight: 200;
          background: rgba(255,255,255, .8);
          padding-bottom: p2r(15);
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          padding-top: p2r(10);
          i{
            display: block;
            font-style: normal;
            font-size: p2r(32);
            color:$primary-color;
            margin-top: p2r(10);
            font-weight: 600;
          }
        }
        .address{
          color:#fff;
          margin-top: p2r(20);
        }
      }
    }
  }
}
</style>
