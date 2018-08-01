<template>
  <div class="repair-order-allot">
    <div class="fake-select" @click="togglePartsPicker">
      <x-input :value="value" placeholder="请选择专业分类" @on-focus="focusHandler"></x-input>
      <Icon name="caret-down" />
    </div>
    <x-select v-model="selectedServer" placeholder="请选择施工单位" class="server">
      <x-option
        v-for="(item, index) in servers"
        :key="'server-'+index"
        :label="item.Name"
        :value="item.ID"
      ></x-option>
    </x-select>
    <x-textarea v-model="desc" placeholder="请描述报修部位的具体情况"></x-textarea>
    <p class="tips">上传照片（最多四张）</p>
    <img-row
      :group="uploadedImgs"
      :canUpload="true"
      @on-upload="uploadImg"
    >
      <img-cell
        v-for="(item, index) in uploadedImgs"
        :index="index"
        :canUpload="true"
        :del="true"
        :group="uploadedImgs"
        :key="'upimg-'+index"
      >
        <Fitimg :src="item"/>
      </img-cell>
    </img-row>
    <div class="btns">
      <Btn type="primary" size="lar" text="保存" @click="submitAllot"/>
      <Btn type="default" size="lar" text="返回" @click="back"/>
    </div>
    <div class="parts-picker">
      <transition name="fade">
        <div
          v-show="showPartsPicker"
          class="bg"
          @click="togglePartsPicker"
        ></div>
      </transition>
      <transition name="slide-up">
        <div
          v-show="showPartsPicker"
          class="parts-picker-wrapper"
        >
          <div class="header">
            <h4 class="title">选择分类</h4>
            <Icon name="close" @on-click="togglePartsPicker"/>
          </div>
          <div class="selected-area">
              <div
                v-for="(item, index) in tabs"
                :key="'tabnav-item-'+index+Math.random().toString(36).substr(2)"
                class="tab-item"
                :class="activeIndex === index ? 'active' : ''"
                @click="swipe(index)"
              >
              {{item}}
              </div>
          </div>
          <div class="scroll-area" ref="scrollArea">
            <swiper :options="swiperOption" ref="mySwiper" class="swiper" @slideChange="swipeChangeHandler">
              <!-- slides -->
              <swiper-slide
                v-for="(part, index1) in banners"
                :key="'banner-'+index1+Math.random().toString(36).substr(2)"
                :class="banners.length < 2 && index1 === 0 ? 'swiper-no-swiping' : ''"
              >
                <p
                  v-for="(item, index) in part"
                  :key="'parts-' + index + Math.random().toString(36).substr(2)"
                  class="items"
                >
                  <label
                    class="tag"
                  >
                    <input
                      type="radio"
                      :data-group="index1"
                      :data-time-limit="item.TimeLength"
                      :id="item.ID"
                      :value="item.Name"
                      :name="'radio-'+index1"
                      :checked="tabs[index1] === item.Name"
                      class="radio"
                      @change="radioChangeHandler"
                    />
                    <span class="text">
                      {{item.Name}}
                      <Icon name="checked"/>
                    </span>
                  </label>
                </p>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import {
  XInput,
  XSelect,
  XOption,
  XTextarea,
  Btn,
  Icon,
  ImgRow,
  ImgCell,
  Fitimg
} from 'components'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import api from 'common/api'
export default {
  name: 'RepairOrderAllot',
  components: {
    XInput,
    XSelect,
    XOption,
    XTextarea,
    Btn,
    Icon,
    swiper,
    swiperSlide,
    ImgRow,
    ImgCell,
    Fitimg
  },
  data () {
    return {
      repairId: '',
      choosing: false,
      banners: [],
      parts: [],
      servers: [],
      selectedServer: {
        value: '',
        label: ''
      },
      showPartsPicker: false,
      activeIndex: 0,
      tabs: [
        '请选择'
      ],
      typeId: '',
      timeLimit: '',
      desc: '',
      uploadedImgs: []
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    swiperOption () {
      return {
        effect: 'slide'
      }
    },
    value () {
      return this.tabs.filter(item => item !== '请选择').join('-')
    }
  },
  created () {
    this.repairId = this.$route.params.id
    this.getParts()
    this.getServers()
  },
  methods: {
    getParts () {
      api.repair.engineer.parts()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.parts = this.parts.concat(res.data.Data)
          this.banners.push(this.parts)
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    getServers () {
      api.repair.engineer.servers()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.servers = this.servers.concat(res.data.Data)
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    focusHandler (e) {
      e.target.blur()
    },
    back () {
      this.$router.go(-1)
    },
    togglePartsPicker () {
      this.showPartsPicker = !this.showPartsPicker
    },
    swipeChangeHandler () {
      this.activeIndex = this.swiper.activeIndex
    },
    radioChangeHandler (e) {
      let groupIndex = parseInt(e.currentTarget.dataset.group)
      this.timeLimit = e.currentTarget.dataset.timeLimit
      this.typeId = e.currentTarget.id
      let id = e.currentTarget.id - 1
      let value = e.currentTarget.value
      if (this.parts[id]) {
        if (this.banners[groupIndex + 1]) {
          if (this.parts[id].Sub.length !== 0) {
            this.banners.splice(
              groupIndex + 1,
              this.banners.length - 1 - groupIndex,
              this.parts[id].Sub
            )
            this.tabs.splice(
              groupIndex,
              this.tabs.length,
              value,
              '请选择'
            )
          }
        } else {
          if (this.parts[id].Sub.length !== 0) {
            this.banners.push(this.parts[id].Sub)
            this.tabs.splice(
              this.tabs.length - 1,
              0,
              value
            )
          }
        }
      } else {
        this.tabs.splice(
          this.tabs.length - 1,
          1,
          value
        )
        this.togglePartsPicker()
        // 派发事件
        this.$emit('selected', this.value)
        console.log(this.value)
      }
      this.$refs.scrollArea.scrollTop = 0
      this.$nextTick(() => {
        this.swiper.slideNext()
      })
    },
    swipe (index) {
      this.$refs.scrollArea.scrollTop = 0
      this.swiper.slideTo(index)
    },
    submitAllot () {
      let RepairID = this.repairId
      let TypeID = this.typeId
      let TypeName = this.value
      let TypeTimeLength = this.timeLimit
      let BuilderID = this.selectedServer.value
      let Desc = this.desc
      let Images = this.uploadedImgs.join(',')
      if (!TypeName) {
        window.$alert('请选择专业分类！')
        return
      }
      if (!BuilderID) {
        window.$alert('请选择施工单位！')
        return
      }
      if (!Desc) {
        window.$alert('请选择施工单位！')
        return
      }
      let _self = this
      api.repair.engineer.submitAllot(RepairID, TypeID, TypeName, TypeTimeLength, BuilderID, Desc, Images)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          window.$alert({
            content: '提交成功！',
            yes () {
              _self.$router.go(-1)
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    uploadImg (res) {
      this.uploadedImgs.push(res)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.repair-order-allot{
  min-height: 100vh;
  padding: p2r($base-padding) p2r($base-padding) p2r(300);
  position: relative;
  .fake-select,
  .server{
    width: 100%;
    margin: p2r(20) 0;
    height: p2r(100);
  }
  .textarea-wrapper{
    width: 100%;
    margin-top: p2r(20);
    border:none;
    font-size: p2r(28);
  }
  .tips{
    font-size: p2r(26);
    color: $primary-color;
    margin-top: p2r($base-padding);
  }
  .fake-select{
    position: relative;
    .iconfont{
      position: absolute;
      top: 50%;
      margin-top: -0.21333rem;
      right: 0.64rem;
      color: #f0836a;
      font-size: 0.42667rem;
      transform: rotate(-90deg);
      transition: transform .2s;
      vertical-align: middle;
    }
  }
  &>.btns{
    position: absolute;
    bottom: 0;
    left:0;
    width:100%;
    padding: p2r(30) 0;
    .btn{
      margin: p2r(30) auto;
      &:first-child{
        margin-top: 0;
      }
    }
  }
  .choose-parts{
    position: fixed;
    background: #fff;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    z-index: 1;
    &>.btns{
      position: absolute;
      bottom: 0;
      left:0;
      width:100%;
      padding: p2r(30) 0;
      .btn{
        margin: p2r(30) auto;
        &:first-child{
          margin-top: 0;
        }
      }
    }
  }
  .parts-picker{
    .bg{
      width:100%;
      height: 100%;
      position: fixed;
      top:0;
      left:0;
      background: rgba(0,0,0,.7);
      z-index: 999;
    }
    .parts-picker-wrapper{
      width: 100%;
      height: p2r(800);
      background: #fff;
      position: fixed;
      bottom:0;
      left:0;
      z-index: 1000;
      .header{
        .title{
          text-align: center;
          line-height: p2r(60);
          height: p2r(60);
          color: $text-sub-color;
        }
        .iconfont{
          display: inline-block;
          color: $thr-color;
          width: p2r(60);
          height: p2r(60);
          text-align: center;
          line-height: p2r(60);
          position: absolute;
          right: 0;
          top:0;
        }
      }
      .selected-area{
        height: p2r(60);
        line-height: p2r(60);
        @include _1px(#ddd);
        font-size: 0;
        .tab-item{
          display: inline-block;
          height: 100%;
          font-size: p2r(24);
          padding: 0 p2r(20);
          position: relative;
          &:after{
            content: '';
            display: block;
            height: 1px;
            position: absolute;
            width:80%;
            left: 10%;
            bottom: 0;
            background: none;
          }
          &.active{
            color: $primary-color;
            font-weight: 600;
            &:after{
              background:$primary-color;
            }
          }
        }
      }
      .scroll-area{
        width: 100%;
        height: calc(100% - 2.56rem);
        .swiper{
          height: 100%;
          .swiper-wrapper{
            height: 100%;
            .swiper-slide{
              width: 100%;
              height: 100%;
              overflow: auto;
              -webkit-overflow-scrolling: touch;
            }
          }
        }
        .items{
          .tag{
            display: inline-block;
            width: 100%;
            position: relative;
            .radio{
              position: absolute;
              width: 100%;
              height: 100%;
              top:0;
              left:0;
              display: block;
              opacity: 0;
              outline: none;
              border: none;
              &:checked + .text{
                color: $primary-color;
                .iconfont{
                  opacity: 1;
                }
              }
            }
            .text{
              display: block;
              margin:0 p2r(20);
              padding: p2r(20) 0;
              height: 100%;
              .iconfont{
                opacity: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
