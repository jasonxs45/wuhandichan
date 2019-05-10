<template>
  <div v-if="item" class="advise-detail" :class="item.State === 2 || (role === '物业客服' && !item.IsMyManage) ? '' : 'manager'">
    <div class="wrapper">
      <div
        class="title"
        :class="item.Type === '表扬' ? 'praise' : item.Type === '投诉' ? 'complain' : 'suggest'"
      >
        {{item.AddTime}}
        <div class="tag">
          {{item.Type}}
        </div>
      </div>
      <flexbox class="userinfo">
        <flexbox-item class="avatar-wrapper">
          <Avatar :src="item.HeadImgUrl"/>
        </flexbox-item>
        <flexbox-item>
          <h3 class="info">
              <span class="name">{{item.Name}}</span>
              <span class="role">{{item.Role}}</span>
          </h3>
          <p class="house">{{item.StageName + ' ' + item.Building + ' - ' + item.Unit + '单元' + item.HouseNo}}</p>
        </flexbox-item>
      </flexbox>
      <div class="desc">
        {{item.Content}}
      </div>
      <div class="imgs">
        <Fitimg
          v-for="(item, index) in imgs"
          :key="'item-'+index"
          :src="item"
          alt=""
          @on-click="previewImg(item)"
        />
      </div>
      <Split type="line"/>
      <div
        v-if="item.State === 2"
        class="manager"
      >
        <p class="name">发起人：{{item.Name}}</p>
        <p class="tel">联系方式：<a :href="'tel:'+item.Tel">{{item.Tel}}</a></p>
        <p class="clearfix"></p>
        <p v-if="item.Record.Content" class="content">{{item.Record.Content}}</p>
        <img-row
          :group="replyImgs"
          :canUpload="false"
        >
          <img-cell
            v-for="(item, index) in replyImgs"
            :index="index"
            :canUpload="false"
            :del="false"
            :group="replyImgs"
            :key="'upimg-'+index"
          >
            <Fitimg :src="item"/>
          </img-cell>
        </img-row>
        <p class="time">发起时间：{{item.AddTime}}</p>
      </div>
    </div>
    <div class="btns">
      <flexbox class="double">
        <flexbox-item v-if="item.IsMyManage && role === '物业客服' && item.State === 1" class="fi"><Btn class="accept" size="lar" type="primary" text="指派" @click="toggleSend"/></flexbox-item>
        <flexbox-item v-if="item.State === 0 && role === '物业客服'" class="fi"><Btn class="accept" size="lar" type="primary" text="受理" @click="accept"/></flexbox-item>
        <flexbox-item v-if="item.IsMyManage && item.State === 1" class="fi"><Btn class="accept" size="lar" type="primary" text="处理" @click="toggleDeal"/></flexbox-item>
      </flexbox>
      <Btn class="back" size="lar" type="default" text="返回" @click="back"/>
    </div>
    <!-- 指派 -->
    <div class="slide-right">
      <transition name="fade">
        <div v-show="showSend" class="bg" @click="toggleSend"></div>
      </transition>
      <transition name="slide-in-right">
        <div v-show="showSend" class="send-wrapper">
          <div class="select-kf">
            <x-select
              v-model="selectedKf"
              placeholder="请选择客服"
            >
              <x-option
                v-for="(item, index) in kfArr"
                :key="'kf-'+index"
                :label="item.Name"
                :value="item.ID"
              >
              </x-option>
            </x-select>
          </div>
          <div class="btns">
            <Btn type="primary" text="提交" size="lar" @click="submitKf"/>
            <Btn type="default" text="取消" size="lar" @click="toggleSend"/>
          </div>
        </div>
      </transition>
    </div>
    <!-- 处理 -->
    <div class="slide-right">
      <transition name="fade">
        <div v-show="showDeal" class="bg" @click="toggleDeal"></div>
      </transition>
      <transition name="slide-in-right">
        <div v-show="showDeal" class="send-wrapper">
          <div class="select-kf">
            <x-select
              v-model="selectedJudge"
              placeholder="请选择问题定性"
              @change="getSubJudge"
            >
              <x-option
                v-for="(item, index) in judgeArr"
                :key="'kf-'+index"
                :label="item.Name"
                :value="item.ID"
              >
              </x-option>
            </x-select>
            <x-select
              v-if="judgeArr1.length > 0"
              v-model="selectedJudge1"
              placeholder="请选择问题定性"
            >
              <x-option
                v-for="(item, index) in judgeArr1"
                :key="'kf1-'+index"
                :label="item.Name"
                :value="item.ID"
              >
              </x-option>
            </x-select>
            <x-textarea v-model="coments" placeholder="请填写回复内容"></x-textarea>
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
          </div>
          <div class="btns">
            <Btn type="primary" text="提交" size="lar" @click="submitJudge"/>
            <Btn type="default" text="取消" size="lar" @click="toggleDeal"/>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import {
  XSelect,
  XOption,
  XTextarea,
  Split,
  Btn,
  Fitimg,
  Flexbox,
  ImgRow,
  ImgCell,
  FlexboxItem,
  Avatar
} from 'components'
import api from 'common/api'
import wxConf from 'common/utils/wxConf'
import {
  webRoot
} from 'common/data'
export default {
  name: 'AdviseDetail',
  components: {
    XSelect,
    XOption,
    XTextarea,
    Split,
    Btn,
    ImgRow,
    ImgCell,
    Fitimg,
    Flexbox,
    FlexboxItem,
    Avatar
  },
  data () {
    return {
      id: null,
      item: null,
      showSend: false,
      kfArr: [],
      selectedKf: '',
      showDeal: false,
      judgeArr: [],
      selectedJudge: '',
      judgeArr1: [],
      selectedJudge1: '',
      coments: '',
      uploadedImgs: []
    }
  },
  computed: {
    role () {
      return this.$store.state.userInfo.managerType
    },
    imgs () {
      let arr = []
      if (this.item.Images) {
        arr = this.item.Images.split(',')
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].includes('whdc.1juke.cn')) {
            arr[i] = webRoot === '' ? location.origin + arr[i] : webRoot + arr[i]
          }
        }
      }
      return arr
    },
    replyImgs () {
      let arr = []
      if (this.item.Record && this.item.Record.ImageList) {
        arr = this.item.Record.ImageList.split(',')
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].includes('whdc.1juke.cn')) {
            arr[i] = webRoot === '' ? location.origin + arr[i] : webRoot + arr[i]
          }
        }
      }
      return arr
    },
    judges () {
      return this.judgeArr1.length > 0 && this.selectedJudge1
              ? this.selectedJudge.label + (this.judgeArr1.length > 0 ? '-' + this.selectedJudge1.label : '')
              : this.selectedJudge.label
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      // this.role = to.params.role
      this.detail()
    }
  },
  created () {
    this.id = this.$route.params.id
    // this.role = this.$route.params.role
    this.detail()
  },
  methods: {
    detail () {
      if (this.id === 0 || this.id) {
        api.advise.detail(this.id)
        .then(({res, index}) => {
          if (res.data.IsSuccess) {
            this.item = res.data.Data
          } else {
            window.$alert(res.data.Message)
          }
        })
      } else {
        this.$router.push({
          name: 'pagenotfound'
        })
      }
    },
    previewImg (current) {
      let _self = this
      wxConf.previewImg({
        current,
        urls: _self.imgs
      })
    },
    back () {
      // console.log(this.type === '物业客服' ? 'untreated' : 'treated')
      this.$router.replace({
        name: 'advisemanager',
        params: {
          state: this.item.State === 0 ? 'untreated' : this.item.State === 1 ? 'treated' : 'finished'
        }
      })
      // if (window.history.length >= 2) {
      //   window.history.go(-1)
      // } else {
      //   if (window.wx) {
      //     wxConf.closeWindow()
      //   } else {
      //     window.close()
      //   }
      // }
    },
    // 受理
    accept () {
      let _self = this
      api.advise.accept(this.id)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '受理成功',
            yes () {
              window.$close(index)
              _self.$router.push({
                name: 'advisemanager',
                params: {
                  state: 'treated'
                }
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      })
    },
    // 跳转处理
    toggleSend () {
      this.showSend = !this.showSend
      if (this.showSend) {
        this.getKf()
      }
    },
    // 请求客服列表
    getKf () {
      api.advise.manager.getKf()
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.kfArr = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      })
    },
    submitKf () {
      let _self = this
      if (!this.selectedKf) {
        window.$alert('请分配客服再提交')
        return
      }
      api.advise.manager.submitKf(this.id, this.selectedKf.value)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '指派已提交',
            yes () {
              window.$close(index)
              _self.showSend = false
              _self.$router.replace({
                name: 'advisemanager',
                params: {
                  state: _self.item.State === 0 ? 'untreated' : _self.item.State === 1 ? 'treated' : 'finished'
                }
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 跳转指派
    toggleDeal () {
      this.showDeal = !this.showDeal
      if (this.showDeal) {
        this.getJudge()
      }
    },
    getJudge (PID) {
      api.advise.manager.getJudge(PID)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.judgeArr = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      })
    },
    getSubJudge (e) {
      api.advise.manager.getJudge(e.value)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          this.judgeArr1 = res.data.Data
        } else {
          window.$alert(res.data.Message)
        }
      })
    },
    uploadImg (res) {
      this.uploadedImgs.push(res)
    },
    submitJudge () {
      let _self = this
      if (!this.selectedJudge) {
        window.$alert('请选择问题定性')
        return
      }
      if (this.judgeArr1.length > 0 && !this.selectedJudge1) {
        window.$alert('请选择问题定性')
        return
      }
      if (!this.coments) {
        window.$alert('请填写回复内容')
        return
      }
      let imgs = this.uploadedImgs.join(',')
      api.advise.manager.submitJudge(this.id, this.coments, imgs, this.judges)
      .then(({res, index}) => {
        if (res.data.IsSuccess) {
          let index = window.$alert({
            content: '处理已提交',
            yes () {
              window.$close(index)
              _self.showDeal = false
              _self.$router.replace({
                name: 'advisemanager',
                params: {
                  state: _self.item.State === 0 ? 'untreated' : _self.item.State === 1 ? 'treated' : 'finished'
                }
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~common/scss/variables.scss";
@import "~common/scss/mixins.scss";
.advise-detail{
  width:100vw;
  height: 100vh;
  background: $background-color;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &.manager{
    .wrapper{
      padding-bottom: p2r(300);
    }
    .btns{
      margin-top: p2r(-300);
    }
  }
  .wrapper{
    width:100%;
    min-height: 100%;
    padding-bottom: p2r(330);
    .title{
      padding: p2r(20) p2r(30);
      color:#fff;
      font-weight: 200;
      &.praise{
        background: $success-color;
      }
      &.complain{
        background: $error-color;
      }
      &.suggest{
        background: $link-color;
      }
      .tag{
        float: right;
      }
    }
    .userinfo{
      background: #fff;
      padding: p2r($base-padding);
      .avatar-wrapper{
        flex: 0 0 p2r(120);
        width: p2r(120);
        margin-right: p2r(30);
      }
      .info{
        font-size: 0;
        margin-top: p2r(20);
        .name{
          font-size: p2r(36);
          color:$text-color;
          font-weight: 600;
          display: inline-block;
          vertical-align: middle;
        }
        .role{
          font-size: p2r(20);
          display: inline-block;
          vertical-align: middle;
          background: $warning-color;
          color:#fff;
          min-width:p2r(60);
          height:p2r(32);
          line-height: p2r(32);
          text-align: center;
          border-radius: 20px;
          margin-left: p2r(20);
          font-weight: 200;
          padding:0 .2rem
        }
      }
      .house{
        margin-top: p2r(20);
        color: $thr-color;
        font-size: p2r(24);
      }
    }
    .desc{
      padding:p2r($base-padding);
      line-height: 1.5;
      background: #fff;
    }
    .imgs{
      background: #fff;
      padding: p2r($base-padding);
      .fit-img{
        width: 100%;
        height: p2r(400);
        border-radius: 4px;
        margin: p2r(20) 0;
        &:first-child{
          margin-top: 0;
        }
      }
    }
    .manager{
      padding:p2r($base-padding);
      background: #fff;
      .name{
        float: left;
        color: $text-sub-color;
      }
      .tel{
        float: right;
        color: $text-sub-color;
      }
      .time{
        margin-top: p2r(20);
        color:$thr-color;
        font-size: p2r(22);
      }
      .content{
        background: #f1f1f1;
        padding: p2r(20);
        font-size: p2r(24);
        margin:p2r(20) 0;
        border-radius: 4px;
      }
    }
  }
  .btns{
    position: relative;
    margin-top: p2r(-300);
    .double{
      width: p2r(640);
      margin: 0 auto;
      .fi{
        padding: 0 p2r(20)
      }
    }
    .btn{
      margin: p2r(20) auto;
      font-size: p2r(30);
      &.accept{
        width:100%;
      }
      &.back{
        background: #fff;
      }
    }
  }
}
.slide-right{
  .bg{
    position: fixed;
    width:100%;
    height: 100%;
    background: rgba(0,0,0,.6);
    top:0;
    left:0;
    z-index:999;
  }
  .send-wrapper{
    position: fixed;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    background: #fff;
    z-index: 1000;
    .select-kf{
      width: 100%;
      height: 100%;
      padding: p2r($base-padding) p2r($base-padding) p2r(350);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .x-select{
        // width: p2r(600);
        height: p2r(100);
        margin: p2r(30) auto;
        display: block;
        font-size: p2r(28);
      }
      .textarea-wrapper{
        font-size: p2r(28);
      }
      .tips{
        margin-top: p2r(50);
        font-size: p2r(28);
      }
    }
    .btns{
      position: absolute;
      width: 100%;
      bottom: p2r(30);
      background: #fff;
    }
  }
}
</style>
