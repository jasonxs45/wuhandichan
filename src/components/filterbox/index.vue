<template>
<div class="filterbox">
  <transition name="fade">
    <div v-if="showed" class="bg" @click="hide"></div>
  </transition>
  <transition name="slide-in-right">
    <div v-if="showed" class="filterbox-wrapper">
      <div class="container">
        <div v-if='projects && projects.length' class="filter-item">
          <p class="tit">项目</p>
          <label class='picker' @click='showPicker("project")'>
            <input v-model='project.Name' readonly class="input" placeholder="请选择项目" type="text">
          </label>
        </div>
        <div v-if='states && states.length' class="filter-item">
          <p class="tit">分期</p>
          <label class='picker'  @click='showPicker("state")'>
            <input v-if='state' v-model='state.Name' readonly class="input" placeholder="请选择分期" type="text">
            <input v-else readonly class="input" placeholder="请选择分期" type="text">
          </label>
        </div>
        <Loading :hidden='!loading' />
        <div class="filter-item">
          <p class="tit">楼栋</p>
          <input v-model="building" class="input" placeholder="请输入楼栋" type="text">
        </div>
        <div class="filter-item">
          <p class="tit">单元</p>
          <input v-model="unit" class="input" placeholder="请输入单元" type="text">
        </div>
        <div class="filter-item">
          <p class="tit">房号</p>
          <input v-model="houseno" class="input" placeholder="请输入房号" type="text">
        </div>
        <div class="filter-item">
          <p class="tit">姓名</p>
          <input v-model="name" class="input" placeholder="请输入姓名" type="text">
        </div>
        <div class="filter-item">
          <p class="tit">开始日期</p>
          <label class='picker' @click='showCalendar("start")'>
            <input v-model="start" readonly class="input" placeholder="请选择开始日期" type="text">
          </label>
        </div>
        <div class="filter-item">
          <p class="tit">结束日期</p>
          <label class='picker' @click='showCalendar("end")'>
            <input v-model="end" readonly class="input" placeholder="请选择结束日期" type="text">
          </label>
        </div>
      </div>
      <div class="bottom">
        <div class="btn cancel" @click="hide">关闭</div>
        <div class="btn reset" @click="reset">重置</div>
        <div class="btn confirm" @click="confirm">确定</div>
      </div>
    </div>
  </transition>
  <Popup v-model='projectShow' position='bottom'>
    <Picker
      show-toolbar
      title='选择项目'
      :default-index='projectIndex'
      :columns='projects'
      value-key='Name'
      @cancel='hidePicker("project")'
      @confirm='confirmPicker'
    />
  </Popup>
  <Popup v-model='stateShow' position='bottom'>
    <Picker
      show-toolbar
      title='选择分期'
      value-key='Name'
      :default-index='stateIndex'
      :columns='states'
      @cancel='hidePicker("state")'
      @confirm='confirmPicker'
    />
  </Popup>
  <Popup v-model='calendarShow' position='bottom'>
    <DatetimePicker
      type='date'
      :min-date='new Date(2017, 0, 1)'
      :max-date='today'
      @cancel='hideCalendar'
      @confirm='getDate'
    />
  </Popup>
</div>
</template>
<script>
import { DatetimePicker, Popup, Picker, Loading } from 'vant'
import { formatDate } from 'common/utils/date'
import api from 'common/api/index'
import 'vant/lib/datetime-picker/style'
import 'vant/lib/popup/style'
import 'vant/lib/picker/style'
import 'vant/lib/loading/style'
const today = new Date()
export default {
  name: 'FilterBox',
  props: {
    filterShow: {
      type: Boolean,
      default: true
    },
    initProject: [Object, String],
    initState: [Object, String],
    initBuilding: String,
    initUnit: String,
    initHouseno: String,
    initName: String,
    initStart: String,
    initEnd: String
  },
  components: {
    DatetimePicker,
    Popup,
    Picker,
    Loading
  },
  data () {
    return {
      loading: false,
      projects: [],
      states: [],
      building: '',
      projectShow: false,
      project: '',
      projectIndex: 0,
      stateShow: false,
      state: '',
      stateIndex: 0,
      start: '',
      end: '',
      unit: '',
      houseno: '',
      name: '',
      showed: this.filterShow,
      calendarShow: false,
      today,
      dateTarget:''
    }
  },
  watch: {
    filterShow (newVal, oldVal) {
      this.showed = newVal
    },
    'project.Name' (newVal, oldVal) {
      if (newVal) {
        const id = this.project.ID
        this.getStates(id)
      }
    }
  },
  methods: {
    showCalendar (val) {
      this.calendarShow = true
      this.dateTarget = val
    },
    hideCalendar () {
      this.calendarShow = false
      this.dateTarget = ''
    },
    showPicker (target) {
      this[`${target}Show`] = true
      this.dateTarget = target
    },
    hidePicker (target) {
      this[`${target}Show`] = false
      this.dateTarget = ''
    },
    getDate (val) {
      const { dateTarget } = this
      if (!dateTarget) {
        return
      }
      this[dateTarget] = formatDate(val, 'yyyy/MM/dd')
      this.hideCalendar()
    },
    getProjects () {
      this.loading = true
      api.fetch({
        Act: 'ProjectGetList'
      })
        .then(res => {
          this.loading = false
          const { IsSuccess, Message, Data } = res.data
          if (IsSuccess) {
            this.projects = Data
            this.projectIndex = this.projects.findIndex(item => item.ID === this.project.ID)
            this.projectIndex = this.projectIndex === -1 ? 0 : this.projectIndex
          } else {
            console.log(Message)
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    getStates (ID) {
      this.loading = true
      api.fetch({
        Act: 'StageGetList',
        Data: JSON.stringify({
          S_ProjectID: ID
        })
      })
        .then(res => {
          this.loading = false
          const { IsSuccess, Message, Data } = res.data
          if (IsSuccess) {
            this.states = Data
            this.stateIndex = this.states.findIndex(item => item.ID === this.state.ID)
            this.stateIndex = this.stateIndex === -1 ? 0 : this.stateIndex
          } else {
            console.log(Message)
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    confirmPicker (val) {
      const { dateTarget } = this
      if (!dateTarget) {
        return
      }
      if (dateTarget === 'project') {
        if (this[dateTarget].ID !== val.ID) {
          this.state = ''
        }
      }
      this[dateTarget] = val
      this.hidePicker(dateTarget)
    },
    show () {
      this.showed = true
    },
    hide () {
      this.showed = false
      this.$emit('hide', this.showed)
    },
    confirm () {
      this.hide()
      this.$emit('confirm', {
        building: this.building,
        unit: this.unit,
        houseno: this.houseno,
        name: this.name,
        project: this.project,
        state: this.state,
        start: this.start,
        end: this.end
      })
    },
    reset () {
      this.building = ''
      this.unit = ''
      this.houseno = ''
      this.name = ''
      this.project = ''
      this.state = ''
      this.start = ''
      this.end = ''
      this.hide()
      this.$emit('confirm', {
        building: this.building,
        unit: this.unit,
        houseno: this.houseno,
        name: this.name,
        project: this.project,
        state: this.state,
        start: this.start,
        end: this.end
      })
    }
  },
  created () {
    this.building = this.initBuilding
    this.unit = this.initUnit
    this.houseno = this.initHouseno
    this.name = this.initName
    this.projects = this.initProjects
    this.project = this.initProject
    this.states = this.initStates
    this.state = this.initState
    this.start = this.initStart === undefined ? '' : this.initStart
    this.end = this.initEnd === undefined ? '' : this.initEnd
  },
  mounted () {
    this.getProjects()
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.filterbox{
  .bg{
    position: fixed;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    z-index: 99;
    background: rgba(0,0,0,.8);
  }
  .filterbox-wrapper{
    position: fixed;
    width: 90%;
    height: 100%;
    background: #fff;
    z-index: 100;
    top:0;
    right: 0;
    .container{
      padding: p2r(30);
      height: 100%;
      padding-bottom: p2r(100);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .filter-item{
      &:first-child{
        .tit{
          margin-top: 0;
        }
      }
        .tit{
          font-size: p2r(28);
          margin-top: p2r(30);
          color:$primary-color;
        }
        .input{
          display: block;
          width: 100%;
          height: p2r(70);
          line-height: p2r(70);
          padding: 0 p2r(15);
          margin: p2r(20) 0;
          border-radius: 4px;
          border:1px solid #ddd;
          outline: none;
        }
        .picker{
          display: block;
        }
      }
    }
    .bottom{
      width: 100%;
      box-shadow: 0 0 2px 0 rgba(0,0,0,.2);
      height: p2r(100);
      position: absolute;
      bottom: 0;
      font-size: 0;
      .btn{
        display: inline-block;
        width: 33.33%;
        font-size: p2r(28);
        line-height: p2r(100);
        text-align: center;
        &.cancel{
          background: #ccc !important;
        }
        &.confirm{
          background: $primary-color;
          color: #fff;
        }
      }
    }
  }
}
</style>
