import api from './index'
let onlineservice = {
  // 获取活动列表
  list () {
    let opt = {
      Act: 'ServiceGetList'
    }
    return api.globalQuery(opt)
  }
}
export default onlineservice
