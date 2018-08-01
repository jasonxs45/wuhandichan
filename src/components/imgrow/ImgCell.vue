<template>
  <div class="img-cell">
    <slot></slot>
    <div
      v-if="del"
      class="delete"
      :index="index"
      :group="group"
      @click="deleteImg"
    >
      <Icon
        name="close"
      />
    </div>
  </div>
</template>
<script>
import Icon from 'components/icon'
export default {
  name: 'ImgCell',
  components: {
    Icon
  },
  props: {
    index: {
      type: Number
    },
    group: {
      type: Array
    },
    del: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    deleteImg (e) {
      this.group.splice(this.index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.img-cell{
  width:25%;
  border-radius: 4px;
  margin:p2r(20) 0 0;
  position: relative;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  .fit-img{
    width: p2r(120);
    height: p2r(120);
  }
  .delete{
    position: absolute;
    width:p2r(36);
    height: p2r(36);
    text-align: center;
    top:p2r(-15);
    right:p2r(5);
    z-index:1;
    background: $primary-color;
    border-radius: 50%;
    color:#fff;
    .iconfont{
      height: 100%;
      font-size: p2r(28);
      line-height: p2r(36);
      display: inline-block;
    }
  }
}
</style>
