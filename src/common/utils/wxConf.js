import axios from 'axios'
import wx from 'weixin-js-sdk'
import api from '../api'
import qs from 'qs'
import store from '@/store'
import { webRoot } from '../data'
// const comOpenId = 'gh_ba3ae28cdc9b'
let wxConf = {
  name: 'weixin-config',
  shareData: {
    title: '武汉地产客关平台',
    desc: '欢迎使用武汉地产客关平台！',
    link: '',
    imgUrl: `${webRoot}/whdcMicro/static/images/logo.png`
  },
  init (cb) {
    let ua = navigator.userAgent.toLowerCase()
    if (!(/micromessenger/i).test(ua)) {
      alert('请使用微信浏览器访问，否则部分功能可能无法使用！')
    }
    let _self = this
    api.getAuth().then((res) => {
      if (res.data.IsSuccess) {
        wx.config({
          debug: false,
          appId: res.data.Data.AppId,
          timestamp: res.data.Data.Timestamp,
          nonceStr: res.data.Data.NonceStr,
          signature: res.data.Data.Signature,
          jsApiList: this.apilist
        })
        if (!store.state.global.wxReady) {
          wx.ready(() => {
            store.state.global.wxReady = true
            wx.onMenuShareAppMessage(_self.shareData)
            wx.onMenuShareTimeline(_self.shareData)
            wx.onMenuShareQQ(_self.shareData)
            cb && cb()
          })
        } else {
          cb && cb()
        }
      } else {
        location.href = res.data.Data
      }
    }).catch((err) => {
      console.log(err)
    })
    // if (store.state.global.wxReady !== true) {
    // }
  },
  openMap (opt) {
    wx.openLocation(opt)
  },
  closeWindow () {
    wx.closeWindow()
  },
  previewImg ({current, urls}) {
    wx.previewImage({
      current,
      urls
    })
  },
  wxUpload (limit, a) {
    /* 图片组 */
    let images = {
      localId: [],
      serverId: []
    }
    /* 选择文件 */
    wx.chooseImage({
      count: limit,
      success (res) {
        images.localId = res.localIds
        uploadImage()
      }
    })

    /* 微信JSAPI 5.3 上传图片 */
    function uploadImage () {
      if (images.localId.length === 0) {
        alert('请选择图片')
        return
      }
      var i = 0
      var length = images.localId.length
      images.serverId = []
      /* 上载到微信服务器 */
      function upload () {
        wx.uploadImage({
          localId: images.localId[i],
          success (res) {
            i++
            if (i < length) {
              setTimeout(function () {
                upload()
              }, 100)
            }
            return downloadImage(i, res.serverId)
          },
          fail (res) {
            alert('上传失败' + JSON.stringify(res))
          }
        })
      }
      upload()
    }
    /* 从微信服务器下载图片 */
    function downloadImage (index, serverID) {
      return axios.post(
        webRoot + '/Mobile-wx_UploadImg', // 请求的url地址
        qs.stringify({
          serverID
        })
      )
      .then(res => {
        a(res.data)
      })
      .catch(err => {
        console.log(err)
      })
    }
  },
  apilist: [
    'checkJsApi',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'showAllNonBaseMenuItem',
    'translateVoice',
    'startRecord',
    'stopRecord',
    'onRecordEnd',
    'playVoice',
    'pauseVoice',
    'stopVoice',
    'uploadVoice',
    'downloadVoice',
    'chooseImage',
    'previewImage',
    'uploadImage',
    'downloadImage',
    'getNetworkType',
    'openLocation',
    'getLocation',
    'hideOptionMenu',
    'showOptionMenu',
    'closeWindow',
    'scanQRCode',
    'chooseWXPay',
    'openProductSpecificView',
    'addCard',
    'chooseCard',
    'openCard'
  ]
}
export default wxConf
