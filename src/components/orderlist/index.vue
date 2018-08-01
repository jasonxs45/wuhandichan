<template>
  <div class="order-list-wrapper">
    <slot></slot>
    <!-- 查看更多 -->
    <getmore :canClick="showGetMore" @click="getMore"></getmore>
    <!-- 没有数据 -->
    <nodata v-if="dataArr.length <= 0">暂无数据</nodata>
  </div>
</template>
<script>
import Nodata from 'components/nodata'
import Getmore from 'components/getmore'
export default {
  name: 'OrderList',
  components: {
    Nodata,
    Getmore
  },
  props: {
    showGetMore: {
      type: Boolean
    },
    dataArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    getMore (e) {
      this.$emit('get-more', e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.order-list-wrapper {
  width: 100%;
  height: calc(100% - 6.8266666rem);
  padding: p2r($base-padding);
  background: $background-color;
  overflow: auto;
}
</style>
