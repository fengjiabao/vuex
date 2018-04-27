import {concatObject} from './utils.js'
function getCardInfo (state, cardID) {
  let cards = state.data['card']
  return cards ? cards.get(cardID) : null
}

function getCardTypeID (state, cardID) {
  let card = getCardInfo(state, cardID)
  return card ? card.card_type_id : -1
}

function getCardTypeInfo (state, cardID) {
  let ret = null

  let cardTypeID = getCardTypeID(state, cardID)
  cardTypeID = parseInt(cardTypeID, 10)
  if (cardTypeID >= 0) {
    ret = state.data['card_type'] && state.data['card_type'].get(cardTypeID)
  }

  return ret
}

function getCardTypeName (state, cardID) {
  let typeInfo = getCardTypeInfo(state, cardID)
  return typeInfo ? typeInfo.name : undefined
}

/**
   * 获得卡所绑定对象的信息
   * @param {*} cardID 卡号
   */
function getCardBindObjectInfo (state, cardID) { // such as staff or vehicle
  let cardTypeName = getCardTypeName(state, cardID)
  let baseInfoTable = state.data[cardTypeName]

  let objExtendInfo = state.cardIndex.get(cardID)
  let objID = objExtendInfo && objExtendInfo[cardTypeName + '_id']
  let objBaseInfo = baseInfoTable && baseInfoTable.get(objID)

  return concatObject(objExtendInfo, objBaseInfo)
}

export {getCardBindObjectInfo, getCardTypeName, getCardTypeInfo, getCardTypeID, getCardInfo}
