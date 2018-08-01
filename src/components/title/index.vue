<template>
  <div class="title">
    <div class="more" v-if="$slots.more">
      <slot name="more"></slot>
    </div>
    <div class="title-content">
      {{text}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'Statisctitle',
  props: {
    text: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
  .title{
    font-size: 0;
    &:before{
      content: '';
      display: inline-block;
      width:3px;
      background-color:$primary-color;
      height:p2r(30);
    }
    .title-content,
    .more{
      display: inline-block;
      vertical-align: top;
      font-weight: 200;
    }
    .title-content{
      padding-left: p2r(10);
      height: p2r(30);
      font-size: p2r(28);
      color:$text-color;
      padding-right: p2r(10);
      width:calc(100% - .3rem);
      line-height: p2r(30);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .more{
      float: right;
      width: 2rem;
      line-height: p2r(28);
      color: $thr-color;
      font-size: p2r(24);
      text-align: right;
      & + .title-content{
        width:calc(100% - 2.3rem);
      }
    }
  }
</style>
