import api from './index'
let magazine = {
  // 电子期刊列表
  list () {
    let opt = {
      Act: 'PeriodicalGetList',
      Data: JSON.stringify({})
    }
    return api.globalQuery(opt)
  },
  // 电子期刊列表内页
  inner (ID) {
    let opt = {
      Act: 'PeriodicalGetArticle',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  },
  // 电子期刊详细
  detail (ID) {
    let opt = {
      Act: 'PeriodicalGetArticleDetail',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  }
}
export default magazine
