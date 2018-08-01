import types from '../mutation-types'
const state = {
  name: '',
  city: {
    ID: '',
    Value: '全部'
  }
}
// getters
const getters = {
}

// actions
const actions = {
}
// mutations
const mutations = {
  [types.GUIDE_CITY_NAME] (state, city) {
    state.city = city
  },
  [types.GUIDE_NAME] (state, name) {
    state.name = name
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
