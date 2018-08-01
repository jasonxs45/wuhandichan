<template>
  <div class="avatar">
    <Fitimg
      :src="src"
      class="img"
      alt=""
    />
  </div>
</template>
<script>
import Fitimg from 'components/fitimg'
export default {
  name: 'Avatar',
  components: {
    Fitimg
  },
  props: {
    src: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
  .avatar{
    width:p2r(120);
    height: p2r(120);
    border-radius: 50%;
    background: $primary-color;
    overflow: hidden;
    border:1px solid #fff;
  }
</style>
