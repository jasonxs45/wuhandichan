import Vue from 'vue'
import Router from 'vue-router'
import pageRoutes from './pages'
import MtaH5 from 'common/utils/mta'
import wxConf from 'common/utils/wxConf'
Vue.use(Router)

let routes = pageRoutes
const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || '武汉地产控股客服'
  MtaH5.pgv()
  console.log('before-enter', to.path, from.path)
  let url = location.href
  wxConf.init(url, () => {
    next()
  })
})
router.afterEach((to, from) => {
  // window.$closeAll()
  console.log('after-enter', to.path, from.path)
})
router.onError(error => {
  console.log('router: ' + error.message)
  const pattern = /Loading chunk \d+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  console.log(isChunkLoadFailed, targetPath)
  if (isChunkLoadFailed) {
   router.replace(targetPath)
  }
})
export default router
