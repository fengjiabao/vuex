import Dexie from 'dexie'
export default {
  namespaced: true,
  state: {
    db: null,
    data: new Map(),
    dbstore: false,
    forceUpdateMetadata: false, // 是否为强制更新数据
    DB_NAME: 'YaLocDataInBrowserDB',
    name: null,
    rows: null,
    version: 1,
    storeForceData: false
  },
  mutations: {

  },
  actions: {
    async openLocalDB ({state, dispatch}) {
      state.db = new Dexie(state.DB_NAME)
      try {
        state.db && await state.db.open()
      } catch (error) {
        return console.warn('No data is stored yet!')
      }
      state.version = state.db.verno
      let data = await state.db.table('mdt_update').toArray()
      for (let i = 0, len = data.length; i < len; i++) {
        let tableGroup = data[i]
        let tableName = tableGroup.tableName
        xdata.dispatch('metaStore/saveData', {
          name: tableName
        })
      }
    },
    dbOpen ({state, dispatch}, res) {
      let msg = {
        name: res.data.name,
        rows: res.data.rows
      }
      dispatch('openDB', msg)
    },
    async openDB ({state, dispatch}, message) {
      if (state.forceUpdateMetadata) {

      } else {
        state.db && state.db.isOpen() && state.db.close()
      }
      state.name = message.name
      state.rows = message.rows
      let rows = message.rows
      state.db = new Dexie(state.DB_NAME)
      let msg = {}
      msg[message.name] = 'tableName'
      let version = parseInt(state.version, 10)
      version = version ? parseInt(version, 10) : 1
      if (!message.rows) return
      for (let i = 0, len = rows.length; i < len; i++) { // objectStore
        let storename = rows[i]
        let name = storename.tableName
        let key = null
        if (!state.db[name]) {
          let defname = name.slice(4)
          let def = this.state.metaStore.defs[defname]
          if (def) {
            key = def.fields.names[def.keyIndex]
          } else {
            key = name.slice(4) + '_id'
            if (name === 'dat_staff_extend') {
              key = 'staff_id'
            } else if (name === 'dat_vehicle_extend') {
              key = 'vehicle_id'
            }
          }
        }
        msg[name] = key
      }
      state.db.version(version).stores(msg)
      state.db.version(version + 1).stores(msg)
      await state.db.open()
      let data = await state.db.table('mdt_update').toArray()
      if (state.db.isOpen()) {
        let msg = {
          cmd: 'pull_down_metadata',
          data: {
            mdtdata: data
          }
        }
        this.dispatch('socketStore/registerGlobalEventHandlers', {
          cmd: 'PULL-DOWN-METADATA',
          data: msg
        })
        for (let i = 0, len = rows.length; i < len; i++) {
          let storename = rows[i]
          let name = storename.tableName
          dispatch('getArray', {
            name: name,
            storename: storename
          })
        }
        state.dbstore = true
        // 每次更新indexDB中dat_mdt_update表
        dispatch('storeDATA', {
          name: state.name,
          rows: state.rows
        })
      }
    },
    storeDATA ({state}, msg) {
      let storename
      let name = msg.name
      let value = msg.rows
      let upmethod = msg.upmethod
      try {
        storename = state.db[name] || state.db.table(name)
      } catch (error) {
        console.warn(`Table ${name} not exist`)
      }

      if (storename) {
        state.db.transaction('rw', storename, async () => {
          if (value) {
            if (upmethod == 'DELETE') {
              await storename.clear()
            }
            for (let i = 0; i < value.length; i++) {
              let id = await storename.put(value[i])
              // console.log(`added ${storename.name} with id ${id}`)
            }
            this.dispatch('metaStore/saveData', {
              name: name
            })
          }
        }).then(() => {
          console.log(`added ${storename.name}`)
          if (state.storeForceData) {
            state.forceData.set(name, true)
            // xbus.trigger('PROGRESS-BAR')
          }
          if (state.forceData.size >= this.rows.length) {
            state.storeForceData = false
          }
        }).catch(e => {
          console.warn(`更新元数据${name}失败`)
        })
      }
    },
    async getArray ({state, dispatch}, msg) {
      let name = msg.name
      let arr = state.db[name] && await state.db[name].toArray()
      if (arr && arr.length < 0) {
        dispatch('initDB', {
          name: name
        })
      }
    },
    initDB ({state, dispatch}, msg) {
      let name = msg.name
      let len = name.length
      let defName = name.slice(4, len)
      let defData = this.state.metaStore.defs[defName]
      let sqlStr = defData && defData.fields.names
      sqlStr = sqlStr || '*'
      let sql = `select ${sqlStr} from ${name}`
      let sqlname = name
      state.data.set(sqlname, true)
      dispatch('inquireDB', {
        sqlname: sqlname,
        sql: sql
      })
    },
    inquireDB (state, msg) {
      let message = {
        cmd: 'query',
        data: {
          name: msg.sqlname,
          sql: msg.sql
        }
      }
      this.dispatch('socketStore/registerGlobalEventHandlers', {
        cmd: 'REPT-FETCH-DATA',
        data: message
      })
    }
  }
}
