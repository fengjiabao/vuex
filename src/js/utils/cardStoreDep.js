import {CARD} from '../def/state.js'
import {getCardBindObjectInfo, getCardTypeInfo, getCardTypeName, getNameByID} from './metaStoreDep.js'
import {ST, OD} from '../def/odef.js'
import {informMapUpdateCard} from '../map/mapUtils/cardLayerDep.js'
// import {}

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
    if (/^001/g.test(cardID)) {
      cardTypeID = 1
    } else {
      cardTypeID = 2
    }
    console.warn(`Can NOT find cardTypeInfo for ${cardID}`)
  }

  card && card.splice(1, 0, cardTypeID, cardBindedObjectID)
  return card
}

// 根据统计的 ID，补全名称
function addName (data, statType, xdata) {
  if (data && data.length > 0) {
    let idName = statType + '_id'
    for (let i = 0, len = data.length; i < len; i++) {
      let row = data[i]
      let name = getNameByID(idName, row[0], xdata)

      row.push(name)
      if (statType === 'area') {
        let areatype = xdata.state.metaStore.data.area && xdata.state.metaStore.data.area.get(row[0]) && xdata.state.metaStore.data.area.get(row[0]).area_type_id
        row.push(areatype)
      }
    }
  }

  return data
}

/**
  * 获取（vehicle, staff）按照（area, dept, level）分类的某个类别（id）的明细
   * @param {*} cardType 卡类别，（vehicle, staff）
   * @param {*} groupBy 分类（area, dept, level）
   * @param {*} groupID 分类 ID（id）
   */
function getDetail (xdata, cardType, groupBy, groupID, filterGeo) {
  let fieldIndex = 0
  switch (groupBy) {
    case ST.AREA:
      fieldIndex = CARD.area_id
      break
    case ST.DEPT:
      fieldIndex = CARD.dept_id
      break
    case ST.LEVEL:
      fieldIndex = CARD.occupation_level_id
      break
    case ST.SUM:
      fieldIndex = -1 // ALL
      break
    default:
      // console.log('UNKNOWN groupBy: ', groupBy)
      return
  }

  let xmap = getStatesMapByCardType(cardType, xdata)
  let allCards = xmap && Array.from(xmap.values())
  let arrtriFilterCards = fieldIndex < 0 ? allCards : allCards.filter(item => item[fieldIndex] === groupID)
  if (filterGeo) {
    // 空间条件过滤
    arrtriFilterCards = arrtriFilterCards.filter(function (item) {
      let coord = [item[3], -item[4]]
      let isItem = filterGeo.intersectsCoordinate(coord)
      return isItem
    })
  }
  return arrtriFilterCards
}

/**
   * 根据卡类型（vehicle, staff）获得对应的 map
   * @param {*} type
   */
function getStatesMapByCardType (type, xdata) {
  let xmap = null
  switch (type) {
    case OD.VEHICLE:
      xmap = xdata.state.cardStore.vcards
      break
    case OD.STAFF:
      xmap = xdata.state.cardStore.scards
      break
    default:
      console.log('UNKNOWN type:', type)
      return null
  }

  return xmap
}

// 测试
function processDetail (xdata, data) {
  let xmap = new Map()
  if (data) {
    for (let i = 0, len = data.length; i < len; i++) {
      let card = data[i]
      let cardID = card[CARD.card_id]
      card = addFields(xdata.state.metaStore, {cardID: cardID, card: card})

      if (xdata.state.user.deptID === 0 || card[CARD.dept_id] === xdata.state.user.deptID) { // 全局 或 对应部门的详情
        xmap.set(cardID, card)
        showCard(cardID, card, xdata)
        // dispatch('showCard', {
        //   cardID: cardID,
        //   card: card
        // })
      }
    }
  }

  return xmap
}

function showCard (cardID, card, xdata) {
  let cmd = getCmdByState(xdata, {
    cardID: cardID,
    card: card
  })
  informMapUpdateCard({
    cmd: cmd,
    card: card,
    xdata: xdata
  })
}

/**
   * 获取卡（cardID）最后一次状态信息
   * @param {*} cardID
   */
function getLastState (cardID) {
  let cardType = parseInt(cardID.slice(0, 3), 10)
  let xmap = getStatesMapByCardType(cardType, window.xdata)
  return xmap && xmap.get(cardID)
}

function getInfoDef (cardType) {
  if (!window.xdata.state.cardStore.infoDefs) { // 延迟初始化 this.infoDefs
    let defs = window.xdata.state.metaStore.defs
    window.xdata.commit('cardStore/initInfoDefs', {
      vehicle: defs.vehicle,
      staff: defs.staff
    })
  }
  return window.xdata.state.cardStore.infoDefs ? window.xdata.state.cardStore.infoDefs[cardType] : null
}

// get card's last info'
// 注意： 要求 cardID 必须是唯一的，比如：不允许出现 人卡ID 和 车卡ID 相同的情况
function getInfo (cardID) {
  let info = null

  let cardTypeName = getCardTypeName(cardID)
  if (!cardTypeName) {
    if (cardID.match(/^001/)) {
      cardTypeName = 'staff'
    } else if (cardID.match(/^002/)) {
      cardTypeName = 'vehicle'
    } else if (cardID.match(/^003/)) {
      cardTypeName = 'adhoc'
    }
  }
  if (cardTypeName !== 'adhoc') {
    info = window.xdata.state.cardStore.infos[cardTypeName + '_extend'].get(cardID)
  } else {
    info = window.xdata.state.cardStore.infos[cardTypeName].get(cardID)
  }
  return info
}

export {getNomalCmd, getCmdByState, addFields, processDetail, addName, getDetail, getLastState, getInfoDef, getInfo}
