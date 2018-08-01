<template>
<div class="advise-user">
  <userinfo
    type-class="rectangle"
    tagText="新建留言"
    @tagClick="tagClick"
  ></userinfo>
  <flexbox class="links">
    <flexbox-item
      v-for="(item, index) in navs"
      :key="item.path+index"
    >
      <router-link
        :to="item.path"
        tag="div"
        class="link"
      >
        <p class="text">{{item.text}}</p>
      </router-link>
    </flexbox-item>
  </flexbox>
  <div class="content">
    <div v-if="(user[stateType].orders && user[stateType].orders.length < 1)|| !user[stateType].orders" class="no-data">
      <img src="static/images/advisenodata.png" alt="" />
    </div>
    <div
      v-for="(item, index) in user[stateType].orders"
      :key="'untreatedorder-'+index"
      class="advise-card"
      :class="item.Type === '表扬' ? 'praise' : item.Type === '投诉' ? 'complain' : 'suggest'"
      @click="goDetail(item.ID)"
    >
      <div class="title">
        {{item.AddTime}}
        <div class="tag">
          {{item.Type}}
        </div>
      </div>
      <div class="desc">
        {{item.Content}}
      </div>
    </div>
    <Getmore
      v-if="user[stateType].orders && user[stateType].orders.length > 0"
      :canClick="!user[stateType].lastPage"
      @click="list"
    />
  </div>
</div>
</template>
<script>
import {
  Userinfo,
  Flexbox,
  FlexboxItem,
  Getmore
} from 'components'
const navs = [
  {
    path: 'untreated',
    text: '待受理'
  },
  {
    path: 'treated',
    text: '已受理'
  },
  {
    path: 'finished',
    text: '已完成'
  }
]
export default {
  name: 'AdviseUser',
  components: {
    Userinfo,
    Flexbox,
    FlexboxItem,
    Getmore
  },
  data () {
    return {
      navs,
      stateType: '',
      role: 'user'
    }
  },
  computed: {
    user () {
      return this.$store.getters['advise/user']
    },
    state () {
      return this.stateType === 'untreated' ? 0 : this.stateType === 'treated' ? 1 : 2
    }
  },
  watch: {
    '$route' (to, from) {
      this.stateType = to.params.state
      this.stateChangeHandler()
    }
  },
  created () {
    this.stateType = this.$route.params.state
    this.stateChangeHandler()
  },
  destroyed () {
    this.reset()
  },
  methods: {
    reset () {
      this.$store.dispatch('advise/destroyed', this.role)
    },
    list () {
      this.$store.dispatch('advise/list', {
        role: this.role,
        stateType: this.stateType
      })
    },
    stateChangeHandler () {
      if (this.navs.every(item => item.path !== this.stateType)) {
        this.$router.push({
          name: 'pagenotfound'
        })
        return
      }
      // this.list(this.stateType)
      if (this.user[this.stateType].page < 1) {
        this.list(this.stateType)
      }
    },
    tagClick () {
      this.$router.push({
        name: 'advisesubmit'
      })
    },
    getMoreHandler () {
      this.show = !this.show
    },
    goDetail (id) {
      this.$router.push({
        name: 'advisedetail',
        params: {
          role: 'user',
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
.advise-user{
  width: 100vw;
  height: 100vh;
  .links{
    height:p2r(80);
    box-shadow: $box-shadow;
    position: relative;
    z-index: 1;
    .link{
      width:100%;
      height: 100%;
      display: table;
      position: relative;
      &:after{
        content: '';
        display: block;
        position: absolute;
        bottom: -1px;
        left:20%;
        width:60%;
        height:1px;
      }
      .text{
        font-size: p2r(26);
        white-space: nowrap;
        display: table-cell;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: clip;
        text-align: center;
        color:$text-color;
        font-weight: 200;
      }
      &.router-link-active{
        &:after{
        background: $primary-color;
        }
        .text{
          color:$primary-color;
          font-weight: normal;
        }
      }
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 6.8266666rem);
    padding: p2r($base-padding);
    background: $background-color;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .advise-card{
      background: #fff;
      border-radius: 4px;
      margin: p2r(30) 0;
      overflow: hidden;
      &:first-child{
        margin-top: 0;
      }
      &.praise{
        .title{
          background: $success-color;
        }
      }
      &.complain{
        .title{
          background: $error-color;
        }
      }
      &.suggest{
        .title{
          background: $link-color;
        }
      }
      .title{
        padding: p2r(20) p2r(30);
        color:#fff;
        font-weight: 200;
        .tag{
          float: right;
        }
      }
      .desc{
        min-height: p2r(100);
        padding: p2r(20) p2r(30);
        line-height: 1.5;
        font-size: p2r(24);
        color: $text-sub-color;
      }
    }
    .no-data{
      width: p2r(300);
      margin: p2r(50) auto 0;
    }
    .getmore{
      font-size: p2r(24);
      color: $thr-color;
      .iconfont{
        font-size: p2r(24);
      }
    }
  }
}
</style>
