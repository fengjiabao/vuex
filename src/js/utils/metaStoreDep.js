import {concatObject, formatElapsedTime} from './utils.js'
// 以 '_id' 结尾的通配符
let endWithID = /^(\w*)_id$/i

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

function getCurrentShiftID () {
  let shiftID = -1

  let time = new Date().format('hh:mm:ss')
  if (time >= '23:00:00' || time < '07:00:00') {
    shiftID = 1
  } else if (time >= '07:00:00' && time < '15:00:00') {
    shiftID = 2
  } else {
    shiftID = 3
  }

  return shiftID
}

/**
   * 从 'xxx_id' 字段获取所对应的名称(name字段)
   * 要求：
   * 1. 所有 id 字段必须为 xxx_id 的形式，其对应表的名字为 dat_xxx，如 map_id, 对应表为 dat_map
   * 2. 有一个 name 字段，如 dat_map 中，有一个 name 字段，是对 map_id 的名称
   * 则： getNameByID('map_id', 5) 可以获得 map_id = 5 的地图的名称
   *
   * @method getNameByID
   *
   * @param  {[type]}    idFieldName  [description]
   * @param  {[type]}    idFieldValue [description]
   *
   * @return {[type]}                   [description]
   */
function getNameByID (idFieldName, idFieldValue, xdata) {
  let fieldName = 'name'
  if (idFieldName === 'device_type_id' || idFieldName === 'card_type_id') {
    fieldName = 'detail' // device 和 card 的描述字段是 'detail'
  }

  return getFieldByID(idFieldName, idFieldValue, fieldName, xdata)
}

function getFieldByID (idName, idValue, fieldName, xdata) {
  let ret = idValue
  let r = endWithID.exec(idName)
  if (r) {
    // let ds = this.data[r[1]]
    let ds = xdata.state.metaStore.data[r[1]]
    if (ds) {
      let row = ds.get(parseInt(idValue, 10))
      if (row) {
        let label = row[fieldName]
        if (label) {
          ret = label
        }
      }
    }
  }

  return ret
}

function formatStateArray (def, row, rule, xdata) { // rule: SHORT-DATE or not, etc.
  if (!def || !row) {
    return row
  }
  let ret = []
  for (let i = 0, len = def.fields.names.length; i < len; i++) {
    let name = def.fields.names[i]

    if (i === def.keyIndex) { // key 不做转换
      ret.push(row[i])
      continue
    }
    let type = def.fields.types[i]
    let value = row[i]
    if (name === 'area_id' && row[i] === 0) {
      value = '未识别区域'
    } else {
      value = formatField(name, value, type, rule, xdata)
    }

    if (name === 'work_time') { // 工作时间转化
      value = formatElapsedTime(value)
    }

    if (name === 'map_pos') { // 地图位置信息组装
      value = getPositionDesc(row[i], row[i + 1], row[i + 2], xdata)
    }
    ret.push(value)
  }

  return ret
}

function formatField (name, value, type, rule, xdata) {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  if (name === 'speed') {
    // console.warn('speed', value)
  }
  // debugger  // eslint-disable-line
  let ret = value
  switch (type) {
    case 'NUMBER':
    case 'SELECT':
      if (endWithID.exec(name)) {
        ret = getNameByID(name, value, xdata)
      }
      break
    case 'DATETIME':
      let sformater = rule && rule === 'SHORT-DATE' ? 'MM-dd hh:mm' : 'yyyy-MM-dd hh:mm:ss'
      ret = new Date(value).format(sformater)
      break
    default:
      // console.warn('未知的字段类型：', type)
      break
  }

  return ret
}

//  获得位置描述
function getPositionDesc (landmarkID, directionID, distance, xdata) {
  let ret = ''

  let landmarkName = getNameByID('landmark_id', landmarkID, xdata)
  if (landmarkName !== 0 && distance) {
    distance = distance.toFixed(2)
    ret = landmarkName
    let directionName = getNameByID('direction_mapper_id', directionID, xdata)
    if (directionName !== 0) {
      if (distance !== 0) {
        ret = landmarkName + directionName + distance + '米'
      }
    } else {
      if (distance !== 0) {
        ret = landmarkName + distance + '米'
      }
    }
  }

  return ret
}

function getVehicleDriver (vehicleNumber, xdata) {
  return xdata.state.metaStore.driverData && xdata.state.metaStore.driverData.get(vehicleNumber)
}

export {getCardBindObjectInfo, getCardTypeName, getCardTypeInfo, getCardTypeID, getCardInfo, getCurrentShiftID, getNameByID, formatStateArray, getVehicleDriver}
