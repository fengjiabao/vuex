import {CARD} from '../def/state.js'
import {getCardBindObjectInfo, getCardTypeInfo, getCardTypeName} from './metaStoreDep.js'

const UNCOVER = 1000
const SPECIAL = 1001

function getNomalCmd (state, data) {
  let cmd = 'POSITION'
  let areaTypeName = data.areaTypeName
  let cardID = data.cardID
  if (state.nosignalscars.has(cardID)) { // 该卡有信号时,如果之前为无信号状态,则删除该卡
    state.nosignalscars.delete(cardID)
  }
  if (areaTypeName === UNCOVER) {
    if (!state.uncovercards.has(cardID)) {
      state.uncovercards.set(cardID, true)
      cmd = 'UNCOVER' // 非覆盖区域,防止推实时数据时,非覆盖区域卡乱动
    } else {
      cmd = 'NOCHANGE'
    }
  } else {
    if (areaTypeName === SPECIAL) {
      cmd = 'SPECIAL' // 胶轮车存放硐室,无label
    }
    state.uncovercards.delete(cardID)
  }
  return cmd
}

function getCmdByState (xdata, data) {
  let cmd = 'POSITION'
  let card = data.card
  let cardID = data.cardID
  let areas = xdata.state.metaStore.data.area
  let areatype = xdata.state.metaStore.data.area_type
  let areaID = card[CARD.area_id]
  let area = areas && areas.get(areaID)
  let areaTypeID = area && Number(area.area_type_id)
  let areaTypeName = areaTypeID && areatype && areatype.get(areaTypeID).area_type_id
  areaTypeName = parseInt(areaTypeName, 10)
  let cardTypeName = getCardTypeName(xdata.state.metaStore, cardID)

  let cardstate = card[CARD.state_biz] // 卡的业务状态 接收/没接收信号
  if (cardstate === 1024) { // 接收不到信号,车辆变灰
    if (cardTypeName === 'staff') {
      cmd = 'NOSIGNAL' // 卡类型为人员时,存入无信号人员卡缓冲区
      if (!xdata.state.cardStore.nosignalscars.has(cardID)) {
        xdata.state.cardStore.nosignalscars.set(cardID, card)
      }
    } else if (cardTypeName === 'vehicle') {
      if (areaTypeID < 1000) { // 正常区域时，会出现无信号状态
        cmd = 'NOSIGNAL'
      } else { // 非覆盖区域 or 胶轮车硐室 的情况
        cmd = getNomalCmd(xdata.state.cardStore, {
          areaTypeName: areaTypeName,
          cardID: cardID
        })
      }
    }
  } else {
    cmd = getNomalCmd(xdata.state.cardStore, {
      areaTypeName: areaTypeName,
      cardID: cardID
    })
  }

  return cmd
}

function addFields (state, data) {
  let cardID = data.cardID
  let card = data.card
  let cardTypeID = -1
  let cardBindedObjectID = ''
  let cardTypeInfo = getCardTypeInfo(state, cardID)

  if (cardTypeInfo) {
    cardTypeID = cardTypeInfo.card_type_id
    let bindedObject = getCardBindObjectInfo(state, cardID)

    if (bindedObject) {
      cardBindedObjectID = bindedObject.name
    }
  } else {
    console.warn(`Can NOT find cardTypeInfo for ${cardID}`)
  }

  card && card.splice(1, 0, cardTypeID, cardBindedObjectID)
  return card
}

export {getNomalCmd, getCmdByState, addFields, processDetail}
