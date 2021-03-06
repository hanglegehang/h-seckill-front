import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import VueCookie from 'vue-cookie'
import {userInfo} from './api'
import {
  Button,
  Pagination,
  Checkbox,
  Icon,
  Autocomplete,
  Loading,
  Message,
  Notification,
  Steps,
  Step,
  Table,
  TableColumn,
  Input,
  Dialog,
  Select,
  Option
} from 'element-ui'
import {getStore} from '/utils/storage'
import VueContentPlaceholders from 'vue-content-placeholders'
import pathToRegexp from 'path-to-regexp'

Vue.use(VueContentPlaceholders)
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Icon)
Vue.use(Autocomplete)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.use(infiniteScroll)
Vue.use(VueCookie)
Vue.use(VueLazyload, {
  // preLoad: 1.3,
  // error: 'dist/error.png',
  loading: '/static/images/load.gif'
  // attempt: 1
})
Vue.config.productionTip = false
const whiteList = ['/home', '/goods', '/login', '/register', '/goodsDetails/:id', '/thanks', '/search', '/refreshsearch', '/refreshgoods'] // 不需要登陆的页面
router.beforeEach(function (to, from, next) {
  let params = {
    params: {
      token: getStore('token')
    }
  }
  // next()
  userInfo(params).then(res => {
    if (res.code === 401) { // 没登录
      // debugger
      let flag = false
      for (let i = 0; i < whiteList.length; i++) {
        let re = pathToRegexp(whiteList[i])
        if (re.exec(to.path) !== null) {
          flag = true
          break
        }
      }
      if (flag) {
        next()
      } else {
        // next('/login')
        next({name: 'login', params: {fromPath: to.fullPath}})
      }

      // if (whiteList.indexOf(to.path) !== -1) { // 白名单
      //   next()
      // } else {
      //   next('/login')
      // }
    } else {
      console.log(res.data)
      store.commit('RECORD_USERINFO', {info: res.data})
      if (to.path === '/login') { //  跳转到
        next({path: '/'})
      }
      next()
    }
  })
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
