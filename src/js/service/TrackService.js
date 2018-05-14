import {getCardTypeName} from '../utils/metaStoreDep.js'
import {getLastState} from '../utils/cardStoreDep.js'
import {CARD} from '../def/state.js'
import ol from 'openlayers'
// 切换跟踪状态
window.trackToggle = (msg) => {
  toggleTracking(msg)
}

function toggleTracking (msg) {
  let trackStore = window.xdata.state.trackStore.tracks
  let cards = msg.cards
  for (let i = 0, len = cards.length; i < len; i++) {
    let cardID = cards[i]
    trackStore.has(cardID) ? stopTracking(cardID) : startTracking(cardID)
  }
}

function stopTracking (cardID) {
  let cardTypeName = getCardType(cardID)

  // line feature
  let lineFeatureID = cardID + 'line'
  let lfeature = getFeature(cardID, cardTypeName, lineFeatureID)

  removeFeature(cardID, cardTypeName, lfeature)
}

function getCardType (cardID) {
  let cardTypeName = getCardTypeName(cardID)
  if (!cardTypeName) {
    cardID = String(cardID)
    if (/^001/.test(cardID)) {
      cardTypeName = 'staff'
    } else if (/^002/.test(cardID)) {
      cardTypeName = 'vehicle'
    }
  }
  return cardTypeName
}

// 获取地图上的 feature 对象
function getFeature (cardID, cardTypeName, featureID) {
  let feature = null
  let layerSource = window.xdata.state.olMapCardLayer

  if (cardTypeName === 'vehicle') {
    feature = layerSource.vehicleLayerSource.getFeatureById(featureID)
  } else if (cardTypeName === 'staff') {
    feature = layerSource.staffLayerSource.getFeatureById(featureID)
  }

  return feature
}

// 从地图上删除 track feature
function removeFeature (cardID, cardTypeName, feature) {
  let layerSource = window.xdata.state.olMapCardLayer
  if (feature) {
    if (cardTypeName === 'vehicle') {
      layerSource.vehicleLayerSource && layerSource.vehicleLayerSource.getFeatureById(cardID + 'line') && layerSource.vehicleLayerSource.removeFeature(feature)
    } else if (cardTypeName === 'staff') {
      layerSource.staffLayerSource && layerSource.staffLayerSource.getFeatureById(cardID + 'line') && layerSource.staffLayerSource.removeFeature(feature)
    }
  }

  window.xdata.state.trackStore.tracks.delete(cardID)
}

function startTracking (cardID) {
  let cardTypeName = getCardType(cardID)

  // line feature
  let lineFeatureID = cardID + 'line'
  let lfeature = getFeature(cardID, cardTypeName, lineFeatureID)

  if (!lfeature) { // new track line
    // icon feature
    let iconFeatureID = cardID
    let ifeature = getFeature(cardID, cardTypeName, iconFeatureID)
    let coord = ifeature && ifeature.getGeometry().getCoordinates()
    if (!coord) {
      let card = getLastState(cardID)
      let x = Number(card[CARD.x])
      let y = -Number(card[CARD.y])
      coord = [x, y]
    }
    let posdata = [coord, coord] // 开始时两个点重合

    let trackFeature = new ol.Feature({
      geometry: new ol.geom.LineString(posdata)
    })
    trackFeature.setProperties({type: 'trackFeature'})
    trackFeature.setId(lineFeatureID)
    trackFeature.setStyle(new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 3,
        color: [255, 0, 0, 1]
      })
    }))

    addFeature(cardID, cardTypeName, trackFeature)
  }
}

// 往地图上增加 track feature
function addFeature (cardID, cardTypeName, feature) {
  let layerSource = window.xdata.state.olMapCardLayer
  if (cardTypeName === 'vehicle') {
    layerSource.vehicleLayerSource.addFeature(feature)
  } else if (cardTypeName === 'staff') {
    layerSource.staffLayerSource.addFeature(feature)
  }

  window.xdata.state.trackStore.tracks.set(cardID, true)
}

export default {toggleTracking}
