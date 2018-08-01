<template>
  <div class="repair-user repair-engineer">
    <!-- <userinfo type-class="rectangle"></userinfo> -->
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
      <div v-if="(engineer[stateType].orders && engineer[stateType].orders.length < 1)|| !engineer[stateType].orders" class="no-data">
        <img src="static/images/repairnodata.png" alt="" />
        <p class="text">暂无数据</p>
      </div>
      <div
        v-for="(item, index) in engineer[stateType].orders"
        :key="'untreatedorder-'+index"
        class="repair-card"
        @click="toDetail(item.ID)"
      >
        <flexbox>
          <flexbox-item class="title">
            {{item.ProjectName+item.StageName}} {{item.Building}} - {{item.Unit}}-{{item.HouseNo}}
          </flexbox-item>
          <flexbox-item class="date">
            {{item.AddTime|formatdate}}
          </flexbox-item>
        </flexbox>
        <div class="info">
          {{item.Part}}
        </div>
        <div class="desc">
          {{item.Content}}
        </div>
        <template v-if="item.State > 0">
          <Split type="line"/>
          <flexbox class="engineer">
            <flexbox-item class="name">
              联系人：{{item.Name}}
            </flexbox-item>
            <flexbox-item class="tel">
              <a @click.stop :href="`tel:${item.Tel}`">{{item.Tel}}</a>
            </flexbox-item>
          </flexbox>
        </template>
        <template v-if="item.State === 4">
          <flexbox class="score">
            <flexbox-item class="text">
              维修评分
            </flexbox-item>
            <flexbox-item class="star">
              <Star :score="3.5" :size="24" readOnly/>
            </flexbox-item>
          </flexbox>
        </template>
      </div>
      <Getmore
        v-if="engineer[stateType].orders && engineer[stateType].orders.length > 0"
        :canClick="!engineer[stateType].lastPage"
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
  Split,
  Star,
  Getmore
} from 'components'
import {
  formatDate
} from 'common/utils/date'
let navs = [
  {
    path: 'untreated',
    text: '未处理'
  },
  {
    path: 'treated',
    text: '已接单'
  },
  {
    path: 'finished',
    text: '已完成'
  },
  {
    path: 'canceled',
    text: '已取消'
  }
]
export default {
  name: 'RepairEngineer',
  components: {
    Userinfo,
    Flexbox,
    FlexboxItem,
    Split,
    Star,
    Getmore
  },
  data () {
    return {
      navs,
      stateType: '',
      role: 'engineer'
    }
  },
  computed: {
    engineer () {
      return this.$store.getters[`repair/${this.role}`]
    }
  },
  watch: {
    '$route' (to, from) {
      this.stateType = to.params.state
      this.stateChangeHandler()
    }
  },
  filters: {
    formatdate (val) {
      return formatDate(new Date(val), 'yyyy/MM/dd hh:mm')
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
      this.$store.dispatch('repair/destroyed', this.role)
    },
    list () {
      this.$store.dispatch('repair/list', {
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
      if (this.engineer[this.stateType].page < 1) {
        this.list(this.stateType)
      }
    },
    toDetail (id) {
      this.$router.push({
        name: 'repairengineerdetail',
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
 .repair-engineer{
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
        left:0;
        width:70%;
        left:15%;
        height:3px;
        border-radius: 25px;
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
   .content{
     width: 100%;
     height: calc(100% - 1.7rem);
     background: $background-color;
     overflow-y: auto;
     padding: p2r($base-padding);
     -webkit-overflow-scrolling: touch;
     .no-data{
       width: p2r(312);
       margin: p2r(200) auto 0;
       .text{
         color: $thr-color;
         font-size: p2r(28);
         text-align: center;
         font-weight: 600;
       }
     }
     .repair-card{
      background: #fff;
      border-radius: 4px;
      padding:p2r($base-padding);
      margin: p2r(30) 0;
      &:first-child {
        margin-top: 0;
      }
      .title{
        color:$primary-color;
        font-size: p2r(24);
        line-height: 1.5;
      }
      .date{
        font-size: p2r(24);
        color:$thr-color;
        flex: 0 0 p2r(210);
        width:p2r(210);
        text-align: right;
        line-height: 1.5;
      }
      .info{
        background: $primary-color;
        color: #fff;
        border-radius: 4px;
        padding: 5px p2r($base-padding);
        line-height: 1.5;
        margin-top: p2r(20);
      }
      .desc{
        margin-top: p2r(20);
        font-size: p2r(24);
        color: $text-color;
        line-height: 1.5;
      }
      .line{
        margin-top: p2r(40);
      }
      .engineer{
        margin-top: p2r(20);
        color: $text-sub-color;
        font-size: p2r(26);
        .tel{
          text-align: right;
          flex: 0 0 p2r(200);
          width: p2r(200);
        }
      }
      .score{
        margin-top: p2r(30);
        .text{
          font-size: 12px;
          color: $thr-color;
        }
        .star{
          text-align: right;
        }
      }
     }
   }
 }
</style>
