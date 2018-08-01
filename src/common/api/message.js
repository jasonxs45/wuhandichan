import api from './index'
let message = {
  // 消息中心
  list () {
    let opt = {
      Act: 'GetMyMessage'
    }
    return api.globalQuery(opt)
  }
}
export default message
