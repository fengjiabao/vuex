import Vue from 'vue'
import Vuex from 'vuex'
import user from './UserStore.js'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    user: user
  }
})
