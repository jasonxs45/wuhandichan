<template>
  <div class="menu">
    <flexbox>
      <flexbox-item
        v-for="(item, index) in menu"
        :key="'menu-t'+index"
        class="item"
      >
        <!-- <h3 class="title">{{item.label}}</h3> -->
        <ul>
          <router-link
            tag="li"
            v-for="(value, key, index) in item.children"
            :key="'menu-l-'+key+index"
            :to="value"
            class="link"
          >{{key}}</router-link>
        </ul>
      </flexbox-item>
    </flexbox>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem
} from 'components'
export default {
  name: 'Menu',
  components: {
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      menu: [
        {
          // label: '我要查询',
          children: {
            // '验房查询': 'thirdserviceprogress/open',
            // '工程进度': 'projectprogress',
            '个人中心':'usercenter'
            // '合同/产证': 'tradeprogress',
            // '服务指南': 'guide',
            // '在售项目': 'projectmap'
          }
        },
        {
          // label: '服务在线',
          children: {
            '投诉建议': 'advisesubmit',
            '业主报修':'repairsubmit'
            // '预约保养':'activitylist/signup',
            // '开放/交付':'activitylist/accept'
          }
        },
        {
          // label: '美好生活',
          children: {
            '会员活动': 'activitylist/activity',
            // '关于我们': 'wait',
            '新闻资讯': 'newscenter'
            // '武汉地产家书': 'magazine',

          }
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.menu{
  .item{
    border-left:1px solid #ddd;
    background: $background-color;
    &:first-child{
      border-left: 0;
    }
  }
  .title{
    font-size:p2r(32);
    padding: p2r($base-padding);
    background-color:#fff;
    font-weight: 200;
    @include _1px();
    text-align: center;
  }
  .link{
    font-size: p2r(24);
    padding: p2r($base-padding);
    @include _1px();
    text-align: center;
    &:first-child{
      margin-top: 0;
    }
  }
}
</style>
