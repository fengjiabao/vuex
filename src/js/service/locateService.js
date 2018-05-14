import {getLastState} from '../utils/cardStoreDep.js'
import {CARD} from '@/js/def/state.js'
import {ZOOM_LEVEL} from '@/js/def/map_def.js'
import ol from 'openlayers'

// 切换定位状态
window.triggerLocating = (msg) => {
  toggleLocating(msg)
}

// 进入定位状态
window.cardStartLocating = function (msg) {
  let cards = msg.cards
  for (let i = 0, len = cards.length; i < len; i++) {
    let cardID = cards[i]
    startLocating(cardID, msg.type)
  }
}

// 取消定位状态
window.cardStopLocating = (msg) => {
  let cards = msg.cards
  for (let i = 0, len = cards.length; i < len; i++) {
    let cardID = cards[i]
    stopLocating(cardID)
  }
}

function toggleLocating (msg) {
  let locateStore = window.xdata.state.locateStore
  let type = msg.type
  let cards = msg.cards
  for (let i = 0, len = cards.length; i < len; i++) {
    let cardID = cards[i]
    locateStore.locates.has(cardID) ? stopLocating(cardID) : startLocating(cardID, type)
  }
}

/**
 * 启动单张卡的定位
 * @param {*} cardID 卡号
 * @param {*} type 定位类型
 */
function startLocating (cardID, type) {
  let locateStore = window.xdata.state.locateStore
  let card = getLastState(cardID)
  if (!card) {
    console.warn('当前井下没有此卡: ', cardID)
    return
  }
  let x = card[CARD.x]
  let y = -card[CARD.y]
  if (!locateStore.locates.has(cardID)) {
    doLocating(cardID, type, x, y)
    locateStore.locates.set(cardID, true)
    if ((/^001/i).test(cardID)) {
      locateStore.localStaffs.set(cardID, true)
    } else if ((/^002/i).test(cardID)) {
      locateStore.localVehicle.set(cardID, true)
    }
  }
  panCenterTo(x, y)
}

function doLocating (cardID, type, x, y) {
  let map = window.xdata.state.mapService.map
  let div = document.createElement('div')
  let oclass = 'css_animation'
  if (type === 'ALARM' || type === 'HELP') {
    oclass = 'css_animation_alarm'
  }
  div.setAttribute('id', oclass)
  div.setAttribute('class', 'animation' + cardID)

  let pointOverlay = new ol.Overlay({
    element: div,
    positioning: 'center-center',
    id: 'position' + cardID,
    stopEvent: false
  })
  map.addOverlay(pointOverlay)
  pointOverlay.setPosition([x, y])
}

function panCenterTo (x, y) {
  let map = window.xdata.state.mapService.map
  let view = map.getView()

  view.animate({
    center: [x, y],
    duration: 1000,
    zoom: ZOOM_LEVEL.MIDDLE
  })
}

/**
   * 停止单张卡的定位
   * @param {*} cardID 卡号
   */
function stopLocating (cardID) {
  let map = window.xdata.state.mapService.map
  let position = map.getOverlayById('position' + cardID)
  position && map.removeOverlay(position)

  let locateStore = window.xdata.state.locateStore
  locateStore.locates.delete(cardID)
  if ((/^001/i).test(cardID)) {
    locateStore.localStaffs.delete(cardID, true)
  } else if ((/^002/ig).test(cardID)) {
    locateStore.localVehicle.delete(cardID, true)
  }
}

export default {toggleLocating}
