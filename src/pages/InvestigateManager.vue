<template>
  <div class='investigate-manager-list'>
    <div v-for='(item, index) in list' :key='"item-" + index'>1</div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
export default {
  name: 'InvestigateManager',
  data () {
    return {
      list: [1, 2, 3]
    }
  }
}
</script>
