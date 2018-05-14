<template>
  <div class="topic-panel group-list-container">
    <div class="group-panel">
      <div class="group-list group-list-title">
        <span v-for="label in topic.label.group" :key="label.index">{{label}}</span>
      </div>
      <div v-for="group in groups" :key="group.index">
        <p :class="group[0] == currentGroupID ? 'active group-list group-list-item' : 'group-list group-list-item'" :data-groupid="group[0]">
          <span :data-groupid="group[0]" @click="switchGroup">{{ group[2] }}</span>
          <span :data-groupid="group[0]">{{ group[1] }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {TOPIC} from '../../js/def/topic_def.js'
import leftCount from '../../js/def/left_area.js'
import {getDetail} from '../../js/utils/cardStoreDep.js'
import {formatStateArray, getVehicleDriver} from '../../js/utils/metaStoreDep.js'
import cardStateDef from '../../js/def/card_state_def.js'
import {OD, ST} from '../../js/def/odef.js'
import {CARD} from '../../js/def/state.js'
export default {
  data () {
    return {
      topic: leftCount[TOPIC.VEHICLE_BY_AREA],
      groups: null,
      currentGroupID: -1
    }
  },
  watch: {
    '$store.state.collectorStore.lastPushTime': {
      handler: function () {
        this.changeGetState()
      }
    },
    '$store.state.stateStore.mapSidePanel': {
      handler: function (result) {
        this.topic = leftCount[result.name]
        this.changeGetState()
      }
    }
  },
  methods: {
    changeGetState () {
      this.$store.commit('cardStore/getState', {
        cardType: this.topic.type,
        statType: this.topic.groupName
      })
      let rows = this.$store.state.cardStore.stat
      this.updateData(rows)
    },
    updateData (rows) {
      if (this.topic.groupName === 'area') { // 对区域进行排序
        rows = rows && rows.sort(function (x, y) {
          return x[3] - y[3]
        })
      }
      this.groups = rows || null
    },
    switchGroup (evt) {
      let el = evt.currentTarget
      let sid = el.getAttribute('data-groupid')
      if (sid) {
        let groupID = parseInt(sid, 10)
        if (groupID === this.currentGroupID) { // 关闭 tab
          this.currentGroupID = -1
          this.currentGroup = null
        } else {
          this.updateDetailData(groupID)
        }
      }
    },
    // 根据 groupID，更新明细数据,groupID为区域
    updateDetailData (groupID) {
      let cards = getDetail(this.$store, this.topic.type, this.topic.groupName, groupID)
      let data = null
      if (cards && cards.length > 0) {
        data = this.formatDetailData(cards)
      }
      this.currentGroup = {
        cards: data,
        isSpecial: this.isSpecial(groupID)
      }
      this.currentGroupID = groupID
    },
    // 将数据格式化为显示需要的数组
    formatDetailData (cards) {
      let data = []

      if (this.topic.type === OD.VEHICLE) {
        for (let i = 0, len = cards.length; i < len; i++) {
          let row = []
          let card = cards[i]
          let stateDef = cardStateDef['vehicle']
          let state = formatStateArray(stateDef, card, null, this.$store)
          let vname = card[CARD.object_id]
          let driver = getVehicleDriver(vname, this.$store)
          let dname = driver ? driver.name : ''
          let speed = card[CARD.speed]
          let land = state[16]
          row = [card[0], vname, dname, speed, land]

          data.push(row)
        }
      } else {
        for (let i = 0, len = cards.length; i < len; i++) {
          let row = []
          let card = cards[i]
          let stateDef = cardStateDef['staff']
          let state = formatStateArray(stateDef, card, null, this.$store)
          let sname = card[CARD.object_id]
          let t = card[CARD.down_time]
          let dtime = t ? new Date(t).format('MM-dd hh:mm:ss') : ''
          let land = state[16]
          row = [card[0], sname, dtime, land]

          data.push(row)
        }
      }

      return data
    },
    isSpecial (id) {
      let ret = false
      let areaTypeID = null
      if (id !== 0) {
        areaTypeID = this.$store.state.metaStore.data.area.get(id) && this.$store.state.metaStore.data.area.get(id).area_type_id
      }
      if (this.topic.groupName === ST.AREA) {
        ret = id === 0 || areaTypeID == 1000
      }
      return ret
    }
  }
}
</script>


<style lang="sass" scoped>
@import '../../style/defs.sass'
.group-list
  padding: 0 1rem
  display: flex
  height: 2.4rem
  line-height: 2.4rem
  border-bottom: 1px solid $gray-l
  span:nth-child(1) 
    flex: 0 0 15rem
  span:nth-child(2)
    flex: 0 0 2rem
    text-align: center
</style>
