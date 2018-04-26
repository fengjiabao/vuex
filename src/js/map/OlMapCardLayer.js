import ol from 'openlayers'
import {CARD} from '../def/state.js'
import {drawSymbol} from '../utils/OlMapUtils.js'
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
    initLayers (state) {
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
    }
  },
  actions: {
    informMapUpdateCard ({state, dispatch}, data) {
      if (!data) return
      dispatch('drawcard', data)
    },
    async drawcard ({state, dispatch}, data) {
      console.log(data)
      let cmd = data.cmd
      let card = data.card
      let cardID = card[CARD.card_id]
      let group = await dispatch('getFeature', card)
      let type = cmd === 'NOSIGNAL' ? 'nosignal' : null
      switch (cmd) {
        case 'POSITION':
        case 'DOWNMINE':
        case 'NOSIGNAL': // 丢失信号时如果有坐标变化，也做移动处理，若此时状态还是进入盲区则推送数据问题
          if (group) {
            dispatch('cardAnimation', {
              cardID: cardID,
              group: group,
              card: card
            })
          } else {
            group = await dispatch('drawCardOn', {
              card: card,
              className: 'card-add',
              type: type
            })
            state.groups.set(cardID, group)
          }
          break
        // case 
      }
    },
    getFeature ({state}, card) {
      let cardID = card[CARD.card_id]
      let feature = null
      if (/^001/.test(cardID)) {
        feature = state.staffLayerSource.getFeatureById(cardID)
      } else {
        feature = state.vehicleLayerSource.getFeatureById(cardID)
      }
      return feature
    },
    async drawCardOn ({state}, data) {
      let card = data.card
      let cardID = data.card[CARD.card_id]
      let cardTypeName = null
      if (/^001/.test(cardID)) {
        cardTypeName = 'staff'
      } else {
        cardTypeName = 'vehicle'
      }
      let cardBindObj = await this.dispatch('metaStore/getCardBindObjectInfo', cardID)
      // console.log(cardBindObj)

      let objectID = card[CARD.object_id]
      let attrs = {
        'card': card,
        'data-id': cardID,
        'data-number': objectID,
        'data-type': 'card',
        'data-subtype': cardTypeName,
        'card-speed': card[CARD.speed],
        // 'card_area': areaID,
        // 'card_occupation': occupationID,
        'card_state': card[CARD.state_object],
        x: card[CARD.x] ? card[CARD.x] : card.x,
        y: card[CARD.y] ? card[CARD.y] : card.y,
        // type: type,
        name: cardID
        // faceID: faceID
      }
      let layerSource = cardTypeName === 'vehicle' ? state.vehicleLayerSource : state.staffLayerSource
      let map = this.state.mapService.map
      return drawSymbol(attrs, layerSource, map)
    },
    cardAnimation ({state}, data) {
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
