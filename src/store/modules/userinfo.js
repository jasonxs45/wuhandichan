import types from '../mutation-types'
import api from 'common/api'
const state = {
  avatar: '',
  nickname: '',
  state: null,
  house: null,
  managerType: null,
  isRepairEngineer: false,
  isRepairEngineerManager: false,
  isRepairManager: false,
  markMap: [
    '未注册',
    '未绑定',
    '租户',
    '家属',
    '业主',
    '二手业主'
  ]
}
// getters
const getters = {
}

// actions
const actions = {
  getInfoAsync ({ state, commit }) {
    api.getWeixinInfo()
    .then(res => {
      if (res.data.IsSuccess) {
        commit(types.USER_INFO, res.data.Data)
      } else {
        window.$alert(res.data.Message)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
// mutations
const mutations = {
  [types.USER_INFO] (state, res) {
    state.avatar = res.HeadImgUrl
    state.nickname = res.NickName
    state.state = res.Identity
    state.managerType = res.SuggestAdminType
    state.house = res.Identity === 0 ? '尚未绑定房源信息' : `房源数量：${res.HouseCount}`
    state.isRepairEngineer = res.IsRepairEngineer
    state.isRepairEngineerManager = res.IsRepairEngineerManager
    state.isRepairManager = res.IsRepairManager
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
