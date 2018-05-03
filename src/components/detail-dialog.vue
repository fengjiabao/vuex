<template>
  <div class="dlg-window" v-if="isShow">
    <div class="dlg-bg">
      <div class="dlg-head">
        <span>
          <grip></grip>
          <span>{{title}}</span>
        </span>
        <svg class="icon"><use xlink:href="#icon-close"></use></svg>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import grip from './grip'
export default {
  data () {
    return {
      isShow: false,
      icons: '#icon-close'
    }
  },
  watch: {
    '$store.state.stateStore.showDetailDialog': {
      handler: function (result) {
        return this.isShow = result
      }
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
  components: {
    grip
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
