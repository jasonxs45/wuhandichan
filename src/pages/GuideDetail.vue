<template>
  <div class="guide-detail">
    <div class="top">
      <Fitimg class="bg" :src="item.Img"/>
      <div class="wrapper">
        <h3 class="title">{{item.Name}}</h3>
        <p v-if="item.Address" class="address" @click="openMap">
          <Icon name="location" />
          {{item.Address}}
        </p>
      </div>
    </div>
    <div class="content">
      <div
        v-if="typeList"
        v-for="(value, key) in typeList"
        :key="'type-'+key"
        class="type-item-group"
      >
        <h3 class="group-title">{{key}}</h3>
        <flexbox
          v-if="value.length > 0"
          v-for="(item, index) in value"
          :key="'item-'+index"
          class="item"
        >
          <flexbox-item class="name">{{item.Name}}</flexbox-item>
          <flexbox-item class="tel"><a :href="'tel:'+item.Tel">{{item.Tel}}</a></flexbox-item>
        </flexbox>
      </div>
      <nodata v-if="!typeList">暂无数据</nodata>
    </div>
  </div>
</template>
<script>
import {
  Icon,
  Fitimg,
  Flexbox,
  FlexboxItem,
  Nodata
} from 'components'
import api from 'common/api'
import {
  webRoot
} from 'common/data'
import wxConf from 'common/utils/wxConf'
export default {
  name: 'GuideDetail',
  components: {
    Icon,
    Fitimg,
    Flexbox,
    FlexboxItem,
    Nodata
  },
  data () {
    return {
      id: null,
      item: {}
    }
  },
  computed: {
    typeList () {
      let list = null
      if (this.item.serviceList && this.item.serviceList.length) {
        list = {}
        let arr = this.item.serviceList
        for (let i = 0; i < arr.length; i++) {
          if (!list[arr[i].TypeName]) {
            list[arr[i].TypeName] = [arr[i]]
          } else {
            list[arr[i].TypeName].push(arr[i])
          }
        }
      }
      return list
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.getDetail()
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getDetail()
  },
  methods: {
    getDetail () {
      api.guide.detail(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.item = res.data.Data
          this.item.Img = !this.item.Img ? '' : webRoot + this.item.Img
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    openMap () {
      if ((!this.item.Point_y) || (!this.item.Point_y)) {
        return
      }
      let opt = {
        latitude: parseFloat(this.item.Point_y),
        longitude: parseFloat(this.item.Point_x),
        scale: 12,
        name: this.item.Name,
        address: this.item.Address
      }
      wxConf.openMap(opt)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.guide-detail{
  .top{
    width:100%;
    height: p2r(240);
    background: #ccc;
    position: relative;
    .wrapper{
      position: absolute;
      top:0;
      width:100%;
      height: 100%;
      background: rgba(0,0,0,.5);
      color:#fff;
      padding-top: p2r(70);
      .title{
        font-size: p2r(36);
        text-align: center;
        font-weight: 600;
      }
      .address{
        font-size: p2r(24);
        text-align: center;
        padding-top: p2r(40);
      }
    }
  }
  .content{
    .group-title{
      height: p2r(60);
      line-height: p2r(60);
      font-size: p2r(26);
      color:$text-sub-color;
      background: $background-color;
      padding:0 p2r($base-padding);
    }
    .item{
      padding:0 p2r($base-padding) 0 0;
      margin-left: p2r($base-padding);
      height: p2r(100);
      line-height: p2r(100);
      color:$text-color;
      @include _1px(#ddd);
      &:last-child{
        background: none;
      }
      .name{
        font-size: p2r(28);
      }
      .tel{
        flex: 0 0 p2r(220);
        width: p2r(220);
        text-align: right;
        a {
          font-size: p2r(26)
        }
      }
    }
  }
}
</style>
