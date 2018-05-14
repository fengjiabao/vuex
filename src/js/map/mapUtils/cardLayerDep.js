import {drawSymbol} from '../../utils/OlMapUtils.js'
import {CARD} from '../../def/state.js'
import { getCardBindObjectInfo } from '../../utils/metaStoreDep.js'
import {animate} from './animatorDep.js'

function drawCardOn (state, data) {
  let card = data.card
  let cardID = data.card[CARD.card_id]
  let cardTypeName = null
  if (/^001/.test(cardID)) {
    cardTypeName = 'staff'
  } else {
    cardTypeName = 'vehicle'
  }
  let cardBindObj = getCardBindObjectInfo(state.metaStore, cardID)

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
    feature = state.olMapCardLayer.staffLayerSource.getFeatureById(cardID)
  } else {
    feature = state.olMapCardLayer.vehicleLayerSource.getFeatureById(cardID)
  }
  return feature
}

// 其他页面切换到实时地图页面, 直接给点
function setCardCoord (cardID, group, card) {
  // let positionLay = this.map.getOverlayById('position' + cardID)
  // let cardTypeName = xdata.metaStore.getCardTypeName(cardID)
  // let lineTrack = this.vehicleLayerSource.getFeatureById(cardID + 'line') || this.staffLayerSource.getFeatureById(cardID + 'line')
  let x = card[CARD.x]
  let y = -card[CARD.y]
  let pos = [x, y]
  group && group.getGeometry() && group.getGeometry().setCoordinates(pos)
  // if (positionLay) {
  //   positionLay.setPosition(pos)
  // }
  // if (lineTrack) {
  //   if (cardTypeName === 'staff') {
  //     this.staffLayerSource.removeFeature(lineTrack)
  //   } else if (cardTypeName === 'vehicle') {
  //     this.vehicleLayerSource.removeFeature(lineTrack)
  //   }
  // }
  // xdata.trackStore.tracks.delete(cardID)
}

// 测试
function informMapUpdateCard (data) {
  if (!data) return
  // dispatch('drawcard', data)
  let cmd = data.cmd
  let card = data.card
  let xdata = data.xdata
  let cardID = card[CARD.card_id]
  let group = getFeature(xdata.state, card)
  let type = cmd === 'NOSIGNAL' ? 'nosignal' : null
  if (group) {
    // dispatch('cardAnimation', {
    //   cardID: cardID,
    //   group: group,
    //   card: card
    // })
    let duration = xdata.state.cardStore.averageUpdateDuration * 0.95
    animate({
      msg: group,
      x: card[CARD.x],
      y: card[CARD.y],
      duration: duration
    })
    setCardCoord(cardID, group, card)
  } else {
    group = drawCardOn(xdata.state, {
      card: card,
      className: 'card-add',
      type: type
    })
    xdata.commit('olMapCardLayer/setGroups', {
      cardID: cardID,
      group: group
    })
  }
  // switch (cmd) {
  //   case 'POSITION':
  //   case 'DOWNMINE':
  //   case 'NOSIGNAL': // 丢失信号时如果有坐标变化，也做移动处理，若此时状态还是进入盲区则推送数据问题
  //     if (group) {
  //       // dispatch('cardAnimation', {
  //       //   cardID: cardID,
  //       //   group: group,
  //       //   card: card
  //       // })
  //       let duration = xdata.state.cardStore.averageUpdateDuration * 0.95
  //       animate({
  //         msg: group,
  //         x: card[CARD.x],
  //         y: card[CARD.y],
  //         duration: duration
  //       })
  //       setCardCoord(cardID, group, card)
  //     } else {
  //       group = drawCardOn(xdata.state, {
  //         card: card,
  //         className: 'card-add',
  //         type: type
  //       })
  //       xdata.commit('olMapCardLayer/setGroups', {
  //         cardID: cardID,
  //         group: group
  //       })
  //     }
  //     break
  //       // case
  // }
}

export {drawCardOn, getFeature, setCardCoord, informMapUpdateCard}
