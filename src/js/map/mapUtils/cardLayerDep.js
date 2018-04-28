import {drawSymbol} from '../../utils/OlMapUtils.js'
import {CARD} from '../../def/state.js'
import { getCardBindObjectInfo } from '../../utils/metaStoreDep.js'

function drawCardOn (state, data) {
    let card = data.card
    let cardID = data.card[CARD.card_id]
    let cardTypeName = null
    if (/^001/.test(cardID)) {
      cardTypeName = 'staff'
    } else {
      cardTypeName = 'vehicle'
    }
    let cardBindObj = getCardBindObjectInfo(state.metaStore,cardID)

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
    let layerSource = cardTypeName === 'vehicle' ? state.olMapCardLayer.vehicleLayerSource : state.olMapCardLayer.staffLayerSource
    let map = state.mapService.map
    return drawSymbol(attrs, layerSource, map)
  }

  function getFeature (state, card) {
    let cardID = card[CARD.card_id]
    let feature = null
    if (/^001/.test(cardID)) {
      feature = state.staffLayerSource.getFeatureById(cardID)
    } else {
      feature = state.vehicleLayerSource.getFeatureById(cardID)
    }
    return feature
  }

  export { drawCardOn, getFeature}