import {toJson} from '../utils/utils.js'
import {CARD} from '../def/state.js'
const UNCOVER = 1000
const SPECIAL = 1001
export default {
  namespaced: true,
  state: {
    vcards: new Map(),
    scards: new Map(),
    nosignalscars: new Map(),
    uncovercards: new Map(),
    vstate: null,
    sstate: null,
    overview: {},
    averageUpdateDuration: 1000,
    lastUpdateTime: 0
  },
  mutations: {
    updateRefreshDuration (state) {
      let inow = window.performance.now()
      if (state.lastUpdateTime > 0) {
        state.averageUpdateDuration = inow - state.lastUpdateTime
      }
      state.lastUpdateTime = inow
    },
    processStat (state, data,type) {
      let stat = null

      if (data) {
        if (this.state.user.deptID === 0) {
          stat = data.glbl
        } else if (data.dept) {
          stat = data.dept[this.state.user.deptID]
        }
      }

      data.type === 'vehicle'? state.vstate = stat : state.sstate = stat
    }
  },
  actions: {
    cardUpdatePos ({state, dispatch, commit}, data) {
      dispatch('cardMove', data)
      commit('updateRefreshDuration')
    },
    cardMove ({dispatch}, data) {
      if (!data) return
      data = toJson(data)
      dispatch('processVehicleData', data.v)
      dispatch('processStaffData', data.s)
    },
    async processVehicleData ({state, dispatch,commit}, data) {
      if (!data) {
        return
      }
      data.stat.type = 'vehicle'
      commit('processStat',data.stat)
      state.overview.vehicle = state.vstate ? state.vstate.sum : 0
      state.vcards = await dispatch('processDetail', data.detail)
    },
    async processStaffData ({state, dispatch,commit}, data) {
      if (!data) return
      data.stat.type = 'staff'
      commit('processStat',data.stat)
      state.overview.staff = state.sstate ? state.sstate.sum : 0

      state.scards = await dispatch('processDetail', data.detail)
    },
    async processDetail ({state, dispatch}, data) {
      let xmap = new Map()
      if (data) {
        for (let i = 0, len = data.length; i < len; i++) {
          let card = data[i]
          let cardID = card[CARD.card_id]
          card = await dispatch('addFields', {
            cardID: cardID,
            card: card
          })

          if (this.state.user.deptID === 0 || card[CARD.dept_id] === this.state.user.deptID) { // 全局 或 对应部门的详情
            xmap.set(cardID, card)
            dispatch('showCard', {
              cardID: cardID,
              card: card
            })
          }
        }
      }

      return xmap
    },
    async addFields ({state, dispatch}, data) {
      let cardID = data.cardID
      let card = data.card
      let cardTypeID = -1
      let cardBindedObjectID = ''
      let cardTypeInfo = await this.dispatch('metaStore/getCardTypeInfo', cardID)

      if (cardTypeInfo) {
        cardTypeID = cardTypeInfo.card_type_id
        let bindedObject = await this.dispatch('metaStore/getCardBindObjectInfo', cardID)
        if (bindedObject) {
          cardBindedObjectID = bindedObject.name
        }
      } else {
        console.warn(`Can NOT find cardTypeInfo for ${cardID}`)
      }

      card && card.splice(1, 0, cardTypeID, cardBindedObjectID)
      return card
    },
    getNomalCmd ({state}, data) {
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
    },
    /**
     * 根据卡 推送过来的状态类型，获得对应的 cmd 指令
     * @param {*} 车:(非覆盖区域/运动/静止/停车场) 与 (丢失信号)
     * @param {*} 人: 接收 与 没接收到
     */
    async getCmdByState ({state, dispatch}, data) {
      let cmd = 'POSITION'
      let card = data.card
      let cardID = data.cardID
      let areas = this.state.metaStore.data.area
      let areatype = this.state.metaStore.data.area_type
      let areaID = card[CARD.area_id]
      let area = areas && areas.get(areaID)
      let areaTypeID = area && Number(area.area_type_id)
      let areaTypeName = areaTypeID && areatype && areatype.get(areaTypeID).area_type_id
      areaTypeName = parseInt(areaTypeName, 10)
      let cardTypeName = await this.dispatch('metaStore/getCardTypeName', cardID)

      let cardstate = card[CARD.state_biz] // 卡的业务状态 接收/没接收信号
      if (cardstate === 1024) { // 接收不到信号,车辆变灰
        if (cardTypeName === 'staff') {
          cmd = 'NOSIGNAL' // 卡类型为人员时,存入无信号人员卡缓冲区
          if (!state.nosignalscars.has(cardID)) {
            state.nosignalscars.set(cardID, card)
          }
        } else if (cardTypeName === 'vehicle') {
          if (areaTypeID < 1000) { // 正常区域时，会出现无信号状态
            cmd = 'NOSIGNAL'
          } else { // 非覆盖区域 or 胶轮车硐室 的情况
            cmd = await dispatch('getNomalCmd', {
              areaTypeName: areaTypeName,
              cardID: cardID
            })
          }
        }
      } else {
        cmd = await dispatch('getNomalCmd', {
          areaTypeName: areaTypeName,
          cardID: cardID
        })
      }

      return cmd
    },
    async showCard ({dispatch}, data) {
      let card = data.card
      let cmd = await dispatch('getCmdByState', data)
      this.dispatch('olMapCardLayer/informMapUpdateCard', {
        cmd: cmd,
        card: card
      })
    }
  }
}
