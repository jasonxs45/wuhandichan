<template>
<div :class="classes">
  <flexbox>
    <flexbox-item class="avatar-wrapper">
      <Avatar :src="userInfo.avatar" />
    </flexbox-item>
    <flexbox-item>
      <div class="nickname">
        <div class="text">{{userInfo.nickname}}</div>
        <div v-if="userInfo.markMap[userInfo.state]" class="mark"><slot name="tag">{{userInfo.markMap[userInfo.state]}}</slot></div>
      </div>
      <div class="state-info"><slot name="desc">{{userInfo.house}}</slot></div>
    </flexbox-item>
  </flexbox>
<div class="tag-area" v-if="tagText">
  <div class="tap-block" @click="tagClick">
    <span class="text">{{tagText}}</span>
    <Icon name="arrow-right1"/>
  </div>
</div>
</div>
</template>
<script>
import {
  Flexbox,
  FlexboxItem
} from 'components/flexbox'
import Avatar from 'components/avatar'
import Icon from 'components/icon'
import { mapActions } from 'vuex'
export default {
  name: 'Userinfo',
  components: {
    Flexbox,
    FlexboxItem,
    Avatar,
    Icon
  },
  props: {
    typeClass: {
      type: String,
      default: 'triangle'
    },
    tagText: {
      type: String
    }
  },
  computed: {
    classes () {
      return ['user-info', this.typeClass]
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  created () {
    this.getInfoAsync()
  },
  methods: {
    ...mapActions([
      'getInfoAsync'
    ]),
    getUserInfo () {
    },
    tagClick (e) {
      this.$emit('tagClick', e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.user-info{
  width:100%;
  height:p2r(220);
  background:url('../../../static/images/uctop.png') center/100% 100% no-repeat;
  padding-top: p2r(50);
  padding-left: p2r(30);
  position: relative;
  &.rectangle{
    height:p2r(240);
    background-image: url('../../../static/images/uctop.png')
  }
  .avatar-wrapper{
    flex:0 0 p2r(120)
  }
  .nickname{
    font-size: 0;
    margin-top: p2r(20);
    margin-left: p2r(40);
    .text{
      height:p2r(36);
      line-height: p2r(36);
      font-size: p2r(36);
      color:#fff;
      font-weight: 600;
      display: inline-block;
      vertical-align: middle;
    }
    .mark{
      font-size: p2r(20);
      display: inline-block;
      vertical-align: middle;
      background: $warning-color;
      color:#fff;
      min-width:p2r(60);
      height:p2r(36);
      line-height: p2r(36);
      text-align: center;
      border-radius: 20px;
      margin-left: p2r(20);
      font-weight: 200;
      padding:0 .2rem
    }
  }
  .state-info{
    font-size: p2r(24);
    color:#fff;
    opacity: .6;
    margin-top: p2r(30);
    margin-left: p2r(40);
  }
  .tag-area{
    .tap-block{
      border:1px solid #fff;
      border-right:none;
      border-top-left-radius: 25px;
      border-bottom-left-radius: 25px;
      color:#fff;
      min-width:p2r(180);
      position: absolute;
      right:0;
      top:p2r(70);
      padding:p2r(14) 0 p2r(12) p2r(20);
      .text,
      .iconfont{
        font-size: p2r(28);
      }
      .iconfont{
        font-size: p2r(24)
      }
    }
  }
}
</style>
