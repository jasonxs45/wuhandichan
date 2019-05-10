<template>
  <label class="textarea-wrapper">
    <textarea
      :placeholder="placeholder"
      :name="name"
      :value="value"
      :disabled="disabled"
      :readonly="readonly"
      @input="inputHandler"
      @change="changeHandler"
      @blur='blurHandler'
      class="textarea"
    >
    </textarea>
  </label>
</template>
<script>
export default {
  name: 'XTextarea',
  props: {
    placeholder: {
      type: String
    },
    name: {
      type: String
    },
    value: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    readonly: {
      type: Boolean
    }
  },
  methods: {
    changeHandler (e) {
      this.$emit('change', e.target.value)
    },
    inputHandler (e) {
      this.$emit('input', e.target ? e.target.value : e)
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
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.textarea-wrapper{
  border-radius: 4px;
  width:inherit;
  height: p2r(200);
  display: inline-block;
  background: lighten($primary-color, 68%);
  .textarea{
    padding:p2r(20);
    font-size: p2r(24);
    color:$text-color;
    border:none;
    outline: none;
    width:100%;
    height:100%;
    border-radius: inherit;
    text-align: inherit;
    font-size: inherit;
    line-height: inherit;
    font-family: inherit;
    min-height:inherit;
    color:inherit;
    resize: none;
    background: inherit;
    &::-webkit-input-placeholder{
      color:lighten($text-color, 20%);
      font-weight: 200;
    }
  }
}
</style>
