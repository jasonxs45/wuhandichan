<template>
  <div class="message-center">
    <div v-if="fetchedList.length<=0" class="no-data-guide">
      <nodata>暂无信息</nodata>
    </div>
    <div
      v-else
      v-for="(item, index1) in fetchedList"
      :key="'item-'+index1+Math.random().toString(36).substr(2)"
      class="card"
    >
      <div class="card-header">
        <h3 class="title">{{item.Title}}</h3>
        <p class="date">{{item.AddTime}}</p>
      </div>
      <div class="card-content">
        <p>{{item.First}}</p>
        <p
          v-for="msg in item.Msg.split(',')"
          :key="msg"
        >
          {{msg}}
        </p>
        <p>{{item.Remark}}</p>
      </div>
      <div class="card-footer" >
        <a
          v-if="item.Url"
          class="seemore"
          :href="item.Url"
        >查看详情</a>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Nodata
} from 'components'
import api from 'common/api'
export default {
  name: 'MessageCenter',
  components: {
    Nodata
  },
  data () {
    return {
      fetchedList: []
    }
  },
  created () {
    this.getMyMessage()
  },
  methods: {
    getMyMessage () {
      api.message.list()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.fetchedList = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.message-center{
  padding: p2r($base-padding);
  .card{
    margin-top: p2r(40);
    padding: p2r($base-padding);
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
    &:first-child{
      margin-top: 0;
    }
    .card-header{
      .title{
        font-size: p2r(30);
        font-weight: 600;
        color: $text-sub-color;
      }
      .date{
        font-size: p2r(24);
        color:$thr-color;
        margin-top: p2r(10);
      }
    }
    .card-content{
      padding: {
        top: p2r(20);
        bottom: p2r(20);
      }
      font-size: p2r(26);
      line-height: 1.7;
      color: $text-sub-color;
      @include _1px();
    }
    .card-footer{
      padding-top: p2r(20);
      text-align: right;
    }
  }
}
</style>
