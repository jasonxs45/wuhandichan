// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import layer from 'common/utils/layer'
import 'common/scss/layer.scss'
((w) => {
  w.$simplealert = opts => {
    opts = Object.assign({
      shadeClose: false,
      btn: ''
    }, opts)
    return layer.open(opts)
  }
  w.$toast = msg => {
    return layer.open({
      content: msg,
      skin: 'msg',
      time: 2
    })
  }
  w.$loading = text => {
    return layer.open({
      type: 2,
      content: `<p class="loadtext">${text}</p>`,
      shadeClose: false
    })
  }
  w.$alert = opt => {
    if (typeof opt === 'string') {
      let opts = {
        shadeClose: false,
        btn: '确定',
        content: opt
      }
      return layer.open(opts)
    }
    if (typeof opt === 'object') {
      let opts = {
        shadeClose: false,
        content: '',
        btn: '确定'
      }
      opts = Object.assign(opts, opt)
      return layer.open(opts)
    }
  }
  w.$confirm = opts => {
    opts = Object.assign({
      shadeClose: false,
      content: '',
      btn: ['确定', '取消'],
      yes: index => {
        layer.close(index)
      }
    }, opts)
    let index = layer.open(opts)
    return index
  }
  w.$close = index => {
    layer.close(index)
  }
  w.$closeAll = layer.closeAll
})(window)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
