import {toJson} from '../utils/utils.js'
import {CARD} from '../def/state.js'
export default {
  namespaced: true,
  state: {
    vcards: new Map(),
    scards: new Map(),
    vstate: null,
    overview: {},
    averageUpdateDuration: 1000,
    lastUpdateTime: 0
  },
  mutations: {
    updateRefreshDuration (state) {
      let inow = window.performance.now()
      if (state.lastUpdateTime > 0) {
        state.averageUpdateDuration = inow - state.lastUpdateTime
      }
      state.lastUpdateTime = inow
    }
  },
  actions: {
    cardUpdatePos ({state, dispatch, commit}, data) {
      dispatch('cardMove', data)
      commit('updateRefreshDuration')
    },
    cardMove ({dispatch}, data) {
      if (!data) return
      data = toJson(data)
      dispatch('processVehicleData', data.v)
    },
    async processVehicleData ({state, dispatch}, data) {
      if (!data) {
        return
      }
      state.vstate = await dispatch('processStat', data.state)
      state.overview.vehicle = state.vstate ? state.vstate.sum : 0
      state.vcards = await dispatch('processDetail', data.detail)
    },
    processStat ({state, dispatch}, data) {
      let stat = null

      if (data) {
        if (this.state.user.deptID === 0) {
          stat = data.glbl
        } else if (data.dept) {
          stat = data.dept[this.state.user.deptID]
        }
      }

      return stat
    },
    processDetail ({state, dispatch}, data) {
      let xmap = new Map()
      if (data) {
        for (let i = 0, len = data.length; i < len; i++) {
          let card = data[i]
          let cardID = card[CARD.card_id]
          dispatch('addFields', {
            cardID: cardID,
            card: card
          })

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
    addFields ({state, dispatch}, data) {
      let cardID = data.cardID
      let card = data.card
      let cardTypeID = -1
      let cardBindedObjectID = ''

      let cardTypeInfo = /^001/.test(cardID) ? {
        card_type_id: 1,
        detail: '人员',
        name: 'staff'
      } : {
        card_type_id: 2,
        detail: '车辆',
        name: 'vehicle'
      }

      if (cardTypeInfo) {
        cardTypeID = cardTypeInfo.card_type_id
        cardBindedObjectID = cardID
      } else {
        console.warn(`Can NOT find cardTypeInfo for ${cardID}`)
      }

      card && card.splice(1, 0, cardTypeID, cardBindedObjectID)
      return card
    },
    showCard ({dispatch}, data) {
      let cardID = data.cardID
      let card = data.card
      // console.log(card)
      this.dispatch('olMapCardLayer/informMapUpdateCard', {
        cmd: 'POSITION',
        card: card
      })
    }
  }
}
