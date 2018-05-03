import {OD, ST} from '../def/odef.js'
export default {
  namespaced: true,
  state: {
    showDetailDialog: false,
    detailDialogMsg: {
      type: null,
      subTypeID: null,
      statType: null,
      composeType: null
    }
  },
  mutations: {
    changeShowDetailDialog (state, msg) {
      state.showDetailDialog = !state.showDetailDialog
      state.detailDialogMsg.type = msg.type
      state.detailDialogMsg.subTypeID = msg.subTypeID
      state.detailDialogMsg.statType = msg.statType
      state.detailDialogMsg.composeType = msg.composeType
    }
  }
}
