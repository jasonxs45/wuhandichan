import api from './index'
let activity = {
  // 获取活动列表
  list (type = 1) {
    let opt = {
      Act: 'ActivityGetList',
      Data: JSON.stringify({
        S_Class: type
      })
    }
    return api.globalQuery(opt)
  },
  // 获取活动详情
  detail (ID) {
    let opt = {
      Act: 'ActivityGetInfo',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  },
  // 活动报名
  apply (ActivityID, Conditions) {
    let opt = {
      Act: 'ActivityApply',
      Data: JSON.stringify({
        ActivityID,
        ...Conditions
      })
    }
    return api.globalQuery(opt)
  },
  qrcodeCheck (ID) {
    let opt = {
      Act: 'ActivitySignin',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  }
}
export default activity
