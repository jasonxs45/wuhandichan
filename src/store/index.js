import Vue from 'vue'
import Vuex from 'vuex'
// 异步
import actions from './actions'
// 相当于是依据state的计算属性
import getters from './getters'
// 同步
import mutations from './mutations'
import modules from './modules'
Vue.use(Vuex)

let state = {
  global: {
    openid: '123asda',
    wxReady: false
  }
}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules,
  strict: debug
})
