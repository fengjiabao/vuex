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
      <div class="dlg-body">
        <!-- <search-bar :cardType="cardType"></search-bar> -->
        <table v-if="hasdata">
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import grip from './grip'
import searchBar from './search-bar'
export default {
  data () {
    return {
      isShow: false,
      cardType: 1,
      hasdata: false
    }
  },
  watch: {
    '$store.state.stateStore.showDetailDialog': {
      handler: function (result) { // 箭头函数无法获取this指向实例
        this.isShow = result
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
    hide () {
      this.$store.commit('stateStore/changeShowDetailDialog')
    }
  },
  components: {
    grip,
    searchBar
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
</style>
