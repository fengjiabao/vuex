// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import Login from './view/login'
import router from './router'
import Vuex from 'vuex'
import store from './js/store/DataStore.js'
import Transer from './js/Transer.js'
import Draggable from './js/utils/Draggable.js'
import toggleLocating from './js/service/locateService.js'
import toggleTracking from './js/service/TrackService.js'

// import Icon from 'vue-svg-icon/Icon.vue'
// import Icon from 'vue-svg-icon/Icon.vue'

Vue.config.productionTip = false
Vue.use(Vuex)
// Vue.use(Icon)
// Vue.component('icon', Icon)
window.xbus = new Vue()
/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  store,
  // components: { Login },
  // template: '<login/>'
  render: h => h(App)
}).$mount('#app')

function initBaseServices () {
  window.transer = new Transer('login')
  window.xdata = store
  window.xdata.dispatch('dexieDBStore/openLocalDB')
}

function initTools () {
  window.setDraggable = (msg) => {
    Draggable(msg.target, msg.handle)
  }
  // set dialog draggable
  window.setDialogDraggable = (root) => {
    let dragHandle = root.querySelector('.dlg-head')
    let dragTarget = root.querySelector('.dlg-window')
    Draggable(dragTarget, dragHandle)
  }

  window.toggleLocating = (msg) => {
    toggleLocating(msg)
  }

  window.toggleTracking = (msg) => {
    toggleTracking(msg)
  }
}

window.initApp = () => {
  initBaseServices()
  initTools()
}

window.initApp()
