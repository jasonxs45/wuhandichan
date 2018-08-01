<template>
  <div class="advise-detail" :class="role === 'manager' && item.State < 1 ? 'manager' : ''">
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
      <flexbox v-if="role==='manager'" class="userinfo">
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
        v-if="role === 'user' && item.State === 1"
        class="manager"
      >
        <p v-if="item.AdminName" class="name">受理人：{{item.AdminName}}</p>
        <p v-if="item.AdminTel" class="tel">联系方式：<a :href="'tel:'+item.AdminTel">{{item.AdminTel}}</a></p>
        <p class="clearfix"></p>
        <p class="time">受理时间：{{item.AcceptTime}}</p>
      </div>
      <div
        v-if="role === 'manager' && item.State === 1"
        class="manager"
      >
        <p class="name">发起人：{{item.Name}}</p>
        <p class="tel">联系方式：<a :href="'tel:'+item.Tel">{{item.Tel}}</a></p>
        <p class="clearfix"></p>
        <p class="time">发起时间：{{item.AddTime}}</p>
      </div>
      <div v-if="role === 'user' && item.Record && item.Record.State === 1" class="manager">
        <p class="name">处理人：{{item.Record.AdminName}}</p>
        <p class="tel">联系方式：<a :href="'tel:'+item.Record.AdminTel">{{item.Record.AdminTel}}</a></p>
        <p class="clearfix"></p>
        <p class="content">{{item.Record.Content}}</p>
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
        <p class="time">处理时间：{{item.Record.DealTime}}</p>
      </div>
    </div>
    <div class="btns">
      <Btn v-if="role === 'manager' && item.State < 1" class="accept" size="lar" type="primary" text="受理" @click="accept"/>
      <Btn class="back" size="lar" type="default" text="返回" @click="back"/>
    </div>
  </div>
</template>
<script>
import {
  Split,
  Btn,
  Fitimg,
  Flexbox,
  FlexboxItem,
  Avatar,
  ImgRow,
  ImgCell
} from 'components'
import api from 'common/api'
import wxConf from 'common/utils/wxConf'
import {
  webRoot
} from 'common/data'
export default {
  name: 'AdviseDetail',
  components: {
    Split,
    Btn,
    Fitimg,
    Flexbox,
    FlexboxItem,
    Avatar,
    ImgRow,
    ImgCell
  },
  data () {
    return {
      id: null,
      role: null,
      item: {}
    }
  },
  computed: {
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
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = to.params.id
      this.role = to.params.role
      this.detail()
    }
  },
  created () {
    this.id = this.$route.params.id
    this.role = this.$route.params.role
    this.detail()
  },
  methods: {
    detail () {
      if (this.role === 'user' || this.role === 'manager') {
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
      this.$router.replace({
        name: 'adviseuser',
        params: {
          state: 'untreated'
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
                  state: 'finished'
                }
              })
            }
          })
        } else {
          window.$alert(res.data.Message)
        }
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
      padding-bottom: p2r(260);
    }
    .btns{
      margin-top: p2r(-260);
    }
  }
  .wrapper{
    width:100%;
    min-height: 100%;
    padding-bottom: p2r(180);
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
    margin-top: p2r(-180);
    .btn{
      margin: p2r(30) auto;
    }
  }
}
</style>
