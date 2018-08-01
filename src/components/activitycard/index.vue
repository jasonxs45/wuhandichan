<template>
  <div class="activity-card" @click="clickHandler">
    <div class="card-content">
      <flexbox class="oneline title-line">
        <flexbox-item class="title">{{title}}</flexbox-item>
        <flexbox-item class="state" :class="state === 0?'':'timeout'">{{state === 0?'进行中':'已过期'}}</flexbox-item>
      </flexbox>
      <div class="img-wrapper">
        <Fitimg :src="img" alt="" />
      </div>
      <flexbox class="oneline">
        <flexbox-item class="fh">活动时间：</flexbox-item>
        <flexbox-item class="fb">{{playDateRange}}</flexbox-item>
        <flexbox-item v-if="readNum||readNum === 0" class="read-num">{{readNum}}人查看</flexbox-item>
      </flexbox>
      <flexbox class="oneline" v-if="local">
        <flexbox-item class="fh">报名地址：</flexbox-item>
        <flexbox-item class="fb">{{local}}</flexbox-item>
      </flexbox>
      <flexbox class="oneline" v-if="condition">
        <flexbox-item class="fh">参与条件：</flexbox-item>
        <flexbox-item class="fb">{{condition}}</flexbox-item>
      </flexbox>
    </div>
  </div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem
} from 'components/flexbox'
import Fitimg from 'components/fitimg'
export default {
  name: 'Activitycard',
  components: {
    Flexbox,
    FlexboxItem,
    Fitimg
  },
  props: {
    img: {
      type: String,
      required: true
    },
    id: {
      type: [String, Number]
    },
    title: {
      type: String,
      required: true
    },
    state: {
      type: [String, Number],
      required: true
    },
    playDateRange: {
      type: String
    },
    applyDateRange: {
      type: String
    },
    local: {
      type: String
    },
    condition: {
      type: String
    },
    readNum: {
      type: [String, Number]
    }
  },
  methods: {
    clickHandler (e) {
      let id = e.currentTarget.dataset.id
      this.$router.push({
        name: 'activitydetail',
        params: {
          id
        }
      })
      this.$emit('click', e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.activity-card{
  border-radius: 4px;
  overflow: hidden;
  background:#fff;
  box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  margin-top: p2r(30);
  &:first-child{
    margin-top:0;
  }
  .img-wrapper{
    width:100%;
    height:p2r(276);
    overflow: hidden;
    text-align: center;
  }
  .card-content{
    padding:p2r(20);
    .oneline{
      margin: p2r(20) 0;
      position: relative;
      color: $text-sub-color;
      &.title-line{
        align-items: flex-start;
        margin-top: 0;
      }
      .fh,.fb{
        font-weight: 200;
        line-height: 1.4;
      }
      .fh{
        flex: 0 0 p2r(120);
        width: p2r(120);
      }
    }
    .title{
      font-size: p2r(28);
      color:$text-color;
      font-weight: 500;
      line-height: p2r(32);
      display: inline-block;
      padding-right: p2r(30);
    }
    .date{
      font-size: p2r(24);
      color:$text-sub-color;
      font-weight: 200;
    }
    .read-num{
      font-size: p2r(24);
      color:$thr-color;
      font-weight: 200;
      text-align: right;
      position: absolute;
      right: 0;
    }
    .state{
      font-size: p2r(20);
      font-weight: 200;
      padding: p2r(5) 0;
      border-radius: 25px;
      background:$primary-color;
      color:#fff;
      width:p2r(100);
      text-align: center;
      flex:0 0 p2r(100);
      &.timeout{
        background:$btn-disable-color;
        color:$text-color;
      }
    }
  }
}
</style>
