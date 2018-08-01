<template>
  <div class="repair-detail">
    <div class="repair-detail-wrapper">
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
            <Fitimg :src="item" @on-click="previewImg(item)"/>
          </img-cell>
        </img-row>
      </div>
      <Split type="line"/>
      <div class="dispatch">
        <h4 class="title">请分配工程师</h4>
        <x-select v-model="selectedEngineer" placeholder="请选择需要分配的工程师">
          <x-option
            v-for="(engineer, index) in enginners"
            :key="'engineer-'+index"
            :label="engineer.Name"
            :value="engineer.ID"
          >
            <flexbox>
              <flexbox-item class="left">{{engineer.Name}}</flexbox-item>
              <flexbox-item class="right"></flexbox-item>
            </flexbox>
          </x-option>
        </x-select>
      </div>
    </div>
    <div class="btns">
      <!-- 用户 -->
      <Btn
        type="primary"
        size="lar"
        text="分配"
        @click="submit"
      />
      <Btn
        type="default"
        size="lar"
        text="返回"
        @click="back"
      />
    </div>
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
  XOption
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
    XOption
  },
  data () {
    return {
      role: '',
      id: '',
      content: null,
      desc: '',
      enginners: [],
      selectedEngineer: {}
    }
  },
  computed: {
    repair () {
      return this.content ? this.content.repair : {}
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
    }
  },
  watch: {
    '$route' (to, from) {
      this.role = to.params.role
      this.id = to.params.id
      this.getDetail()
    }
  },
  filters: {
    formatdate (val) {
      return formatDate(new Date(val), 'yyyy/MM/dd hh:mm')
    }
  },
  created () {
    this.role = this.$route.params.role
    this.id = this.$route.params.id
    this.getDetail()
    this.allEngineer()
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
    allEngineer () {
      api.repair.manager.allEngineer()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let enginners = res.data.Data
          this.enginners = this.enginners.concat(enginners)
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    previewImg (cur) {
      let current = window.location.origin + cur
      let urls = this.imgs.map(item => window.location.origin + item)
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
      if (window.history.length >= 2) {
        window.history.go(-1)
      } else {
        if (window.wx) {
          wxConf.closeWindow()
        } else {
          window.close()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.repair-detail{
  width: 100vw;
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
      }
      .engineer-name,
      .tel{
        font-size: p2r(26);
        margin-top: p2r(40);
      }
      .tel{
        text-align: right;
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
    margin-top: p2r(-250);
    &.single{
      margin-top: p2r(-150);
    }
    .btn{
      margin: p2r(20) auto;
      &:first-child{
        margin-top: 0;
      }
    }
  }
}
</style>
