export default {
  namespaced: true,
  state: {
    collectorStatus: false,
    lastPushTime: Date.now(),
    netWorkStatus: true,
    netLastChangeTime: null
  },
  mutations: {
    changeStatus (state, data) {
      state.collectorStatus = data
    },
    receiveStatus (state, data) {
      state.collectorStatus = data.status === 'online'
    },
    updateLastPushTime (state) {
      state.lastPushTime = new Date(Date.now()).format('hh:mm:ss')
    },
    changeNetWorkStatus (state, data) {
      state.netWorkStatus = data.connect
      state.netLastChangeTime = data.time
    }
  }
}
