
import {TOPIC, TopicDef} from '../def/topic_def.js'
export default {
  namespaced: true,
  state: {
    showDetailDialog: false, // detail dialog
    detailDialogMsg: {
      type: null,
      subTypeID: null,
      statType: null,
      composeType: null
    },
    mapSidePanel: TopicDef[TOPIC.VEHICLE_BY_AREA], // map sidebar
    showIconTips: false,
    iconTipsMsg: {
      name: null
    },
    showCallCards: false, // call cards
    showPwd: false, // password page
    pwdHint: '' // password tips
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
    },
    changeShowIconTips (state, msg) {
      state.iconTipsMsg.name = msg
      state.showIconTips = !state.showIconTips
    },
    changeShowCallCards (state, msg) {
      state.showCallCards = !state.showCallCards
    },
    changePwd (state, msg) {
      state.showPwd = !state.showPwd
    }
  }
}
