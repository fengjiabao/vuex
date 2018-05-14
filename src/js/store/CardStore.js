import { toJson } from '../utils/utils.js'
import { CARD } from '../def/state.js'
import {addName, processDetail} from '../utils/cardStoreDep.js'
import {OD} from '../def/odef.js'
import cardStateDef from '../def/card_state_def.js'

export default {
  namespaced: true,
  state: {
    vcards: new Map(),
    scards: new Map(),
    nosignalscars: new Map(),
    uncovercards: new Map(),
    vstate: {sum: 0},
    sstate: {sum: 0},
    overview: {},
    averageUpdateDuration: 1000,
    lastUpdateTime: 0,
    stat: null,
    stateDefs: cardStateDef,
    infoDefs: null,
    infos: new Map()
  },
  mutations: {
    updateRefreshDuration (state) {
      let inow = window.performance.now()
      if (state.lastUpdateTime > 0) {
        state.averageUpdateDuration = inow - state.lastUpdateTime
      }
      state.lastUpdateTime = inow
    },
    processStat (state, data, type) {
      let stat = null

      if (data) {
        if (this.state.user.deptID === 0) {
          stat = data.glbl
        } else if (data.dept) {
          stat = data.dept[this.state.user.deptID]
        }
      }

      data.type === 'vehicle' ? state.vstate = stat : state.sstate = stat
    },
    getState (state, msg) {
      let cardType = msg.cardType
      let statType = msg.statType
      let data = null
      switch (cardType) {
        case OD.VEHICLE:
          data = state.vstate
          break
        case OD.STAFF:
          data = state.sstate
          break
        default:
          console.log('UNKNOWN cardType: ', cardType)
          return
      }
      state.stat = data && data[statType]
      state.stat = addName(state.stat, statType, xdata)
    },
    initInfoDefs (state, msg) {
      state.infoDefs = msg
    },
    cardInfoUpdate (state, msg) {
      if (msg !== undefined) {
        state.infos[msg.type] = msg.data
      }
    }
  },
  actions: {
    cardUpdatePos ({ state, dispatch, commit }, data) {
      dispatch('cardMove', data)
      commit('updateRefreshDuration')
    },
    cardMove ({ dispatch }, data) {
      if (!data) return
      data = toJson(data)
      dispatch('processVehicleData', data.v)
      dispatch('processStaffData', data.s)
    },
    processVehicleData ({ state, dispatch, commit }, data) {
      if (!data) {
        return
      }
      data.stat.type = 'vehicle'
      commit('processStat', data.stat)
      state.overview.vehicle = state.vstate ? state.vstate.sum : 0
      // state.vcards = dispatch('processDetail', data.detail)
      state.vcards = processDetail(xdata, data.detail)
    },
    processStaffData ({ state, dispatch, commit }, data) {
      if (!data) return
      data.stat.type = 'staff'
      commit('processStat', data.stat)
      state.overview.staff = state.sstate ? state.sstate.sum : 0

      // state.scards = dispatch('processDetail', data.detail)
      state.scards = processDetail(xdata, data.detail)
    },
    processDetail ({ state, dispatch }, data) {
      let xmap = new Map()
      if (data) {
        for (let i = 0, len = data.length; i < len; i++) {
          let card = data[i]
          let cardID = card[CARD.card_id]
          card = addFields(this.state.metaStore, {cardID: cardID, card: card})

          if (this.state.user.deptID === 0 || card[CARD.dept_id] === this.state.user.deptID) { // 全局 或 对应部门的详情
            xmap.set(cardID, card)
            dispatch('showCard', {
              cardID: cardID,
              card: card
            })
          }
        }
      }

      return xmap
    },
    showCard ({ dispatch }, data) {
      let card = data.card
      let cmd = getCmdByState(xdata, data)
      this.dispatch('olMapCardLayer/informMapUpdateCard', {
        cmd: cmd,
        card: card
      })
    }
  }
}
