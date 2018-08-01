import api from './index'
let news = {
  // 获取新闻列表
  list () {
    let opt = {
      Act: 'NewsGetList',
      Data: JSON.stringify({
        S_ClassID: 1,
        S_IsCheck: true
      })
    }
    return api.globalQuery(opt)
  },
  // 获取新闻详细
  detail (ID) {
    let opt = {
      Act: 'NewsGetInfo',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  }
}
export default news
