
import {TOPIC, TopicDef} from '../def/topic_def.js'
export default {
  namespaced: true,
  state: {
    showDetailDialog: false,
    detailDialogMsg: {
      type: null,
      subTypeID: null,
      statType: null,
      composeType: null
    },
    mapSidePanel: TopicDef[TOPIC.VEHICLE_BY_AREA]
  },
  mutations: {
    changeShowDetailDialog (state, msg) {
      state.showDetailDialog = !state.showDetailDialog
      if (msg) {
        state.detailDialogMsg.type = msg.type
        state.detailDialogMsg.subTypeID = msg.subTypeID
        state.detailDialogMsg.statType = msg.statType
        state.detailDialogMsg.composeType = msg.composeType
      }
    },
    changeMapSidePanel (state, msg) {
      state.mapSidePanel = TopicDef[msg]
    }
  }
}
