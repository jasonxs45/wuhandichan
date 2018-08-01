import api from './index'
let thirdserviceprogress = {
  // 获取购房进度
  list () {
    let opt = {
      Act: 'ThirdServiceProgress'
    }
    return api.globalQuery(opt)
  }
}
export default thirdserviceprogress
