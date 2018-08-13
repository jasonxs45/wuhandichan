<template>
<div class="advise-manager">
  <flexbox class="links">
    <flexbox-item
      v-for="(item, index) in usedNavs"
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
    <div v-if="(manager[stateType].orders && manager[stateType].orders.length < 1)|| !manager[stateType].orders" class="no-data">
      <img src="static/images/advisenodata.png" alt="" />
    </div>
    <div
      v-for="(item, index) in manager[stateType].orders"
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
      v-if="manager[stateType].orders && manager[stateType].orders.length > 0"
      :canClick="!manager[stateType].lastPage"
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
// 物业
const navs = [
  {
    path: 'untreated',
    text: '待受理'
  },
  {
    path: 'treated',
    text: '待处理'
  },
  {
    path: 'finished',
    text: '已处理'
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
      role: 'manager'
    }
  },
  computed: {
    type () {
      return this.$store.state.userInfo.managerType
    },
    manager () {
      return this.$store.getters['advise/manager']
    },
    state () {
      return this.stateType === 'untreated' ? 0 : this.stateType === 'treated' ? 1 : 2
    },
    usedNavs () {
      return this.type === '物业客服' ? navs : navs.filter(item => item.path !== 'untreated')
    }
  },
  watch: {
    '$route' (to, from) {
      this.stateType = to.params.state
      this.stateChangeHandler()
    },
    manager (val) {
      if (val === null) {
        alert(1)
      }
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
      if (this.manager[this.stateType].page < 1) {
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
        name: 'advisemanagerdetail',
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
.advise-manager{
  width: 100vw;
  height: 100vh;
  background: $background-color;
  .links{
    position: fixed;
    width:100%;
    height:p2r(80);
    box-shadow: $box-shadow;
    background: #fff;
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
    padding:p2r(120) p2r($base-padding) p2r($base-padding);
    background: $background-color;
    overflow: auto;
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
