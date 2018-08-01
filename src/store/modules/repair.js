//  投诉建议模块 用户身份 管理员身份
import types from '../mutation-types'
import api from 'common/api'
const state = {
  user: {
    untreated: {
      stateId: 0,
      orders: [],
      page: 0,
      lastPage: false
    },
    treated: {
      stateId: 1,
      orders: [],
      page: 0,
      lastPage: false
    },
    finished: {
      stateId: 2,
      orders: [],
      page: 0,
      lastPage: false
    }
  },
  engineer: {
    untreated: {
      stateId: 0,
      orders: [],
      page: 0,
      lastPage: false
    },
    treated: {
      stateId: 1,
      orders: [],
      page: 0,
      lastPage: false
    },
    finished: {
      stateId: 2,
      orders: [],
      page: 0,
      lastPage: false
    },
    canceled: {
      stateId: 3,
      orders: [],
      page: 0,
      lastPage: false
    }
  },
  engineermanager: {
    untreated: {
      stateId: 0,
      orders: [],
      page: 0,
      lastPage: false
    },
    timeout: {
      stateId: 1,
      orders: [],
      page: 0,
      lastPage: false
    }
  },
  manager: {
    untreated: {
      stateId: 0,
      orders: [],
      page: 0,
      lastPage: false
    }
  }
}
// getters
const getters = {
  user: state => state.user,
  engineer: state => state.engineer,
  engineermanager: state => state.engineermanager,
  manager: state => state.manager
}

// actions
const actions = {
  list ({commit, state}, {role, stateType}) {
    commit(types.REPAIR_NEXT, {role, stateType})
    api.repair.list(role, stateType, state[role][stateType].page)
    .then(({res, index}) => {
      if (res.data.IsSuccess) {
        commit(types.REPAIR_LIST,
          {
            res: res.data.Data,
            role,
            stateType
          }
        )
      } else {
        window.$alert(res.data.Message)
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
  destroyed ({commit}, role) {
    commit(types.REPAIR_DESTROY, role)
  }
}
// mutations
const mutations = {
  [types.REPAIR_LIST] (state, {res, role, stateType}) {
    let arr = res.repairList
    // 有数据才进行操作
    if (arr.length > 0) {
      state[role][stateType].orders = state[role][stateType].orders.concat(arr)
      state[role][stateType].lastPage = res.lastpage
    }
  },
  [types.REPAIR_NEXT] (state, {role, stateType}) {
    state[role][stateType].page += 1
  },
  [types.REPAIR_DESTROY] (state, role) {
    for (let n in state[role]) {
      state[role][n].orders = []
      state[role][n].page = 0
      state[role][n].lastpage = false
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
