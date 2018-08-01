import api from './index'
let investigate = {
  // 获取问卷调查内容
  list (ID) {
    let opt = {
      Act: 'ResearchGetInfo',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  },
  // 提交问卷调查内容
  save (Answer) {
    let opt = {
      Act: 'ResearchSaveAnswer',
      Data: JSON.stringify({
        Answer
      })
    }
    return api.globalQuery(opt)
  }
}
export default investigate
