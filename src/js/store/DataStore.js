import Vue from 'vue'
import Vuex from 'vuex'
import user from './UserStore.js'
import metaStore from './MetaStore.js'
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    user: user,
    metaStore: metaStore
  }
})
