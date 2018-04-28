import ol from 'openlayers'
import { CARD } from '../def/state.js'
import { drawSymbol } from '../utils/OlMapUtils.js'
import { drawCardOn, getFeature } from './mapUtils/cardLayerDep.js'
export default {
  namespaced: true,
  state: {
    vehicleLayerSource: null,
    vehicleLayer: null,

    staffLayerSource: null,
    staffLayer: null,
    groups: new Map()
  },
  mutations: {
    initLayers(state) {
      state.vehicleLayerSource = new ol.source.Vector()
      state.vehicleLayer = new ol.layer.Vector({
        source: state.vehicleLayerSource,
        zIndex: 6
      })
      state.staffLayerSource = new ol.source.Vector()
      state.staffLayer = new ol.layer.Vector({
        source: state.staffLayerSource,
        zIndex: 6
      })
      this.state.mapService.map.addLayer(state.vehicleLayer)
      this.state.mapService.map.addLayer(state.staffLayer)
    },
    drawcard(state, data) {
      // console.log(data)
      let cmd = data.cmd
      let card = data.card
      let cardID = card[CARD.card_id]
      let group = getFeature(state, card)
      let type = cmd === 'NOSIGNAL' ? 'nosignal' : null
      switch (cmd) {
        case 'POSITION':
        case 'DOWNMINE':
        case 'NOSIGNAL': // 丢失信号时如果有坐标变化，也做移动处理，若此时状态还是进入盲区则推送数据问题
          if (group) {
            // dispatch('cardAnimation', {
            //   cardID: cardID,
            //   group: group,
            //   card: card
            // })
          } else {
            group = drawCardOn(this.state, {
              card: card,
              className: 'card-add',
              type: type
            })
            state.groups.set(cardID, group)
          }
          break
      }
    }
  },
  actions: {
    informMapUpdateCard({ state, dispatch,commit }, data) {
      if (!data) return
      commit('drawcard', data)
    },
    // async drawcard(state, data) {
    //   // console.log(data)
    //   let cmd = data.cmd
    //   let card = data.card
    //   let cardID = card[CARD.card_id]
    //   let group = getFeature(state, card)
    //   let type = cmd === 'NOSIGNAL' ? 'nosignal' : null
    //   switch (cmd) {
    //     case 'POSITION':
    //     case 'DOWNMINE':
    //     case 'NOSIGNAL': // 丢失信号时如果有坐标变化，也做移动处理，若此时状态还是进入盲区则推送数据问题
    //       if (group) {
    //         dispatch('cardAnimation', {
    //           cardID: cardID,
    //           group: group,
    //           card: card
    //         })
    //       } else {
    //         group = drawCardOn(state, {
    //           card: card,
    //           className: 'card-add',
    //           type: type
    //         })
    //         state.groups.set(cardID, group)
    //       }
    //       break
    //     // case 
    //   }
    // },
    cardAnimation({ state }, data) {
      let x = data.card[CARD.x]
      let y = -data.card[CARD.y]
      let duration = this.state.cardStore.averageUpdateDuration * 0.95
      this.dispatch('olMapAnimator/animate', {
        msg: data.group,
        x: x,
        y: -y,
        duration: duration
      })
    }
  }
}
