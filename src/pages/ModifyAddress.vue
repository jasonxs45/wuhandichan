<template>
  <div class="modify">
    <div class="modify-wrapper">
      <flexbox class="border area">
        <flexbox-item class="fh">
          所在地区
        </flexbox-item>
        <flexbox-item class="fb">
          <area-picker
            border
            class="area-pick"
            @selected="getArea"
          ></area-picker>
          <Icon name="arrow-right1"/>
        </flexbox-item>
      </flexbox>
      <flexbox class="border">
        <flexbox-item class="fh">
          详细地址
        </flexbox-item>
        <flexbox-item class="fb">
          <input
            v-model="desc"
            type="text"
            placeholder="街道、楼牌号等"
            class="input"
          />
        </flexbox-item>
      </flexbox>
    </div>
    <Btn
      type="primary"
      size="lar"
      text="确认修改"
      class="submit"
      @click="submitHandler"
    />
  </div>
</template>
<script>
import {
  AreaPicker,
  Flexbox,
  FlexboxItem,
  Icon,
  Btn
} from 'components'
import api from 'common/api'
export default {
  name: 'Modify',
  components: {
    AreaPicker,
    Flexbox,
    FlexboxItem,
    Icon,
    Btn
  },
  data () {
    return {
      name: '',
      tel: '',
      area: '',
      desc: ''
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getArea (val) {
      this.area = val
    },
    getInfo () {
      api.modify.get()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.name = res.data.Data.Name
          this.tel = res.data.Data.Tel
          // this.name = res.data.Data.Name
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitHandler () {
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.modify{
  width: 100vw;
  height: 100vh;
  .modify-wrapper{
    min-height: 100%;
    padding: p2r($base-padding) p2r($base-padding) p2r(180);
    .border{
      margin:p2r(30) 0;
      position: relative;
      @include _1px();
      &:first-child{
        margin-top: 0;
      }
      &.area{
        .iconfont{
          position: absolute;
          right:0;
          top:0;
          height: p2r(90);
          line-height: p2r(90);
          font-size: p2r(24);
          color: $thr-color;
        }
      }
      .fh{
        flex: 0 0 p2r(120);
        width: p2r(120);
        font-size: p2r(28);
        font-weight: 200;
        color: $text-sub-color;
        height: p2r(90);
        line-height: p2r(90);
      }
      .fb{
        .input{
          display: block;
          width:100%;
          height: 100%;
          padding:0 p2r(30);
          font-size: p2r(28);
          background: none;
          -webkit-appearance: none;
          outline: none;
          color:$text-color;
          &::-webkit-input-placeholder{
            color:lighten($text-sub-color, 20%);
            font-weight: 200;
          }
        }
      }
    }
    .x-input{
      margin: p2r(30) 0 0;
      height: p2r(90);
      line-height: p2r(90);
      border-radius: 0;
      background: none;
      border:none;
      color: $text-color;
      @include _1px();
      &:first-child{
        margin-top: 0;
      }
      &.block{
        display: block;
      }
    }
  }
  .submit{
    position: relative;
    margin-top: p2r(-150);
  }
}
</style>
