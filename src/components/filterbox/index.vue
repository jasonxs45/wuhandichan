<template>
<div class="filterbox">
  <transition name="fade">
    <div v-if="showed" class="bg" @click="hide"></div>
  </transition>
  <transition name="slide-in-right">
    <div v-if="showed" class="filterbox-wrapper">
      <div class="container">
        <div class="filter-item">
          <p class="tit">楼栋</p>
          <input v-model="building" class="input" placeholder="请输入楼栋" type="text">
        </div>
        <div class="filter-item">
          <p class="tit">单元</p>
          <input v-model="unit" class="input" placeholder="请输入单元" type="text">
        </div>
        <div class="filter-item">
          <p class="tit">房号</p>
          <input v-model="houseno" class="input" placeholder="请输入房号" type="text">
        </div>
        <div class="filter-item">
          <p class="tit">姓名</p>
          <input v-model="name" class="input" placeholder="请输入姓名" type="text">
        </div>
      </div>
      <div class="bottom">
        <div class="btn cancel" @click="hide">关闭</div>
        <div class="btn reset" @click="reset">重置</div>
        <div class="btn confirm" @click="confirm">确定</div>
      </div>
    </div>
  </transition>
</div>
</template>
<script>
export default {
  name: 'FilterBox',
  props: {
    filterShow: {
      type: Boolean,
      default: true
    },
    initBuilding: String,
    initUnit: String,
    initHouseno: String,
    initName: String
  },
  data () {
    return {
      building: '',
      unit: '',
      houseno: '',
      name: '',
      showed: this.filterShow
    }
  },
  watch: {
    filterShow (newVal, oldVal) {
      this.showed = newVal
    }
  },
  created () {
    this.building = this.initBuilding
    this.unit = this.initUnit
    this.houseno = this.initHouseno
    this.name = this.initName
  },
  methods: {
    show () {
      this.showed = true
    },
    hide () {
      this.showed = false
      this.$emit('hide', this.showed)
    },
    confirm () {
      this.hide()
      this.$emit('confirm', {
        building: this.building,
        unit: this.unit,
        houseno: this.houseno,
        name: this.name
      })
    },
    reset () {
      this.building = ''
      this.unit = ''
      this.houseno = ''
      this.name = ''
      this.hide()
      this.$emit('confirm', {
        building: this.building,
        unit: this.unit,
        houseno: this.houseno,
        name: this.name
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.filterbox{
  .bg{
    position: fixed;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    z-index: 99;
    background: rgba(0,0,0,.8);
  }
  .filterbox-wrapper{
    position: fixed;
    width: 80%;
    height: 100%;
    background: #fff;
    z-index: 100;
    top:0;
    right: 0;
    .container{
      padding: p2r(30);
      height: 100%;
      padding-bottom: p2r(100);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .filter-item{
      &:first-child{
        .tit{
          margin-top: 0;
        }
      }
        .tit{
          font-size: p2r(28);
          margin-top: p2r(30);
          color:$primary-color;
        }
        .input{
          display: block;
          width: 100%;
          height: p2r(70);
          line-height: p2r(70);
          padding: 0 p2r(15);
          margin: p2r(20) 0;
          border-radius: 4px;
          border:1px solid #ddd;
          outline: none;
        }
      }
    }
    .bottom{
      width: 100%;
      box-shadow: 0 0 2px 0 rgba(0,0,0,.2);
      height: p2r(100);
      position: absolute;
      bottom: 0;
      font-size: 0;
      .btn{
        display: inline-block;
        width: 33.33%;
        font-size: p2r(28);
        line-height: p2r(100);
        text-align: center;
        &.cancel{
          background: #ccc !important;
        }
        &.confirm{
          background: $primary-color;
          color: #fff;
        }
      }
    }
  }
}
</style>
