<template>
  <div class="activity-list">
    <div v-if="list.length<1" class="nodata-box">
      <nodata><p>对不起，<br/>您尚未参与任何活动</p></nodata>
      <Btn style="display:none" type="primary" text="社区活动" @click="goList"/>
    </div>
    <activitycard
      v-for="(item, index) in list"
      :data-id="item.id"
      :key="'activity-'+index"
      :img="webRoot+item.img"
      :title="item.title"
      :playDateRange="item.playDateRange"
      :read-num="item.readNum"
      :local="item.local"
      :condition="item.condition"
      :state="item.state"
    ></activitycard>
  </div>
</template>
<script>
import {
  Activitycard,
  Nodata,
  Btn
} from 'components'
import api from 'common/api'
import {
  formatDate
} from 'common/utils/date'
import {
  webRoot
} from 'common/data'
const CLASS_MAP = {
  activity: {
    title: '会员活动',
    S_Class: 1
  },
  signup: {
    title: '预约保养',
    S_Class: 2
  },
  accept: {
    title: '开放/交付',
    S_Class: 3
  },
  mine: {
    title: '我的活动',
    S_Class: -1
  }
}
export default {
  name: 'ActivityList',
  components: {
    Activitycard,
    Nodata,
    Btn
  },
  data () {
    return {
      activityList: [],
      currentView: '',
      webRoot
    }
  },
  computed: {
    list () {
      return this.activityList.map(item => {
        return {
          id: item.ID,
          img: item.Img,
          title: item.Name,
          applyDateRange: formatDate(new Date(item.ApplyStart), 'yyyy/MM/dd') + '-' + formatDate(new Date(item.ApplyEnd), 'yyyy/MM/dd'),
          playDateRange: formatDate(new Date(item.PlayStart), 'yyyy/MM/dd') + '-' + formatDate(new Date(item.PlayEnd), 'yyyy/MM/dd'),
          readNum: item.ViewCount,
          local: '',
          condition: item.Explain,
          state: item.IsOver ? 1 : 0
        }
      })
    }
  },
  watch: {
    '$route' (to, from) {
      this.currentView = to.params.classtype
      if (CLASS_MAP[this.currentView]) {
        window.document.title = CLASS_MAP[this.currentView].title || '武汉地产'
        this.getList()
      } else {
        this.$router.push({
          name: 'pagenotfound'
        })
      }
    }
  },
  created () {
    this.currentView = this.$route.params.classtype
    if (CLASS_MAP[this.currentView]) {
      window.document.title = CLASS_MAP[this.currentView].title || '武汉地产'
      this.getList()
    } else {
      this.$router.push({
        name: 'pagenotfound'
      })
    }
  },
  methods: {
    getList () {
      api.activity.list(CLASS_MAP[this.currentView].S_Class)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.activityList = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    goList () {
      this.$router.replace({
        name: 'activitylist',
        params: {
          classtype: 'activity'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.activity-list{
  padding: p2r($base-padding);
  .nodata-box{
    margin-top: p2r(260);
    text-align: center;
    .btn{
      margin-top: p2r(40);
    }
  }
}
</style>
