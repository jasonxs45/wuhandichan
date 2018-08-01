import axios from 'axios'
import qs from 'qs'
import regist from './regist'
import bind from './bind'
import myHouse from './myHouse'
import activity from './activity'
import news from './news'
import magazine from './magazine'
import projectprogress from './projectprogress'
import investigate from './investigate'
import tradeprogress from './tradeprogress'
import thirdserviceprogress from './thirdserviceprogress'
import message from './message'
import mypoints from './mypoints'
import modify from './modify'
import guide from './guide'
import advise from './advise'
import repair from './repair'
let openid = ''
const webRoot = 'http://whdc.1juke.cn'
const BASE_URL = '/Mobile-PostAPI'
const MOCK_URL = 'https://www.easy-mock.com/mock/5abd9851597f2f6d4d73ae18/mock/'
axios.defaults.retry = 4
axios.defaults.retryDelay = 1000
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(undefined, function axiosRetryInterceptor (err) {
  let config = err.config
  if (!config || !config.retry) return Promise.reject(err)
  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) {
      return Promise.reject(err)
  }
  config.__retryCount += 1
  let backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, config.retryDelay || 1)
  })
  return backoff.then(() => {
    return axios(config)
  })
})
let api = {
  webRoot,
  // 模拟数据
  mock (opt) {
    return axios.post(
      MOCK_URL + opt.Act,
      qs.stringify(opt)
    )
  },
  // 授权
  getAuth () {
    return axios.post('/Admin-GetAuthorize', {
      redirectUrl: location.href
    })
  },
  // 全局查询方法
  globalQuery (opt) {
    Object.assign(opt, { openid })
    let index = window.$loading('加载中')
    return axios.post(
      BASE_URL,
      qs.stringify(opt)
    ).then(res => {
      return new Promise((resolve, reject) => {
        if (res.status === 200) {
          window.$close(index)
          resolve({res, index})
        }
      })
    })
    .catch(err => {
      console.log(err)
      let index = window.$alert({
        content: `${err}<br/>网络错误，请稍候再试！`,
        yes () {
          window.$close(index)
          window.$closeAll()
        }
      })
    })
  },
  // 公用请求
  // 获取微信昵称头像等
  getWeixinInfo () {
    let opt = {
      Act: 'MemberCenterData'
    }
    return this.globalQuery(opt)
  },
  regist,
  bind,
  myHouse,
  activity,
  news,
  magazine,
  projectprogress,
  investigate,
  tradeprogress,
  message,
  mypoints,
  modify,
  guide,
  advise,
  repair,
  thirdserviceprogress
}
export default api
