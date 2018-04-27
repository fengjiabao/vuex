import { toJson } from '../utils/utils.js'
import { CARD } from '../def/state.js'
import { processDetail } from '../utils/cardStoreDep.js'

const UNCOVER = 1000
const SPECIAL = 1001
export default {
  namespaced: true,
  state: {
    vcards: new Map(),
    scards: new Map(),
    nosignalscars: new Map(),
    uncovercards: new Map(),
    vstate: null,
    sstate: null,
    overview: {},
    averageUpdateDuration: 1000,
    lastUpdateTime: 0
  },
  mutations: {
    updateRefreshDuration(state) {
      let inow = window.performance.now()
      if (state.lastUpdateTime > 0) {
        state.averageUpdateDuration = inow - state.lastUpdateTime
      }
      state.lastUpdateTime = inow
    },
    processStat(state, data, type) {
      let stat = null

      if (data) {
        if (this.state.user.deptID === 0) {
          stat = data.glbl
        } else if (data.dept) {
          stat = data.dept[this.state.user.deptID]
        }
      }

      data.type === 'vehicle' ? state.vstate = stat : state.sstate = stat
    }
  },
  actions: {
    cardUpdatePos({ state, dispatch, commit }, data) {
      dispatch('cardMove', data)
      commit('updateRefreshDuration')
    },
    cardMove({ dispatch }, data) {
      if (!data) return
      data = toJson(data)
      dispatch('processVehicleData', data.v)
      dispatch('processStaffData', data.s)
    },
    processVehicleData({ state, dispatch, commit }, data) {
      if (!data) {
        return
      }
      data.stat.type = 'vehicle'
      commit('processStat', data.stat)
      state.overview.vehicle = state.vstate ? state.vstate.sum : 0
      state.vcards = processDetail(state, data.detail)
    },
    processStaffData({ state, dispatch, commit }, data) {
      if (!data) return
      data.stat.type = 'staff'
      commit('processStat', data.stat)
      state.overview.staff = state.sstate ? state.sstate.sum : 0

      state.scards = processDetail(state, data.detail)
    },
    showCard({ dispatch }, data) {
      let card = data.card
      let cmd = getCmdByState(xdata, data)
      // this.dispatch('olMapCardLayer/informMapUpdateCard', {
      //   cmd: cmd,
      //   card: card
      // })
    }
  }
}
