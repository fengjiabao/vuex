import Vue from 'vue'
import Vuex from 'vuex'
import spell from './Py.js'
import user from './UserStore.js'
import socketStore from './SocketStore.js'
import metaStore from './MetaStore.js'
import dexieDBStore from './DexieStore.js'
import mapStore from './MapStore.js'
import mapService from '../service/mapService.js'
import cardStore from './CardStore.js'
import alarmStore from './AlarmStore.js'
import areaStore from './AreaStore.js'
import stateStore from './StateStore.js'

import olMapCardLayer from '../map/OlMapCardLayer.js'
import olMapAnimator from '../map/OlMapAnimator.js'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    spell: spell,
    user: user,
    metaStore: metaStore,
    socketStore: socketStore,
    dexieDBStore: dexieDBStore,
    mapStore: mapStore,
    mapService: mapService,
    cardStore: cardStore,
    alarmStore: alarmStore,
    areaStore: areaStore,
    stateStore: stateStore,
    olMapCardLayer: olMapCardLayer,
    olMapAnimator: olMapAnimator
  }
})
