
import {dealSpecialId, concatObject} from '../utils/utils.js'
export default {
  namespaced: true,
  state: {
    isneedMove: false, // 判断切换到实时地图界面是否需要动画
    defs: null,
    data: {},
    maxIDs: {},
    dataInArray: new Map(),
    cardIndex: new Map(),
    driverData: new Map(),
    alarm: new Map(),
    staffs: new Map(),
    vehicles: new Map(),
    first: false,
    CARD_TYPES: ['vehicle_extend', 'staff_extend', 'adhoc'],
    defaultMapID: 5
  },
  mutations: {
    saveMetaDef (state, res) {
      state.defs = res.data
    },
    updateDriverData ({state, commit, dispatch}, data) {
      let shiftID = commit('getCurrentShiftID')

      let recs = data.filter(item => item.shift_id === shiftID)
      if (recs && recs.length > 0) {
        state.driverData.clear() // clear all preview data first

        for (let i = 0, len = recs.length; i < len; i++) {
          let rec = recs[i]
          state.driverData.set(recs[i].vehicle_number, rec)
        }
      }
    },
    getCurrentShiftID (state) {
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
    },
    storeAlarm (state, data) {
      let name = data.name
      let value = data.value
      state.alarm.set(name, value)
    },
    // 是否需要过滤部分卡
    // 被过滤目标不在前端显示,即生效, 目前数据库为0生效
    updateFilterCardFlag (state) {
      state.needFilterCards = false // 默认不过滤

      let rules = state.dataInArray.get('rules')
      let filterCardRules = rules && rules.filter(item => item.name === 'filtercard')
      let filterCardRule = filterCardRules && filterCardRules[0]

      if (filterCardRule && filterCardRule.status === 0) {
        state.needFilterCards = true
      }
    }
  },
  actions: {
    metaData ({state, dispatch, commit}, res) {
      if (res && res.code === 0) {
        let length = Object.keys(state.defs).length
        if (res.data.name === 'mdt_update' && state.defs) {
          if (!state.first && !state.data.mdt_update) {
            let msg = {
              information: '系统正在升级中，请勿关闭页面！'
            }
            state.first = !state.first
          }
          this.dispatch('dexieDBStore/dbOpen', res)
        } else if (res.data.name === 'driver_arrange') {
          let data = res.data.rows
          if (data && data.length > 0) {
            let time = new Date().format('yyyy-MM-dd')
            let currentArrangement = data.filter(item => new Date(item.driver_date).format('yyyy-MM-dd') === time)
            currentArrangement && currentArrangement.length > 0 && commit('updateDriverData', currentArrangement)
          }
        } else {
          let name = res.data.name
          if (name.indexOf('dat') < 0) {
            name = `dat_${res.data.name}`
          }
          this.state.dexieDBStore.db[name] ? this.dispatch('dexieDBStore/storeDATA', {
            name: name,
            rows: res.data.rows,
            upMethod: res.upMethod
          }) : dispatch('saveMetaData', {
            name: res.data.name,
            rows: res.data.rows
          })
        }
      }
    },
    saveMetaData ({state, commit, dispatch}, msg) {
      let name = msg.name
      let rows = msg.rows
      state.dataInArray.set(name, rows) // TODO: meta saved two copys !!!

      let tmp = new Map() // temp map to save the rows
      let cardList = state.CARD_TYPES.includes(name) ? new Map() : null
      let maxID = 0
      if (rows) {
        let def = state.defs && state.defs[name]
        let keyName = def ? def.fields.names[def.keyIndex] : name + '_id'
        keyName = dealSpecialId(name, keyName)
        for (let item of rows) {
        // save to data
          let keyValue = item[keyName]
          tmp.set(keyValue, item)

          // is card, save to cardIndex
          if (cardList) {
            let cardID = item['card_id']
            cardList.set(cardID, item)
            state.cardIndex.set(cardID, item)
          }

          // init the maxID
          if (keyValue > maxID) {
            maxID = keyValue
          }
        }
      }
      state.data[name] = tmp
      state.maxIDs[name] = maxID
    },
    async saveData ({state, dispatch}, msg) {
      try {
        let table = this.state.dexieDBStore.db.table(msg.name) || this.state.dexieDBStore.db[msg.name]
        let rows = msg.value ? msg.value : await table.toArray()
        let keyname = msg.name.slice(4)
        dispatch('saveMetaData', {
          name: keyname,
          rows: rows
        })
        dispatch('handleTable', {
          name: keyname,
          rows: rows
        })
        // this.getMdtlength()
        // this.dealDataByDept()
      } catch (error) {
        console.warn(`table ${msg.name} does not exist!`)
      }
    },
    async jointObj ({state, dispatch}, type) {
      let objects = state.dataInArray.get(type)
      if (objects) {
        for (let i = 0, len = objects.length; i < len; i++) {
          let obj = objects[i]
          let objID = obj[type + '_id']
          let name = obj.name
          let spy = await this.dispatch('spell/makePy', name)
          let brief = spy ? spy[0] : ''
          obj.spy = brief
          let objExtend = state.data[type + '_extend'].get(objID)
          let objInfo = concatObject(obj, objExtend)
          if (type === 'staff') {
            state.staffs.set(objID, objInfo)
          } else if (type === 'vehicle') {
            state.vehicles.set(objID, objInfo)
          }
        }
      }
    },
    handleTable ({state, commit, dispatch}, msg) {
      let name = msg.name
      let rows = msg.rows
      if (name === 'map_gis') {
        this.dispatch('mapStore/saveGisMap', rows)
      }
      if (name === 'setting') {
        if (rows) {
          for (let i = 0, len = rows.length; i < len; i++) {
            commit('storeAlarm', {
              name: rows[i].name,
              value: rows[i].value
            })
          }
        }
        if (!state.alarm.get('alarm')) {
          commit('storeAlarm', {
            name: 'alarm',
            value: this.state.alarm.defaultAlarmLevel
          })
        }
      }
      if (name === 'rules') {
        commit('updateFilterCardFlag')
      }
      if (state.data['staff'] && state.data['staff_extend']) {
        if (!state.staffs.size || state.staffs.size !== state.data.staff.size) {
          dispatch('jointObj', 'staff')
        }
      }

      if (state.data['vehicle'] && state.data['vehicle_extend']) {
        if (!state.vehicles.size || state.vehicles.size !== state.data.vehicle.size) {
          dispatch('jointObj', 'vehicle')
        }
      }
    },
    async getCardInfo ({state}, cardID) {
      let cards = state.data['card']
      return cards ? cards.get(cardID) : null
    },
    async getCardTypeID ({dispatch}, cardID) {
      let card = await dispatch('getCardInfo', cardID)
      return card ? card.card_type_id : -1
    },
    async getCardTypeInfo ({state, dispatch}, cardID) {
      let ret = null

      let cardTypeID = await dispatch('getCardTypeID', cardID)
      cardTypeID = parseInt(cardTypeID, 10)
      if (cardTypeID >= 0) {
        ret = state.data['card_type'] && state.data['card_type'].get(cardTypeID)
      }

      return ret
    },
    async getCardTypeName ({state, dispatch}, cardID) {
      let typeInfo = await dispatch('getCardTypeInfo', cardID)
      return typeInfo ? typeInfo.name : undefined
    },
    async getCardBindObjectInfo ({state, dispatch}, cardID) { // such as staff or vehicle
      let cardTypeName = await dispatch('getCardTypeName', cardID)
      let baseInfoTable = state.data[cardTypeName]
      if (!baseInfoTable && !state[cardTypeName]) {
        // this.pullDownMetadata(cardTypeName)
        baseInfoTable = state.data[cardTypeName]
      }

      let objExtendInfo = state.cardIndex.get(cardID)
      if (!objExtendInfo && !state[cardTypeName + '_extend']) {
        // this.pullDownMetadata(cardTypeName + '_extend')
        objExtendInfo = state.cardIndex.get(cardID)
      }
      let objID = objExtendInfo && objExtendInfo[cardTypeName + '_id']

      let objBaseInfo = baseInfoTable && baseInfoTable.get(objID)

      // 防止如果一张卡触发拉取元数据，但是并未拉取到，每张push来的定位数据卡重复多次拉取元数据
      state[cardTypeName] = true
      state[cardTypeName + '_extend'] = true

      return concatObject(objExtendInfo, objBaseInfo)
    }
  }
}
