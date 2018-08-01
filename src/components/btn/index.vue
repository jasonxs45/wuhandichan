<template>
  <button
    :class="classes"
    :disabled="disabled"
    @click="clickHandler"
  >
    {{text}}
  </button>
</template>
<script>
import wxConf from 'common/utils/wxConf'
export default {
  name: 'Btn',
  props: {
    back: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'base'
    },
    size: {
      type: String,
      default: 'mid'
    },
    text: {
      type: String,
      required: true
    },
    disabled: {
      type: [String, Boolean, Number]
    }
  },
  data () {
    return {}
  },
  computed: {
    classes () {
      return ['btn', this.type, this.size, this.disabled ? 'disabled' : '']
    }
  },
  methods: {
    clickHandler (e) {
      this.$emit('click', e)
      if (this.back) {
        this.backHandler()
      }
    },
    backHandler () {
      if (window.history.length >= 2) {
        window.history.go(-1)
      } else {
        if (window.wx) {
          wxConf.closeWindow()
        } else {
          window.close()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.btn{
  -webkit-appearance: none;
  border-radius: 25px;
  text-align: center;
  width:p2r(500);
  display: inline-block;
  padding:p2r(30) 0;
  line-height: 1;
  outline: none;
  border: none;
  font-size: p2r(30);
  &.default{
    background:$btn-disable-color;
    color:$text-color;
  }
  &.disabled{
    background:$thr-color !important;
    color:$btn-disable-color !important;
    border-color:$thr-color !important;
  }
  &.base{
    border:1px solid $primary-color;
    background:#fff;
    color:$primary-color;
  }
  &.primary{
    background:$primary-color;
    color:#fff;
    font-size: p2r(36);
  }
  &.lar{
    width:p2r(590);
    display: block;
    margin-left:auto;
    margin-right: auto;
  }
}
</style>
