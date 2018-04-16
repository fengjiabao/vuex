import Vue from 'vue'
import Vuex from 'vuex'
import user from './UserStore.js'
import socketStore from './SocketStore.js'
import metaStore from './MetaStore.js'
import dexieDBStore from './DexieStore.js'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    user: user,
    metaStore: metaStore,
    socketStore: socketStore,
    dexieDBStore: dexieDBStore
  }
})
