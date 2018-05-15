<template>
  <div class="dlg-window" v-if="isShow">
    <div class="dlg-bg">
      <div class="dlg-head">
        <span>
          <grip></grip>
          <span>{{title}}</span>
        </span>
        <svg class="icon" @click="hide"><use xlink:href="#icon-close"></use></svg>
      </div>
      <div class="dlg-body detail-content">
        <!-- <search-bar :cardType="cardType"></search-bar> -->
        <table v-if="hasdata">
          <thead>
            <tr>
              <th v-for="(item,index) in labels" :key="index">{{ item }}</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in subRows" :key="index">
              <td v-for="(name,index) in names" :key="index">{{ item[names.indexOf(name)] }}</td>
              <!-- <td>
                <card-opbar cardid={row[0]} cardtypeid={subTypeID} isspecial={row[17]} needhide="1"></card-opbar>
              </td> -->
            </tr>
          </tbody>
        </table>
        <pagination :totalpage="pageCount" :pageindex="pageIndex" :tablename="name"></pagination>
        <div v-if="!hasdata" class="tips">无相关数据！</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import grip from './grip'
import pagination from './pagination'
import { getDetail } from '../js/utils/cardStoreDep.js'
import searchBar from './search-bar'
import cardStateDef from '../js/def/card_state_def.js'
import { formatRecordArray, formatStateArray } from '../js/utils/metaStoreDep.js'
export default {
  data () {
    return {
      isShow: false,
      cardType: 1,
      hasdata: false,
      type: null,
      subTypeID: null,
      composeType: null,
      subTypeName: null,
      labels: null,
      names: null,
      subRows: null,
      PAGE_SIZE: 10
    }
  },
  watch: {
    '$store.state.stateStore.showDetailDialog': {
      handler: function (result) { // 箭头函数无法获取this指向实例
        this.isShow = result
        this.isShow && this.init(this.$store.state.stateStore.detailDialogMsg)
      }
    },
    '$store.state.stateStore.detailDialogMsg.subTypeID': {
      handler: function (result) {
        this.cardType = result
      },
      deep: true // 深度监听，监听二级
    }
  },
  computed: {
    ...mapState({
      title: state => {
        let detailDialog = state.stateStore.detailDialogMsg
        let type = detailDialog.subTypeID === 1 ? '人员：' : '车辆：'
        let count = detailDialog.subTypeID === 1 ? state.cardStore.sstate.sum : state.cardStore.vstate.sum
        count = `共有${count}${detailDialog.subTypeID === 1 ? '个人' : '辆车'}`
        return `${type}${count}`
      }
    })
  },
  methods: {
    init (msg) {
      this.name = 'detaildialog'
      this.type = msg.type
      this.subTypeID = msg.subTypeID

      if (msg.filterGeo) {
        this.showCall = true
      }

      if (this.type === 'card') {
        this.composeType = msg.composeType
      }
      if (['card', 'device'].includes(this.type)) {
        let subID = parseInt(this.subTypeID, 10)
        this.subTypeName = xdata.state.metaStore.data[this.type + '_type'].get(subID).name
      }
      switch (this.type) {
        case 'card':
          this.def = cardStateDef[this.subTypeName]
          this.rows = this.getCardRows(msg.subTypeID, msg.statType, this.composeType, msg.groupID, msg.deptID, msg.filterGeo)
          break
      }
      if (this.type !== 'alarm') {
        this.labels = this.def.fields.labels
        this.names = this.def.fields.names
      }
      this.hasdata = (this.rows && this.rows.length > 0) || false
      this.showDetail()
    },
    showDetail () {
      this.subRows = this.rows.slice(0, this.PAGE_SIZE)
      let count = this.subRows.length
      this.changeRowView(count)
      this.initPagination()
    },
    initPagination () {
      this.rowCount = this.rows ? this.rows.length : 0
      this.pageCount = Math.ceil(this.rowCount / this.PAGE_SIZE)
      this.pageIndex = 0
    },
    getCardRows (subTypeID, statType, composeType, areaID, deptID, filterGeo) {
      let ret = null
      let groupID = parseInt(areaID, 10)
      ret = getDetail(xdata, subTypeID, statType, groupID, filterGeo)
      return ret
    },
    hide () {
      this.$store.commit('stateStore/changeShowDetailDialog')
    },
    pageIndexChange (msg) {
      console.log(msg)
      this.pageIndex = msg.pageIndex
      let start = this.pageIndex * this.PAGE_SIZE
      let end = start + this.PAGE_SIZE
      this.subRows = this.rows && this.rows.slice(start, end)

      let count = this.subRows.length
      this.changeRowView(count)
    },
    changeRowView (count) {
      for (let i = 0; i < count; i++) {
        let row = this.subRows[i]
        // let areaID = this.subRows[i][10]
        this.subRows[i] = this.type === 'device' ? formatRecordArray(this.def, row, 'SHORT-DATE') : formatStateArray(this.def, row, 'SHORT-DATE', xdata)
        // this.subRows[i].push(this.isSpecialArea(areaID))
      }
    }
  },
  components: {
    grip,
    searchBar,
    pagination
  }
}
</script>
<style lang="sass" scoped>
@import '../style/defs.sass'
.dlg-bg
  width: 90%
.dlg-head
  @include flex-space-between
  span
    display: flex
.detail-content
  background: #eee
  .tips
    @include wh(100%,3rem)
    text-align: center
    line-height: 3rem
  table
    width: 100%
    font-size: 14px
    th
      padding: .3rem 0
    tr
      height: .8rem
      td
        padding: .3rem 0
        text-align: center
</style>
