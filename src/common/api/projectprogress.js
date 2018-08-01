import api from './index'
let projectprogress = {
  // 获取工程进度项目列表
  projectlist (keywords = '') {
    let opt = {
      Act: 'ProgressGetProjectList',
      Data: JSON.stringify({
        S_Title: keywords
      })
    }
    return api.globalQuery(opt)
  },
  // 获取工程进度月份列表
  monthlist (StageID) {
    let opt = {
      Act: 'GetProjectProgress',
      Data: JSON.stringify({
        StageID
      })
    }
    return api.globalQuery(opt)
  },
  // 获取工程进度月份详细
  detail (ID) {
    let opt = {
      Act: 'GetProgressDetail',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  }
}
export default projectprogress
