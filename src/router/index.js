import Vue from 'vue'
import Router from 'vue-router'
import pageRoutes from './pages'
import wxConf from 'common/utils/wxConf'
import MtaH5 from 'common/utils/mta'
Vue.use(Router)

let routes = pageRoutes

const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || '武汉地产控股客服'
  if (process.env.NODE_ENV === 'production') {
    wxConf.init(next)
  } else {
    next()
  }
})
router.afterEach((to, from) => {
  window.$closeAll()
  MtaH5.pgv()
})
export default router
