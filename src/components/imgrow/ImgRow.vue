<template>
<container>
  <row
    :group="group"
    class="img-row"
  >
    <slot></slot>
      <img-cell>
          <div
            v-if="canUpload&&group.length<maxCount"
            class="upload-btn"
            @click="clickHandler"
          >
            <Icon name="camera"/>
          </div>
      </img-cell>
  </row>
</container>
</template>
<script>
import Container from 'components/container'
import Row from 'components/row'
import Icon from 'components/icon'
import ImgCell from './ImgCell'
import wxConf from 'common/utils/wxConf'
export default {
  name: 'ImgRow',
  components: {
    Container,
    Row,
    Icon,
    ImgCell
  },
  props: {
    group: {
      type: Array
    },
    canUpload: {
      type: Boolean,
      default: false
    },
    maxCount: {
      type: Number,
      default: 4
    }
  },
  methods: {
    clickHandler (e) {
      let _self = this
      wxConf.wxUpload(_self.maxCount, (res) => {
        this.$emit('on-upload', res)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
.img-row{
  margin: {
    left: p2r(-50) !important;
    right: p2r(-50) !important;
  }
  font-size: 0;
  .upload-btn{
    width: p2r(120);
    height: p2r(120);
    border:1px dashed $thr-color;
    border-radius: 4px;
    position: relative;
    display: inline-block;
    vertical-align: top;
    line-height: p2r(120);
    text-align: center;
    color:lighten($primary-color, 15%);
    .iconfont{
      font-size: p2r(34);
      color:$thr-color;
    }
  }
}
</style>
