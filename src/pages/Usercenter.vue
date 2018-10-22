<template>
 <div class="user-center">
   <userinfo
    :tagText="identity === 0 ? '注册会员' : '绑定房源'"
    @tagClick="goBind"></userinfo>
   <div class="entry-list">
    <div class="entry-list-wrapper">
      <router-link
        tag="div"
        v-for="(item, index) in entries"
        :key="'entry--'+index"
        :to="item.link"
      >
        <flexbox
          class="list-item"
          align="center"
        >
          <flexbox-item class="start-icon">
            <Icon :name="item.icon"/>
          </flexbox-item>
          <flexbox-item class="item-body">
            <span class="name">{{item.name}}</span>
            <Icon class="end-icon" name="arrow-right"/>
          </flexbox-item>
        </flexbox>
      </router-link>
      <router-link v-if="isRepairEngineer" tag="div" to="/repairengineer/treating">
        <flexbox class="list-item" align="center">
          <flexbox-item class="start-icon">
            <Icon name="repair"/>
          </flexbox-item>
          <flexbox-item class="item-body">
            <span class="name">在线报修（维修工程师）</span>
            <Icon class="end-icon" name="arrow-right"/>
          </flexbox-item>
        </flexbox>
      </router-link>
      <router-link v-if="isRepairManager" tag="div" to="/repairmanager/untreated">
        <flexbox class="list-item" align="center">
          <flexbox-item class="start-icon">
            <Icon name="repair"/>
          </flexbox-item>
          <flexbox-item class="item-body">
            <span class="name">在线报修（物业工程师）</span>
            <Icon class="end-icon" name="arrow-right"/>
          </flexbox-item>
        </flexbox>
      </router-link>
      <router-link v-if="isRepairEngineerManager" tag="div" to="/repairengineermanager/untreated">
        <flexbox class="list-item" align="center">
          <flexbox-item class="start-icon">
            <Icon name="repair"/>
          </flexbox-item>
          <flexbox-item class="item-body">
            <span class="name">在线报修（地产客服）</span>
            <Icon class="end-icon" name="arrow-right"/>
          </flexbox-item>
        </flexbox>
      </router-link>
    </div>
   </div>
 </div>
</template>
<script>
import {
  Avatar,
  Flexbox,
  FlexboxItem,
  Icon,
  Userinfo
} from 'components'
import {
  entries
} from 'common/data'
export default {
  name: 'Usercenter',
  components: {
    Avatar,
    Flexbox,
    FlexboxItem,
    Icon,
    Userinfo
  },
  data () {
    return {
      entries: entries.filter(item => {
        return item.name !== '个人中心' &&
               item.name !== '我的活动' &&
               item.name !== '业主报修' &&
               item.name !== '社区活动' &&
               item.name !== '武汉地产家书' &&
               item.name !== '服务指南' &&
               item.name !== '新闻中心' &&
               item.name !== '预约保养' &&
               item.name !== '开放交付' &&
               item.name !== '合同查询' &&
               item.name !== '工程进度'
      })
    }
  },
  computed: {
    identity () {
      return this.$store.state.userInfo.state
    },
    isRepairEngineer () {
      return this.$store.state.userInfo.isRepairEngineer
    },
    isRepairEngineerManager () {
      return this.$store.state.userInfo.isRepairEngineerManager
    },
    isRepairManager () {
      return this.$store.state.userInfo.isRepairManager
    }
  },
  methods: {
    goBind () {
      this.$router.push({
        name: this.identity === 0 ? 'regist' : 'bind'
      })
    },
    goRegist () {
      this.$router.push({
        name: 'regist'
      })
    }
  },
  created () {}
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.user-center{
  width: 100vw;
  height: 100vh;
  position: relative;
  .entry-list{
    height:calc(100% - 4.69rem);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .entry-list-wrapper{
      width: 100%;
      min-height:100%;
      padding-bottom: p2r(100);
      .list-item{
        padding-right: p2r($base-padding);
        .start-icon{
          flex:0 0 p2r(102);
          .iconfont{
            margin:0 p2r($base-padding);
            color:$primary-color;
            vertical-align: middle;
            font-size: p2r(40);
          }
        }
        .item-body{
          position: relative;
          height: p2r(124);
          line-height: p2r(124);
          @include _1px();
          .end-icon{
            color:#ccc;
            font-size: p2r(24);
            position: absolute;
            right:0;
            top:0;
          }
        }
        .name{
          font-size: p2r(30);
          color:$text-color;
          font-weight: 200;
        }
      }
    }
  }
}
</style>
