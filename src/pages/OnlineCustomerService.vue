<template>
  <div class="online-customer-service">
    <div v-if="servicelist.length < 1" class="no-data">
      <img src="static/images/nodata.png" alt="" />
      <p class="text">暂无在线客服</p>
    </div>
    <div v-for="(item, index) in servicelist" :key="'item-'+index" class="item" @click="go(item.FansID)">
      <flexbox align="center" justify="justify">
        <flexbox-item class="avatar-wrapper">
          <Fitimg :src="item.HeadImgUrl" class="avatar"/>
        </flexbox-item>
        <flexbox-item>
          <p class="name">{{item.Name}}</p>
        </flexbox-item>
        <flexbox-item class="arrow">
          <Icon name="arrow-right1" />
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
import {
  Fitimg,
  Flexbox,
  FlexboxItem,
  Icon
} from 'components'
import api from 'common/api'
export default {
  name: 'OnlineCustomerService',
  components: {
    Fitimg,
    Flexbox,
    FlexboxItem,
    Icon
  },
  data () {
    return {
      servicelist: [1]
    }
  },
  methods: {
    list () {
      api.onlineservice.list().then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.servicelist = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      })
    },
    go (id) {
      location.href = `http://whdc.1juke.cn/mobile/customservice.html?ID=${id}`
    }
  },
  created () {
    this.list()
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.online-customer-service{
  .no-data{
    width: p2r(312);
    margin: p2r(200) auto 0;
    .text{
      color: $thr-color;
      font-size: p2r(28);
      text-align: center;
      margin-top: p2r(30);
    }
  }
  .item{
    padding: p2r($base-padding);
    @include _1px();
    background-color: #fff;
    .avatar-wrapper{
      width: p2r(170);
      flex: 0 0 p2r(170);
      .avatar{
        width: p2r(140);
        height: p2r(140);
        border-radius: 50%;
      }
    }
    .name {
      font-size: p2r(28);
      font-weight: 200;
    }
    .arrow{
      text-align: right;
      width: p2r(50);
      flex: 0 0 p2r(50);
      color:$thr-color;
    }
  }
}
</style>
