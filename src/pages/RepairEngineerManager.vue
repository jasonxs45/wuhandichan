<template>
  <div class="repair-user repair-engineer-manager">
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
          <p class="text">{{item.text}}<span class='badge'>{{counts[index]}}</span></p>
        </router-link>
      </flexbox-item>
      <div :hidden='!showFilt' class='filters'>
        <span v-if='project && project.Name !== "全部"'>{{project.Name}};</span>
        <span v-if='state && state.Name !== "全部"'>{{state.Name}};</span>
        <span v-if='building'>楼栋:{{building}};</span>
        <span v-if='building'>楼栋:{{building}};</span>
        <span v-if='unit'>单元:{{unit}};</span>
        <span v-if='houseno'>房号:{{houseno}};</span>
        <span v-if='name'>姓名:{{name}};</span>
        <span v-if='start'>开始:{{start}};</span>
        <span v-if='end'>结束:{{end}};</span>
      </div>
    </flexbox>
    <div class="content">
      <div v-if="!lists[currentIndex].length" class="no-data">
        <img src="static/images/repairnodata.png" alt="" />
        <p class="text">暂无数据</p>
      </div>
      <div
        v-for="(item, index) in lists[currentIndex]"
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
              施工单位：{{item.CompanyName}}{{item.BuilderName}}
            </flexbox-item>
            <flexbox-item v-if='item.Tel' class="tel">
              <a :href="`tel:${item.Tel}`" @click.stop>{{item.Tel}}</a>
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
        v-if="lists[currentIndex].length"
        :canClick="!finishes[currentIndex]"
        @click="more"
      />
    </div>
    <button :hidden='showFilter' class='filter-btn' @click="openFilter">打开<br />筛选</button>
    <filter-box
      :filterShow="showFilter"
      :initProject='project'
      :initState='state'
      :initBuilding='building'
      :initUnit='unit'
      :initHouseno='houseno'
      :initName='name'
      :initStart='start'
      :initEnd='end'
      @hide="hideFilter"
      @confirm="confirm"
    >
    </filter-box>
  </div>
</template>
<script>
import {
  Userinfo,
  Flexbox,
  FlexboxItem,
  Split,
  Star,
  Getmore,
  FilterBox
} from 'components'
import {
  formatDate
} from 'common/utils/date'
import api from 'common/api'
let navs = [
  {
    path: 'untreated',
    text: '待审核'
  }
]
export default {
  name: 'RepairEngineerManager',
  components: {
    Userinfo,
    Flexbox,
    FlexboxItem,
    Split,
    Star,
    Getmore,
    FilterBox
  },
  data () {
    return {
      navs,
      stateType: '',
      role: 'engineermanager',
      myrole: '地产客服',
      showFilter: false,
      currentIndex: 0,
      lists: [],
      pageIndexes: [],
      finishes: [],
      counts: [],
      searchkey: '',
      building: '',
      unit: '',
      houseno: '',
      name: '',
      project: '',
      state: '',
      start: '',
      end: ''
    }
  },
  computed: {
    showFilt () {
      return this.building ||
             this.unit ||
             this.houseno ||
             this.name ||
             this.start ||
             this.end ||
             (this.project && this.project.Name !== '全部') ||
             (this.state && this.state.Name !== '全部')
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
    if (sessionStorage.building) {
      this.building = sessionStorage.building
    }
    if (sessionStorage.unit) {
      this.unit = sessionStorage.unit
    }
    if (sessionStorage.houseno) {
      this.houseno = sessionStorage.houseno
    }
    if (sessionStorage.name) {
      this.name = sessionStorage.name
    }
    if (sessionStorage.project) {
      this.project = JSON.parse(sessionStorage.project)
    }
    if (sessionStorage.state) {
      this.state = JSON.parse(sessionStorage.state)
    }
    if (sessionStorage.start) {
      this.start = sessionStorage.start
    }
    if (sessionStorage.end) {
      this.end = sessionStorage.end
    }
    this.stateType = this.$route.params.state
    this.stateChangeHandler()
    this.totalQuery()
  },
  methods: {
    openFilter () {
      this.showFilter = true
    },
    hideFilter (val) {
      this.showFilter = val
    },
    confirm (val) {
      const { building, unit, houseno, name, project, state, start, end } = val
      this.building = building
      this.unit = unit
      this.houseno = houseno
      this.name = name
      this.project = project
      this.state = state
      this.start = start
      this.end = end
      this.totalQuery()
      sessionStorage.building = this.building
      sessionStorage.unit = this.unit
      sessionStorage.houseno = this.houseno
      sessionStorage.name = this.name
      sessionStorage.start = this.start
      sessionStorage.end = this.end
      sessionStorage.project = JSON.stringify(this.project)
      sessionStorage.state = JSON.stringify(this.state)
    },
    totalQuery () {
      const {
        myrole: role,
        searchkey,
        building,
        unit,
        houseno,
        name,
        project,
        state,
        start: startdate,
        end: enddate
      } = this
      let stack = []
      this.lists = []
      this.finishes = []
      this.pageIndexes = []
      const projectid = project ? project.ID : ''
      const stageid = state ? state.ID : ''
      for (let i = 0, len = navs.length; i < len; i++) {
        this.lists.push([])
        this.finishes.push(true)
        this.pageIndexes.push(1)
        stack.push(Promise.resolve(api.repair.list1({
          role,
          state: navs[i].value,
          searchkey,
          pageindex: 1,
          building,
          unit,
          houseno,
          name,
          projectid,
          stageid,
          startdate,
          enddate
        })))
      }
      const index = window.$loading('加载中')
      Promise.all(stack)
        .then(res => {
          window.$close(index)
          res = res.map(item => item.data)
          this.lists = res.map(item => {
            let arr
            if (item.IsSuccess) {
              arr = item.Data.repairList
            } else {
              arr = []
            }
            return arr
          })
          this.finishes = res.map(item => {
            let res
            if (item.IsSuccess) {
              res = item.Data.lastpage
            } else {
              res = true
            }
            return res
          })
          this.counts = res.map(item => {
            let res
            if (item.IsSuccess) {
              res = item.Data.count
            } else {
              res = 0
            }
            return res
          })
        })
        .catch(err => {
          window.$close(index)
          console.log(err)
        })
    },
    more () {
      const {
        searchkey,
        myrole: role,
        currentIndex,
        pageIndexes,
        finishes,
        building,
        unit,
        houseno,
        name,
        project,
        state: stage,
        start: startdate,
        end: enddate
      } = this
      const state = navs[currentIndex].value
      const pageindex = pageIndexes[currentIndex] + 1
      const finished = finishes[currentIndex]
      const projectid = project ? project.ID : ''
      const stageid = stage ? stage.ID : ''
      console.log(currentIndex)
      if (!finished) {
        const index = window.$loading('加载中')
        api.repair.list1({
            role,
            state,
            searchkey,
            pageindex,
            building,
            unit,
            houseno,
            name,
            projectid,
            stageid,
            startdate,
            enddate
          })
          .then(res => {
            window.$close(index)
            if (res.data.IsSuccess) {
              this.lists[currentIndex] = this.lists[currentIndex].concat(res.data.Data.repairList)
              this.finishes[currentIndex] = res.data.Data.lastpage
              this.pageIndexes[currentIndex] = pageindex
              this.lists = this.lists.slice()
              this.finishes = this.finishes.slice()
              this.pageIndexes = this.pageIndexes.slice()
            } else {
              window.$alert(res.data.Message)
            }
          })
          .catch(err => {
            window.$close(index)
            console.log(err)
          })
      }
    },
    stateChangeHandler () {
      if (this.navs.every(item => item.path !== this.stateType)) {
        this.$router.push({
          name: 'pagenotfound'
        })
        return
      }
      this.currentIndex = navs.findIndex(item => item.path === this.stateType) === -1 ? 0 : navs.findIndex(item => item.path === this.stateType)
    },
    toDetail (id) {
      this.$router.push({
        name: 'repairengineermanagerdetail',
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
 .repair-engineer-manager{
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
       .badge{
         position: absolute;
         display: inline-block;
         font-size: p2r(18);
         background: $error-color;
         color: #fff;
         padding:2px 5px;
         border-radius: 8px;
         right: 0;
         top: p2r(10);
         opacity: .9;
       }
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
    .filters{
       position: absolute;
       width: 100%;
       top:100%;
       background: rgba(255,255,255,.8);
       padding: 5px p2r(30);
       color: $primary-color;
       white-space: nowrap;
       text-overflow: ellipsis;
       overflow: hidden;
     }
     & + .content{
       height: calc(100% - 1.7rem);
     }
   }
   .content{
     width: 100%;
     height: 100%;
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
        margin-top: p2r(20);
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
   .filter-btn{
      width: p2r(90);
      height: p2r(90);
      position: fixed;
      right: 10px;
      bottom: p2r(100);
      z-index: 99;
      background: $primary-color;
      border:none;
      outline:none;
      color: #fff;
      border-radius: 50%;
      line-height: 1.1;
      box-shadow: 0 0 20px 0 rgba(0,0,0,.3);
      font-size: 12px;
      font-weight: 500;
    }
 }
</style>
