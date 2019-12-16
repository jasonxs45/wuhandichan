import api from './index'
let investigate = {
  // 项目列表
  plist ({ Type, QuestionID }) {
    let opt = {
      Act: 'GetUserProjectList',
      Data: JSON.stringify({
        Type,
        QuestionID
      })
    }
    return api.globalQuery(opt)
  },
  slist (id) {
    let opt = {
      Act: 'StageGetList',
      Data: JSON.stringify({
        S_ProjectID: id
      })
    }
    return api.globalQuery(opt)
  },
  // 问卷列表
  invesList () {
    let opt = {
      Act: 'ResearchUserGetList',
      Data: JSON.stringify({})
    }
    return api.globalQuery(opt)
  },
  // 获取问卷调查内容
  list (id) {
    let opt = {
      Act: 'ResearchGetInfo',
      Data: JSON.stringify({
        ID: id
      })
    }
    return api.globalQuery(opt)
  },
  getAnswer ({ ID }) {
    let opt = {
      Act: 'GetMyAnswer',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  },
  // 提交问卷调查内容
  save ({ Answer, JoinInfo }) {
    let opt = {
      Act: 'ResearchSaveAnswer',
      Data: JSON.stringify({
        Answer,
        JoinInfo
      })
    }
    return api.globalQuery(opt)
  },
  managerlist () {
    let opt = {
      Act: 'ResearchGetCheck'
    }
    return api.globalQuery(opt)
  },
  pass (res, id) {
    let opt = {
      Act: 'ResearchCheck',
      Data: JSON.stringify({
        ID: id,
        IsCheck: res
      })
    }
    return api.globalQuery(opt)
  }
}
export default investigate
