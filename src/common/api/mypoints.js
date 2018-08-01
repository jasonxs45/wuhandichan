import api from './index'
let mypoints = {
  // 获取我的积分
  list () {
    let opt = {
      Act: 'ScoreGetMy'
    }
    return api.globalQuery(opt)
  }
}
export default mypoints
