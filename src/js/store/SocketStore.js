import {EVT} from '../Protocol.js'
export default {
  namespaced: true,
  state: {
    socket: null
  },
  mutations: {
    storeThis (state, msg) {
      state.socket = msg
    }
  },
  actions: {
    storeSocket (state, msg) {
      state.commit('storeThis', msg)
    },
    sendMsg (state, rows) {
      let socket = state.socket
      let eventName = rows.cmd
      let msg = rows.data
      let cb = rows.cb
      let ret = false
      if (socket && socket.connected) {
        cb && cb instanceof Function ? socket.emit(eventName, msg, cb) : socket.emit(eventName, msg)
        ret = true
      } else {
        console.warn('Socket.js : The socket is disconnected.')
        // xbus.trigger('FAILED-FOR-NOCONN', { eventName: eventName })
      }

      return ret
    },
    registerGlobalEventHandlers ({state, dispatch}, msg) {
      let cmd = msg.cmd
      let data = msg.data
      switch (cmd) {
        case 'REPT-FETCH-DATA':
          dispatch('getRept', data)
          break
        case 'PULL-DOWN-METADATA':
          dispatch('sendMsg', {
            cmd: EVT.META,
            data: msg
          })
          break
      }
    },
    getRept (state, data) {
      state.dispatch('sendMsg', {
        cmd: data.cmd,
        data: data.data,
        cb: (res) => {
          let ds = {
            def: data.def,
            rows: res.data,
            total: res.total,
            pageIndex: res.pageIndex
          }
          console.log(res)
        }
      })
    }
  }
}
