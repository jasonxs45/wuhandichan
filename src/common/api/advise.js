import api from './index'
const ROLE = {
  // 用户
  user: 'SuggestGetMyHistory',
  // 管理员
  manager: 'SuggestGetMyManage'
}
let advise = {
  list (role, state, page = 1, pagesize = 10, type = '') {
    let opt = {
      Act: ROLE[role],
      Data: JSON.stringify({
        type,
        state,
        pagesize,
        page
      })
    }
    return api.globalQuery(opt)
  },
  // 提交
  submit (Type, HouseID, Content, Images) {
    let opt = {
      Act: 'SuggestSave',
      Data: JSON.stringify({
        Type,
        HouseID,
        Content,
        Images
      })
    }
    return api.globalQuery(opt)
  },
  // 获取详情
  detail (ID) {
    let opt = {
      Act: 'SuggestGetInfo',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  },
  // 管理员受理
  accept (ID) {
    let opt = {
      Act: 'SuggestAccept',
      Data: JSON.stringify({
        ID
      })
    }
    return api.globalQuery(opt)
  },
  manager: {
    getKf (id) {
      let opt = {
        'Act': 'SuggestGetAdmin',
        Data: JSON.stringify({
          ID: id
        })
      }
      return api.globalQuery(opt)
    },
    submitKf (ID, AdminID) {
      let opt = {
        Act: 'SuggestAllot',
        Data: JSON.stringify({
          ID,
          AdminID
        })
      }
      return api.globalQuery(opt)
    },
    getJudge (PID = 0) {
      let opt = {
        'Act': 'SuggestGetNature',
        Data: JSON.stringify({
          PID
        })
      }
      return api.globalQuery(opt)
    },
    submitJudge (SuggestID, Content, ImageList, Nature) {
      let opt = {
        Act: 'SuggestDeal',
        Data: JSON.stringify({
          SuggestID,
          Content,
          ImageList,
          Nature
        })
      }
      return api.globalQuery(opt)
    }
  }
}
export default advise
