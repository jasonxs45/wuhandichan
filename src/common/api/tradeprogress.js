import api from './index'
let tradeprogress = {
  // 获取购房进度
  list () {
    let opt = {
      Act: 'ProcessData'
    }
    return api.globalQuery(opt)
  }
}
export default tradeprogress
