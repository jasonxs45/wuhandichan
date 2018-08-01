<template>
  <div class="mypoints">
    <div class="top">
      <p class="points">
        <span class="text">当前积分：</span><br />
        <span class="count">{{myPoints}}</span>
      </p>
      <p class="gohelp" @click="toggleHelp">
        <span class="text">积分规则</span>
        <Icon name="help"/>
      </p>
    </div>
    <div class="content">
      <nodata v-if="record.length<1">暂无记录</nodata>
      <flexbox
        v-if="record.length>0"
        v-for="(item, index) in record"
        align="center"
        :key="'item-'+index+Math.random().toString(36).substr(2)"
        class="item"
      >
        <flexbox-item class="left">
          <p class="title">{{item.Title}}</p>
          <p class="date">{{item.AddTime}}</p>
        </flexbox-item>
        <flexbox-item class="right" :class="item.Value > 0 ? 'incre' : 'decre'">{{item.Value > 0 ? '+' + item.Value : item.Value }}</flexbox-item>
      </flexbox>
    </div>
    <transition name="fade">
      <div v-if="showHelp" class="help">
        <div class="help-wrapper">
          <h3 class="title">武汉地产集团华中客户服务微会员积分规则</h3>
          <div class="details">
            <dl>
              <dt class="subtit">什么是武汉地产微积分？</dt>
              <dd class="linetext">关注武汉地产集团华中客户服务公众号微信平台（以下简称武汉地产客服公众号），并成功注册成为武汉地产微会员的用户，在使用其服务时，武汉地产客服公众号根据相关规则给予用户的一种会员积分奖励。武汉地产微积分仅在武汉地产客服公众号微信平台内使用。</dd>
              <dt class="subtit">如何获取武汉地产微积分？</dt>
              <dd class="linetext">一、关注并绑定房源获取100积分(一套房源仅限一次)；</dd>
              <dd class="linetext">二、完善个人真实资料可获50积分（只能享受一次）；</dd>
              <dd class="linetext" style="display:none">三、不同类别会员（业主、家属、租户）绑定房产信息可获得不同积分（100、50、20），一房只能享受一次（每个房产最多绑定两名业主、两名家属和一名租户）；</dd>
              <dd class="linetext" style="display:none">三、转发本公众号所发布的活动信息可获得10积分（每个用户每天最多只能获得两次转发奖励，一种是成功分享到朋友圈，一种是成功分享给好友或群）；</dd>
              <dd class="linetext">三、通过专属二维码邀请好友关注本公众号可获得相应的积分奖励，推荐奖励为10积分，每天最多奖励100积分（注册会员可获得专属的推广二维码图片，用户可邀请好友扫码关注公众号获得积分奖励）；</dd>
              <dd class="linetext">四、获得在线报修服务后，提交服务评价的，可获得50积分（有效报修，不封顶）；</dd>
              <dd class="linetext">五、参与在线调查问卷填写并完成提交可获得积分奖励（由本公众号平台按单个问卷难易程度具体配置积分奖励额度）</dd>
              <dt class="subtit">武汉地产微积分可以用来做什么？</dt>
              <dd class="linetext">一、积分礼品兑换：在武汉地产云服务活动首页中，会员可根据当期积分礼品兑换活动规则兑换相应礼品，兑换成功后扣除相应积分；</dd>
              <dd class="linetext">二、活动名额兑换：在武汉地产云服务活动首页中，会员可根据当期关怀活动规则兑换相应场次活动的参加名额，兑换成功后扣除相应积分；</dd>
              <dd class="linetext">三、服务兑换：在主动保养服务首页中，会员可根据服务规则兑换相应服务项目，兑换成功后扣除相应积分。</dd>
              <dt class="subtit">武汉地产微积分兑换规则说明</dt>
              <dd class="linetext">一、武汉地产客服公众号所提供的积分礼品、服务及活动的兑换，均以当期发布的活动具体规则为准；</dd>
              <dd class="linetext">二、会员积分作为武汉地产客服公众号中的虚拟记录符号，不能在会员间相互转让，不能使用包括人民币在内的任何法定货币购买，不具有在武汉地产客服公众号以外的环境中进行交易结算的功能；</dd>
              <dd class="linetext">三、武汉地产客服公众号有权调整积分规则（包括但不限于积分获取规则、使用规则、兑换规则、有效期等）;</dd>
              <dd class="linetext">四、武汉地产客服公众号积分规则解释权归武汉地产客服公众号平台所有。</dd>
            </dl>
          </div>
        </div>
        <Icon class="close" name="close-fill" @on-click="toggleHelp"/>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  Nodata,
  Flexbox,
  FlexboxItem,
  Icon
} from 'components'
import api from 'common/api'
export default {
  name: 'MyPoints',
  components: {
    Nodata,
    Flexbox,
    FlexboxItem,
    Icon
  },
  data () {
    return {
      myPoints: 0,
      record: [],
      showHelp: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      api.mypoints.list()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.myPoints = res.data.Data.Count
          this.record = res.data.Data.List
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    toggleHelp () {
      this.showHelp = !this.showHelp
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.mypoints{
  width:100vw;
  height: 100vh;
  .top{
    width: 100%;
    height: p2r(240);
    background: url('../../static/images/uctop.png') center/cover no-repeat;
    padding-top: p2r(70);
    position: relative;
    .points{
      color:#fff;
      font-size: 0;
      text-align: center;
      .text{
        font-size: p2r(24);
        display:inline-block;
        font-weight: 200;
      }
      .count{
        font-size: p2r(60);
        font-weight: 600;
        margin-top: p2r(10);
        display:inline-block;
      }
    }
    .gohelp{
      position: absolute;
      top:p2r(30);
      right:p2r(30);
      font-size: 0;
      color:#fff;
      .text{
        font-size: p2r(24);
        line-height: p2r(28);
        display: inline-block;
        vertical-align: top;
        margin-right: p2r(10);
      }
      .iconfont{
        font-size: p2r(28);
        display: inline-block;
        vertical-align: top;
      }
    }
  }
  .content{
    width:100%;
    height: calc(100% - 5.12rem);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding:0 p2r($base-padding);
    .item{
      padding-top: p2r(46);
      padding-bottom: p2r(20);
      @include _1px(#eee);
      &:last-child{
        background: none;
      }
      .left{
        .title{
          margin-top: p2r(10);
          font-size: p2r(28);
        }
        .date {
          color: $thr-color;
          margin-top: p2r(15);
        }
      }
      .right{
        flex: 0 0 p2r(100);
        width: p2r(100);
        text-align: right;
        font-size: p2r(40);
        &.incre{
          color: $success-color;
        }
        &.decre{
          color: $error-color;
        }
      }
    }
  }
  .help{
    width: 100%;
    height: 100%;
    position: fixed;
    z-index:100;
    top:0;
    left:0;
    background: rgba(0,0,0,.7);
    padding:p2r($base-padding*2) p2r($base-padding) p2r($base-padding);
    .help-wrapper{
      background: #fff;
      width:100%;
      height: calc(100% - 2.6rem);
      border-radius: 4px;
      padding: p2r($base-padding);
      .title{
        text-align: center;
        color:$primary-color;
        font-size: p2r(32);
        height: p2r(90);
        line-height: p2r(90);
      }
      .subtit{
        height: p2r(60);
        line-height: p2r(60);
        background: url('../../static/images/titrepeat.png') center/auto 100% repeat-x;
        color:#fff;
        font-size: p2r(28);
        display: inline-block;
        padding:0 p2r(10) 0 p2r(20);
        position: relative;
        margin: p2r(30) 0 p2r(20);
        &:first-child{
          margin-top: 0;
        }
        &:after{
          content: '';
          display:inline-block;
          position: absolute;
          left:99.62%;
          width:p2r(34);
          height: p2r(60);
          line-height: p2r(60);
          background: url('../../static/images/titheader.png') center/100% 100% no-repeat;
        }
      }
      table{
        tr{
          td,th{
            font-size: p2r(24);
            color:$text-sub-color;
            vertical-align: middle;
            padding: 5px;
            width:25%;
          }
          th{
            background: $background-color;
            font-weight: 600;
          }
          &:nth-child(2n){
            background: $background-color;
          }
        }
      }
      .linetext{
        font-size: p2r(24);
        line-height: 1.5;
        margin: p2r(15) 0;
        color:$text-sub-color;
      }
      .details{
        font-size: p2r(28);
        color:$text-color;
        height: calc(100% - 3rem);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
    .close{
      color:#fff;
      width: p2r(60);
      font-size: p2r(60);
      display:block;
      margin: p2r(30) auto 0;
    }
  }
}
</style>
