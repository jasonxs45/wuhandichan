<template>
  <label
    :class="classes"
    @focusin="focusHandler"
    @focusout="blurHandler"
    @click="clickHandler"
  >
    <input
      :type="htmlType"
      :placeholder="placeholder"
      :readonly="readonly"
      :value="value"
      :disabled="disabled"
      :autofocus="autofocus"
      :maxlength="maxlength"
      :name="name"
      :required="required"
      ref="input"
      class="input"
      @change="changeHandler"
      @input="inputHandler"
      @blur='blurHandler'
    />
  </label>
</template>
<script>
const input = {
  props: {
    classType: {
      type: String,
      default: 'round-border'
    },
    disabled: {
      type: [String, Boolean]
    },
    htmlType: {
      type: String,
      default: 'text'
    },
    readonly: {
      type: [String, Boolean]
    },
    value: {
      type: String
    },
    placeholder: {
      type: String
    },
    autofocus: {
      type: String
    },
    maxlength: {
      type: String
    },
    name: {
      type: String,
      default () {
        return Math.random().toString(36).substr(2)
      }
    },
    required: {
      type: [String, Boolean]
    },
    checked: {
      type: [String, Boolean]
    }
  },
  methods: {
    focusHandler (e) {
      this.isFocus = true
      this.$emit('on-focus', e)
    },
    blurHandler (e) {
      this.isFocus = false
      this.$emit('on-blur', e)
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        document.activeElement.scrollIntoViewIfNeeded(true)
      }
    }
  }
}
export default {
  name: 'XInput',
  mixins: [input],
  data () {
    return {
      isFocus: false,
      inputVal: ''
    }
  },
  computed: {
    classes () {
      return [
        'x-input',
        this.classType
      ]
    }
  },
  methods: {
    changeHandler (e) {
      this.inputVal = e.target.value
      // this.$refs.input.value = e.target.value
      this.$emit('change', e.target.value)
    },
    inputHandler (e) {
      this.inputVal = e.target.value
      // this.$refs.input.value = e.target.value
      this.$emit('input', e.target ? e.target.value : e)
    },
    clickHandler (e) {
      this.$emit('click', e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.x-input{
  display: inline-block;
  width:inherit;
  height: inherit;
  position: relative;
  color:$text-color;
  font-size: p2r(28);
  &.round-border{
    border-radius: p2r(80);
    background: lighten($primary-color, 68%);
  }
  &.bottom-line{
    @include _1px(#ddd);
  }
  .input{
    display: block;
    width:100%;
    height: 100%;
    padding:0 p2r(30);
    font-size: inherit;
    background: none;
    -webkit-appearance: none;
    outline: none;
    color:inherit;
    &::-webkit-input-placeholder{
      color:lighten($text-color, 20%);
      font-weight: 200;
    }
  }
}
</style>
