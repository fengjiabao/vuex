<template>
  <div class="page-body">
    <div id="monitormap"></div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState ({
      loadMap: state => state.mapStore.loadMap
    })
  },
  watch: {
    loadMap: function () {
      console.log('1111')
      let id = xdata.state.mapStore.defaultMapID
      let map = xdata.state.mapStore.map
      let mapRow = xdata.state.mapStore.row
      let dom = this.$el.querySelector('#monitormap')
      xdata.dispatch('mapService/initMap', {
        id: id,
        map: map,
        mapRow: mapRow,
        dom: dom
      })
    }
  },
  mounted () {
    console.log('11111')
  }
}
</script>
<style lang="sass" scoped>
  @import '../../style/defs.sass'
  .page-body
    @include wh(100%, 100%)
    position: relative
    flex: auto
    #monitormap
      position: absolute
      @include wh(100%, 100%)
      background: url(../../assets/mapBg.png) center center
      background-size: cover
</style>
