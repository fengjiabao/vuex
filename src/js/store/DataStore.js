import Vue from 'vue'
import Vuex from 'vuex'
import user from './UserStore.js'
import socketStore from './SocketStore.js'
import metaStore from './MetaStore.js'
import dexieDBStore from './DexieStore.js'
import mapStore from './MapStore.js'
import mapService from '../service/mapService.js'
import cardStore from './CardStore.js'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    user: user,
    metaStore: metaStore,
    socketStore: socketStore,
    dexieDBStore: dexieDBStore,
    mapStore: mapStore,
    mapService: mapService,
    cardStore: cardStore
  }
})
