<template>
  <div class="repair-detail">
    <p class="tag">{{repair.State|formatStatus}}</p>
    <div class="repair-detail-wrapper" :class="single ? 'single' : ''">
      <div class="detail">
        <flexbox>
          <flexbox-item class="house-name">
            {{repair.ProjectName+repair.StageName}} {{repair.Building}} - {{repair.Unit}}-{{repair.HouseNo}}
          </flexbox-item>
          <flexbox-item class="date">
            {{repair.AddTime|formatdate}}
          </flexbox-item>
        </flexbox>
        <div class="info">{{repair.Part}}</div>
        <div class="desc">{{repair.Content}}</div>
        <img-row
          v-if="imgs.length > 0"
          :group="imgs"
          :canUpload="false"
          class="imgs"
        >
          <img-cell
            v-for="(item, index) in imgs"
            :index="index"
            :canUpload="false"
            :group="imgs"
            :key="'upimg-'+index"
          >
            <Fitimg :src="item" @on-click="previewImg(item, imgs)"/>
          </img-cell>
        </img-row>
        <flexbox class="engineer">
          <flexbox-item class="name">
            联系人：{{repair.Name}}
          </flexbox-item>
          <flexbox-item class="tel">
            <a :href="`tel:${repair.Tel}`" @click.stop>{{repair.Tel}}</a>
          </flexbox-item>
        </flexbox>
        <!-- 工程师管理详细记录 -->
        <template v-if="repair.State > 0 && detailList.length > 0">
          <Split type="line"/>
          <div class="sub-order-list">
            <div v-for="(item, index) in detailList" :key="'detailitem-' + index" class="sub-order">
              <img-row
                v-if="item.Images.length > 0"
                :group="item.Images"
                :canUpload="false"
                class="imgs"
              >
                <img-cell
                  v-for="(img, index1) in item.Images"
                  :index="index"
                  :canUpload="false"
                  :group="imgs"
                  :key="'img-'+ index + index1"
                >
                  <Fitimg :src="img" @on-click="previewImg(img, item.Images)"/>
                </img-cell>
              </img-row>
              <p class="desc">{{item.Desc}}</p>
              <flexbox v-if="repair.State > 1">
                <flexbox-item class="builder-name">
                  处理时间：
                </flexbox-item>
                <flexbox-item class="tel">
                  {{item.AddTime|formatdate}}
                </flexbox-item>
              </flexbox>
              <flexbox v-if="repair.State > 1">
                <flexbox-item class="builder-name">
                  预计完成时间：
                </flexbox-item>
                <flexbox-item class="tel">
                  {{item.ExpectTime|formatdate}}
                </flexbox-item>
              </flexbox>
              <flexbox v-if="item.FinishTime">
                <flexbox-item class="builder-name">
                  完成时间：
                </flexbox-item>
                <flexbox-item class="tel">
                  {{item.FinishTime|formatdate}}
                </flexbox-item>
              </flexbox>
              <flexbox>
                <flexbox-item class="builder-name">
                  处理人：{{item.BuilderName}}
                </flexbox-item>
                <flexbox-item class="tel">
                  <a :href="`tel:${item.BuilderTel}`">{{item.BuilderTel}}</a>
                </flexbox-item>
              </flexbox>
            </div>
          </div>
        </template>
      </div>
      <div v-if="currentProgress && currentProgress.length > 0" class="progress-wrapper">
        <div class="progress">
          <flexbox
            v-for="(item, index) in currentProgress"
            :key="'item-'+index"
            class="progress-item"
          >
            <flexbox-item class="icon">
              <Icon :name="index===0?'radio-check':'radio'"/>
            </flexbox-item>
            <flexbox-item class="item-body">
              <div class="item-body-wrapper">
                <p class="time">{{item.AddTime}}</p>
                <h3 class="status">{{item.Title}}</h3>
                <p class="info" :class="item.Remark? '': 'opa'">{{item.Remark}}</p>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
    </div>
    <div class="btns" :class="single ? 'single' : ''">
      <!-- 待分配 -->
      <flexbox v-if="repair.State === 0" justify="justify" class="three-btn">
        <Btn type="primary" size="mini" text="分配" @click="toggleDispatch"/>
        <Btn type="primary" size="mini" text="编辑" @click="toggleReWrite"/>
        <Btn type="primary" size="mini" text="取消" @click="toggleRefuse"/>
      </flexbox>
      <!-- 已处理 -->
      <flexbox v-if="repair.State === 2" class="two-btn">
        <flexbox-item>
          <Btn type="primary" size="mini" text="通过" @click="passTreated"/>
        </flexbox-item>
        <flexbox-item style="text-align:right">
          <Btn type="base" size="mini" text="驳回" @click="toggleTreatedRefuse"/>
        </flexbox-item>
      </flexbox>
      <Btn type="default" size="lar" text="返回" @click="back" />
    </div>
    <div class="refuse">
      <transition name="fade">
        <div v-show="showRefuse" class="bg" @click="toggleRefuse"></div>
      </transition>
      <transition name="slide-up">
        <div v-show="showRefuse" class="refuse-wrapper">
          <x-textarea v-model="refuseReason" placeholder="请填写取消的理由"></x-textarea>
          <Btn type="primary" text="提交" size="lar" @click="submitRefuse"/>
          <Btn type="default" text="取消" size="lar" @click="toggleRefuse"/>
        </div>
      </transition>
    </div>
    <div class="refuse">
      <transition name="fade">
        <div v-show="showTreatedRefuse" class="bg" @click="toggleTreatedRefuse"></div>
      </transition>
      <transition name="slide-up">
        <div v-show="showTreatedRefuse" class="refuse-wrapper">
          <x-textarea v-model="refuseTreatedReason" placeholder="请填写驳回的理由"></x-textarea>
          <Btn type="primary" text="提交" size="lar" @click="refuseTreated"/>
          <Btn type="default" text="取消" size="lar" @click="toggleTreatedRefuse"/>
        </div>
      </transition>
    </div>
    <transition name="slide-in-right">
      <div v-show="showDispatch" class="dispatch">
        <div class="dispatch-wrapper">
          <x-select v-model="selectedEngineer" placeholder="选择重新分配的工程师">
            <x-option
              v-for="(engineer, index) in engineers"
              :key="'engineer-' + index"
              :label="engineer.CompanyName"
              :value="engineer.ID"
            >
              <flexbox>
                <flexbox-item class="left">{{engineer.CompanyName}}</flexbox-item>
                <flexbox-item class="right"></flexbox-item>
              </flexbox>
            </x-option>
          </x-select>
          <x-textarea v-model="allotReason" placeholder="请填写分配原因"></x-textarea>
        </div>
        <div class="btns">
          <Btn type="primary" text="确定" size="lar" @click="allotEngineer"/>
          <Btn type="default" text="取消" size="lar" @click="toggleDispatch"/>
        </div>
      </div>
    </transition>
    <transition name="slide-in-right">
      <div v-show="showReWrite" class="dispatch">
        <div class="dispatch-wrapper">
          <div v-if="selectedPartName" class="selected-info">
            <flexbox align="center" justify="justify">
              <h3 class="head">选择问题：</h3>
              <div class="body">
                <div class="selected-tag">
                  <span class="text">{{selectedPartName}}</span>
                  <span v-if="selectedPartResName" class="text">-{{selectedPartResName}}</span>
                  <span v-if="selectedTroubleName" class="text">-{{selectedTroubleName}}</span>
                </div>
              </div>
            </flexbox>
            <Split type="line"/>
          </div>
          <div class="tags">
            <flexbox justify="justify">
              <h3 class="title">选择部位</h3>
              <div class="selected-span" @click="toggleTags('partAll')">
                <span :class="selectedPart ? 'color' : ''" class="text">{{selectedPartName || '全部'}}</span>
                <Icon :class="partAll?'show':'hide'" class="arrow-right" name="arrow-right1"/>
              </div>
            </flexbox>
            <flexbox wrap="wrap" class="tags-row" :class="partAll ? 'show': 'hide'">
              <label v-for="(item, index) in parts" :key="'part-'+index+item.ID" class="radio-tag">
                <input v-model="selectedPart" class="radio" type="radio" name="part" :value="item.ID">
                <span class="text">{{item.Name}}</span>
              </label>
            </flexbox>
          </div>
          <div v-if="selectedPart" class="tags">
            <flexbox justify="justify">
              <h3 class="title">选择部品</h3>
              <div class="selected-span" @click="toggleTags('partresAll')">
                <span :class="selectedPartRes ? 'color' : ''" class="text">{{selectedPartResName || '全部'}}</span>
                <Icon :class="partresAll?'show':'hide'" class="arrow-right" name="arrow-right1"/>
              </div>
            </flexbox>
            <flexbox wrap="wrap" class="tags-row" :class="partresAll ? 'show': 'hide'">
              <label v-for="(item, index) in partres" :key="'partres-'+index+item.ID" class="radio-tag">
                <input v-model="selectedPartRes" class="radio" type="radio" name="partres" :value="item.ID">
                <span class="text">{{item.Name}}</span>
              </label>
            </flexbox>
          </div>
          <div v-if="selectedPartRes" class="tags">
            <flexbox justify="justify">
              <h3 class="title">选择问题</h3>
              <div class="selected-span" @click="toggleTags('troubleAll')">
                <span :class="selectedTrouble ? 'color' : ''" class="text">{{selectedTroubleName || '全部'}}</span>
                <Icon :class="troubleAll?'show':'hide'" class="arrow-right" name="arrow-right1"/>
              </div>
            </flexbox>
            <flexbox wrap="wrap" class="tags-row" :class="troubleAll ? 'show': 'hide'">
              <label v-for="(item, index) in trouble" :key="'trouble-'+index+item.ID" class="radio-tag">
                <input v-model="selectedTrouble" class="radio" type="radio" name="trouble" :value="item.ID">
                <span class="text">{{item.Name}}</span>
              </label>
            </flexbox>
          </div>
        </div>
        <div class="btns">
          <Btn type="primary" text="确定" size="lar" @click="updateTrouble"/>
          <Btn type="default" text="取消" size="lar" @click="toggleReWrite"/>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  ImgRow,
  ImgCell,
  Fitimg,
  Split,
  Btn,
  Icon,
  XSelect,
  XOption,
  XTextarea
} from 'components'
import {
  formatDate
} from 'common/utils/date'
import {
  webRoot
} from 'common/data'
import api from 'common/api'
import wxConf from 'common/utils/wxConf'
export default {
  name: 'RepairManagerDetail',
  components: {
    Flexbox,
    FlexboxItem,
    ImgRow,
    ImgCell,
    Fitimg,
    Split,
    Btn,
    Icon,
    XSelect,
    XOption,
    XTextarea
  },
  data () {
    return {
      id: '',
      content: null,
      desc: '',
      engineers: [],
      selectedEngineer: {},
      showRefuse: false,
      showDispatch: false,
      refuseReason: '',
      allotReason: '',
      showReWrite: false,
      troubleGroup: {},
      partAll: false,
      selectedPart: '',
      partresAll: false,
      selectedPartRes: '',
      troubleAll: false,
      selectedTrouble: '',
      showTreatedRefuse: false,
      refuseTreatedReason: ''
    }
  },
  computed: {
    repair () {
      return this.content ? this.content.repair : {}
    },
    detailList () {
      let arr = this.content ? this.content.detailList : []
      if (this.content && this.content.detailList.length > 0) {
        this.content.detailList.forEach(item => {
          item.Images = item.Images.split(',')
          if (item.Images.length === 1 && item.Images[0] === '') {
            item.Images = []
          } else {
            item.Images = item.Images.map(item => webRoot + item)
          }
        })
      }
      return arr
    },
    imgs () {
      let arr
      if (this.content) {
        arr = this.content.repair.Images.split(',')
        if (arr.length === 1 && arr[0] === '') {
          arr = []
        } else {
          arr = arr.map(item => webRoot + item)
        }
      } else {
        arr = []
      }
      return arr
    },
    repairedImgs () {
      return this.detailList
    },
    single () {
      return this.repair.State !== 0 && this.repair.State !== 2
    },
    currentProgress () {
      return this.content
             ? this.content.logList
             : []
    },
    parts () {
      return this.troubleGroup.Part
    },
    partres () {
      let pid = this.selectedPart
      return this.troubleGroup.PartRes.filter(item => item.PartID === pid)
    },
    trouble () {
      let pid = this.selectedPartRes
      return this.troubleGroup.Trouble.filter(item => item.PartResID === pid)
    },
    selectedPartName () {
      let name = ''
      if (this.parts && this.parts.length > 0 && this.selectedPart) {
        if (this.parts.find(item => item.ID === this.selectedPart)) {
          name = this.parts.find(item => item.ID === this.selectedPart).Name
        } else {
          name = ''
        }
      }
      return name
    },
    selectedPartResName () {
      let name = ''
      if (this.partres && this.partres.length > 0 && this.selectedPartRes) {
        if (this.partres.find(item => item.ID === this.selectedPartRes)) {
          name = this.partres.find(item => item.ID === this.selectedPartRes).Name
        } else {
          name = ''
        }
      }
      return name
    },
    selectedTroubleName () {
      let name = ''
      if (this.trouble && this.trouble.length > 0 && this.selectedTrouble) {
        if (this.trouble.find(item => item.ID === this.selectedTrouble)) {
          name = this.trouble.find(item => item.ID === this.selectedTrouble).Name
        } else {
          name = ''
        }
      }
      return name
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.getDetail()
    },
    selectedPart () {
      this.selectedPartRes = ''
      this.selectedTrouble = ''
    },
    selectedPartRes () {
      this.selectedTrouble = ''
    }
  },
  filters: {
    formatStatus (val) {
      let str = ''
      switch (val) {
        case 0:
          str = '待处理'
          break
        case 1:
          str = '处理中'
          break
        case 2:
          str = '已处理'
          break
        case 3:
          str = '已完成'
          break
        case 4:
          str = '已完成'
          break
        case 5:
          str = '已取消'
          break
        default:
          break
      }
      return str
    },
    formatdate (val) {
      return formatDate(new Date(val), 'yyyy/MM/dd hh:mm')
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getDetail()
  },
  methods: {
    getDetail () {
      api.repair.detail(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let content = res.data.Data
          this.content = content
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    getEngineers (cb) {
      if (this.engineers.length > 0) {
        return
      }
      api.repair.manager.getEngineers(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let engineers = res.data.Data
          this.engineers = engineers
          cb && cb(engineers)
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    getParts () {
      api.repair.user.parts()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let troubleGroup = res.data.Data
          this.troubleGroup = troubleGroup
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    previewImg (cur, groups) {
      let current = window.location.origin + cur
      let urls = groups.map(item => window.location.origin + item)
      wxConf.previewImg({
        current,
        urls
      })
    },
    submit () {
      if (this.selectedEngineer.value !== 0 && !this.selectedEngineer.value) {
        window.$alert('请选择工程师')
        return
      }
      let _self = this
      api.repair.manager.submit(this.id, this.selectedEngineer.value)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '提交成功！',
            yes () {
              window.$close(index)
              _self.$router.go(-1)
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    back () {
      this.$router.replace({
        name: 'repairmanager',
        params: {
          state: 'untreated'
        }
      })
    },
    // 弹层
    toggleRefuse () {
      this.showRefuse = !this.showRefuse
    },
    toggleDispatch () {
      this.getEngineers(engineers => {
        if (engineers.length < 1) {
          window.$alert('此报修问题尚未设置施工人员')
        } else {
          this.showDispatch = !this.showDispatch
        }
      })
    },
    toggleReWrite () {
      if ((this.troubleGroup.Part && this.troubleGroup.Part.length < 0) || !this.troubleGroup.Part) {
        this.getParts()
      }
      this.showReWrite = !this.showReWrite
    },
    toggleTags (str) {
      this[str] = !this[str]
    },
    toggleTreatedRefuse () {
      this.showTreatedRefuse = !this.showTreatedRefuse
    },
    // 取消报修单
    submitRefuse () {
      if (!this.refuseReason.trim()) {
        window.$alert('请填写取消理由')
        return
      }
      api.repair.manager.refuse(this.id, this.refuseReason)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '此单已取消！',
            yes: () => {
              window.$close(index)
              this.$router.replace({
                name: 'repairmanager',
                params: {
                  state: 'untreated'
                }
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    // 分配工程师处理
    allotEngineer () {
      if (!this.selectedEngineer.value && this.selectedEngineer.value !== 0) {
        window.$alert('请选择分配的工程师')
        return
      }
      if (!this.allotReason) {
        window.$alert('请填写分配原因')
        return
      }
      let _self = this
      api.repair.manager.allot(this.id, this.selectedEngineer.value, this.allotReason)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '分配成功！',
            yes () {
              window.$close(index)
              _self.$router.replace({
                name: 'repairmanager',
                params: {
                  state: 'untreated'
                }
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    // 编辑问题
    updateTrouble () {
      this.repair.Part = `${this.selectedPartName}-${this.selectedPartResName}-${this.selectedTroubleName}`
      if (!this.selectedPart) {
        window.$alert({
          content: '请选择报修部位'
        })
        return
      }
      if (!this.selectedPartRes) {
        window.$alert({
          content: '请选择报修部品'
        })
        return
      }
      if (!this.selectedTrouble) {
        window.$alert({
          content: '请选择报修问题'
        })
        return
      }
      api.repair.manager.reWrite(this.id, this.selectedTrouble)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '编辑成功！',
            yes: () => {
              window.$close(index)
              this.toggleReWrite()
              this.getDetail()
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    // 通过已处理
    passTreated () {
      let index = window.$confirm({
        title: '提示',
        content: '确定通过吗？',
        btns: ['取消', '确定'],
        yes: () => {
          window.$close(index)
          api.repair.manager.passTreated(this.id)
          .then(({res, index}) => {
            if (res.data.IsSuccess) {
              window.$alert({
                title: '提示',
                content: '维修工单已通过！',
                yes: () => {
                  this.$router.push({
                    name: 'repairmanager',
                    params: {
                      state: 'finished'
                    }
                  })
                }
              })
            } else {
              window.$alert(res.data.Message)
            }
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
    },
    // 驳回已处理
    refuseTreated () {
      if (!this.refuseTreatedReason.trim()) {
        window.$alert('请填写驳回理由')
        return
      }
      let index = window.$confirm({
        title: '提示',
        content: '确定驳回吗？',
        btns: ['取消', '确定'],
        yes: () => {
          window.$close(index)
          api.repair.manager.refuseTreated(this.id, this.refuseTreatedReason)
          .then(({res, index}) => {
            if (res.data.IsSuccess) {
              window.$alert({
                title: '提示',
                content: '维修工单已驳回！',
                yes: () => {
                  this.$router.push({
                    name: 'repairmanager',
                    params: {
                      state: 'finished'
                    }
                  })
                }
              })
            } else {
              window.$alert(res.data.Message)
            }
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.repair-detail{
  width: 100vw;
  .tag{
    display: inline-block;
    background: #ccc;
    color:$text-color;
    padding: p2r(10) p2r(15);
    border-top-right-radius: 4px;
    position: absolute;
    top:0;
    right:0;
  }
  .repair-detail-wrapper{
    min-height: 100vh;
    padding-bottom: p2r(340);
    background: $background-color;
    &.single{
      min-height: 100vh;
      padding-bottom: p2r(200);
      background: $background-color;
    }
    .detail{
      background: #fff;
      padding: p2r(40) p2r($base-padding) p2r($base-padding);
      .house-name{
        color:$primary-color;
        font-size: p2r(28);
        line-height: 1.5;
      }
      .date{
        flex: 0 0 p2r(200);
        width: p2r(200);
        text-align: right;
        font-weight: 200;
        font-size: p2r(24);
        line-height: p2r(28 * 1.7);
        color: $thr-color;
      }
      .info{
        background: $primary-color;
        color: #fff;
        padding: p2r($base-padding / 2) p2r($base-padding);
        border-radius: 4px;
        margin-top: p2r(20);
        line-height: 1.5;
      }
      .desc{
        margin-top: p2r(20);
        line-height: 1.5;
        color:$text-sub-color;
      }
      .imgs{
        margin-top: p2r($base-padding / 3);
      }
      .split{
        margin-top: p2r($base-padding);
        margin-left: p2r(-$base-padding);
        margin-right: p2r(-$base-padding);
        width: auto;
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
      .order-score{
        margin-top: p2r(30);
        .left,.right{
          color: $thr-color;
          font-size: 12px;
        }
        .right{
          text-align: right;
        }
      }
      .sub-order-list{
        margin-left: p2r(-$base-padding);
        margin-right: p2r(-$base-padding);
        .sub-order{
          background: #fff;
          padding:0 p2r($base-padding) p2r($base-padding);
          border-bottom: p2r(1) solid #ddd;
          &:last-child{
            border-bottom:none;
            padding-bottom: 0;
          }
          .desc{
            background: #eee;
            width:100%;
            border-radius: 4px;
            height: auto;
            padding: p2r(20);
          }
          .more-detail{
            margin: p2r(10) p2r(-10) 0;
            .split{
              margin-top: p2r(30);
            }
          }
          .builder-name, .tel{
            margin-top: p2r(20);
            color: $thr-color;
            font-size: p2r(24);
          }
          .tel, .timelimit{
            text-align: right;
          }
          .state, .timelimit{
            font-size: p2r(24);
            margin-bottom: p2r(10);
          }
          .state{
            padding-top: p2r(5);
            &.handling{
              color:$primary-color;
            }
            &.done{
              color:$success-color;
            }
          }
          .timelimit{
            .tag{
              background: $primary-color;
              color:#fff;
              display: inline-block;
              border-radius: 25px;
              padding:p2r(5) p2r(20);
            }
          }
        }
      }
    }
    .progress-wrapper{
      margin-top: p2r($base-padding);
      .progress{
        background: #fff;
        padding: p2r($base-padding) p2r($base-padding) 0;
        .progress-item{
          &:first-child{
            .icon{
              &:after{
                background:$primary-color;
              }
              .iconfont{
                font-size: p2r(42);
                color:$primary-color;
              }
            }
          }
          &:last-child{
            .icon{
              &:after{
                display: none;
              }
            }
          }
          .icon{
            flex:0 0 p2r(42);
            position: relative;
            text-align: center;
            .iconfont{
              font-size: p2r(30);
              background: #fff;
              color:$thr-color;
              position: relative;
              z-index: 1;
            }
            &:after{
              content: '';
              display: block;
              width: 1px;
              height:100%;
              background: $thr-color;
              position: absolute;
              top:0;
              left:p2r(19);
              z-index: 0;
            }
          }
          .item-body{
            padding-left: p2r(54);
            .time{
              font-size: p2r(24);
              color:$thr-color;
              font-weight: 200;
            }
            .status{
              font-size: p2r(28);
              color:$primary-color;
              margin-top: p2r(20);
            }
            .info{
              margin-top: p2r(20);
              margin-bottom: p2r(70);
              font-size: p2r(24);
              color:$text-color;
              background: $background-color;
              padding: p2r(20);
              font-weight: 200;
              line-height: 1.4;
              &.opa{
                opacity: 0;
                padding:0 p2r(20);
              }
            }
          }
        }
      }
    }
    .dispatch{
      background: #fff;
      padding:p2r($base-padding) p2r($base-padding) p2r($base-padding * 2);
      .title{
        font-size: p2r(26);
        color: $thr-color;
      }
      .x-select{
        width: 100%;
        height: p2r(100);
        margin-top: p2r($base-padding);
        .x-option{
          .left{
            flex: 0 0 auto;
          }
          .right{
            text-align: right;
          }
        }
      }
    }
  }
  &>.btns{
    position: relative;
    margin-top: p2r(-300);
    // background: #fff;
    &.single{
      margin-top: p2r(-150);
    }
    .three-btn{
      width: p2r(590);
      margin: p2r(30) auto;
    }
    .two-btn{
      width: p2r(590);
      margin: p2r(30) auto;
      .btn.mini{
        width: p2r(280);
      }
    }
  }
  .refuse{
    .bg{
      position: fixed;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
      top: 0;
      left: 0;
      z-index: 1;
    }
    .refuse-wrapper{
      position: fixed;
      width: 100%;
      left:0;
      bottom: 0;
      z-index: 2;
      background: #fff;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding: p2r($base-padding);
      min-height: p2r(500);
      max-height: p2r(700);
      .textarea-wrapper{
        width: 100%;
        height: p2r(300);
        margin: p2r(20) auto;
        font-size: p2r(26);
      }
      .btn{
        margin: p2r(20) auto;
      }
    }
  }
  .dispatch{
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
    top: 0;
    left: 0;
    z-index: 1;
    padding: p2r($base-padding);
    .dispatch-wrapper{
      width: 100%;
      height: calc(100% - 6rem);
      padding-left: p2r(30);
      padding-right: p2r(30);
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .x-select,
      .textarea-wrapper{
        width: 100%;
        margin: p2r($base-padding) auto;
        font-size: p2r(28);
      }
      .x-select{
        height: p2r(100);
        .x-option{
          .left{
            flex: 0 0 auto;
          }
          .right{
            text-align: right;
          }
        }
      }
      .textarea-wrapper{
        border: none;
      }
      .title{
        font-size: p2r(26);
        color: $text-sub-color;
      }
      .selected-span{
        text-align: right;
        font-size: 0;
        .text{
          display: inline-block;
          font-size: p2r(26);
          padding-right: p2r(10);
          color: $thr-color;
          &.color{
            color:$primary-color;
          }
        }
        .iconfont{
          display: inline-block;
          font-size: p2r(26);
          color:$thr-color;
          &.hide{
            transform: rotate(90deg);
          }
          &.show{
            transform: rotate(-90deg);
          }
        }
      }
      .selected-info{
        padding: p2r(20) 0;
        .flexbox{
          margin-bottom: p2r(30);
        }
        .head{
          flex:0 0 auto;
          font-size: p2r(26);
          color:$text-color;
          font-weight: 200;
          line-height: p2r(40);
        }
        .body{
          font-size: 0;
          .selected-tag{
            display: inline-block;
            background: $primary-color;
            height: p2r(60);
            line-height: p2r(60);
            padding:0 p2r(10);
            border-radius: p2r(4);
            font-size: 0;
            text-align: center;
            .text{
              display: inline-block;
              font-size: p2r(24);
              vertical-align: top;
              color:#fff;
            }
            .icon{
              display: inline-block;
              vertical-align: top;
              width: p2r(50);
              height: p2r(60);
              margin-right: p2r(-20);
              .iconfont{
                font-size: p2r(24);
              }
            }
          }
        }
      }
      .tags{
        margin-top: p2r(30);
        .tags-row{
          margin-left: p2r(-20);
          margin-right: p2r(-20);
          margin-top: p2r(20);
          &.hide{
            overflow: hidden;
            height: p2r(80);
          }
          &.show{
            height: auto;
          }
          .radio-tag{
            display: inline-block;
            position: relative;
            margin:p2r(10) 0;
            width: 33.333%;
            padding:0 p2r(15);
            .radio{
              position: absolute;
              top:0;
              left:0;
              width: 100%;
              height: 100%;
              opacity: 0;
              &:checked{
                & + .text{
                  background: $primary-color;
                  border-color: $primary-color;
                  color:#fff;
                }
              }
            }
            .text{
              display: block;
              border:1px solid $thr-color;
              height: p2r(60);
              line-height: p2r(60);
              padding:0 p2r(10);
              border-radius: p2r(4);
              font-size: p2r(24);
              text-align: center;
              color:$thr-color;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
    }
    .btns{
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      padding-bottom: p2r($base-padding);
      .btn{
        margin-top: p2r($base-padding);
        margin-bottom: p2r($base-padding);
        &:first-child{
          margin-top: 0;
        }
      }
    }
  }
}
</style>
