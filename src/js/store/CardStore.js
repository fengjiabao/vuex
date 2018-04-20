export default {
  namespaced: true,
  state: {
    vcards: new Map(),
    scards: new Map()
  },
  actions: {
    cardUpdatePos (state, data) {
      console.log(data)
    }
  }
}
