import axios from 'axios'
import wx from 'weixin-js-sdk'
import api from '../api'
import qs from 'qs'
import { webRoot } from '../data'
import store from '@/store'
import router from '@/router'
// const comOpenId = 'gh_ba3ae28cdc9b'
// let wx = window.wx
let wxConf = {
  name: 'weixin-config',
  shareData: {
    title: '武汉地产客关平台',
    desc: '欢迎使用武汉地产客关平台！',
    link: location.href,
    imgUrl: `${webRoot}/whdcMicro/static/images/logo.png`
  },
  init (url, cb) {
    if (process.env.NODE_ENV === 'production') {
      let ua = navigator.userAgent.toLowerCase()
      if (!(/micromessenger/i).test(ua)) {
        alert('请使用微信浏览器访问，否则部分功能可能无法使用！')
      }
      let _self = this
      let index1 = window.$loading('登录中')
      api.getAuth(url).then(res => {
        if (res.data.IsSuccess) {
          console.log('已授权')
          wx.config({
            debug: false,
            appId: res.data.Data.AppId,
            timestamp: res.data.Data.Timestamp,
            nonceStr: res.data.Data.NonceStr,
            signature: res.data.Data.Signature,
            jsApiList: this.apilist
          })
          wx.ready(() => {
            wx.updateAppMessageShareData(_self.shareData)
            wx.updateTimelineShareData(_self.shareData)
            wx.onMenuShareAppMessage(_self.shareData)
            wx.onMenuShareTimeline(_self.shareData)
            wx.onMenuShareQQ(_self.shareData)
            console.log('微信ready完成')
            // let index1 = window.$loading('获取用户微信信息中')
            api.getWeixinInfo().then(r => {
                window.$close(index1)
                if (r.data.IsSuccess) {
                  if (r.data.Data.Identity === 0) {
                    let index = window.$alert({
                      content: '您还未注册会员，请先注册会员',
                      yes: () => {
                        window.$close(index)
                        router.replace('/regist')
                      }
                    })
                  }
                  store.commit('USER_INFO', r.data.Data)
                  console.log(r.data.Data)
                  cb && cb()
                } else {
                  window.$alert(r.data.Message)
                }
              }).catch(err => {
                window.$close(index1)
                console.log(err)
              })
          })
          wx.error(res => {
            alert(JSON.stringify(res))
            // alert('微信信息验证失败，请刷新页面或退出重进')
          })
        } else {
          console.log('未授权')
          sessionStorage.route = location.href.split('#')[1]
          location.href = res.data.Data
        }
      }).catch((err) => {
        console.log(err)
        alert('确认登录请求发送失败')
        window.$closeAll()
      })
    } else {
      cb && cb()
    }
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
            downloadImage(i, res.serverId)
            if (i < length) {
              setTimeout(function () {
                upload()
              }, 200)
            }
          },
          fail (res) {
            alert('上传失败' + JSON.stringify(res))
          }
        })
      }
      upload()
    }
    /* 从微信服务器下载图片 */
    function downloadImage (index, serverID, cb) {
      console.log(webRoot, serverID)
      return axios.post(
        webRoot + '/Mobile-wx_UploadImg', // 请求的url地址
        qs.stringify({
          serverID
        })
      )
      .then(res => {
        let url = webRoot + res.data
        console.log(url)
        a(url)
      })
      .catch(err => {
        console.log(err)
        alert('网络错误，请稍后再试')
      })
    }
  },
  apilist: [
    'checkJsApi',
    'updateAppMessageShareData',
    'updateTimelineShareData',
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
