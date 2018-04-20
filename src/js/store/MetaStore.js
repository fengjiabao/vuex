
import {dealSpecialId} from '../utils/utils.js'
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
    first: false,
    CARD_TYPES: ['vehicle_extend', 'staff_extend', 'adhoc']
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
        keyName = dealSpecialId (name, keyName)
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
      // console.log(msg)
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
        // this.saveMetaData(keyname, rows)
        // this.handleTable(keyname, rows)
        // this.getMdtlength()
        // this.dealDataByDept()
      } catch (error) {
        console.warn(`table ${msg.name} does not exist!`)
      }
    },
    handleTable ({state, dispatch}, msg) {
      let name = msg.name
      let rows = msg.rows
      if (name === 'map_gis') {
        this.dispatch('mapStore/saveGisMap', rows)
      }
    }
  }
}
