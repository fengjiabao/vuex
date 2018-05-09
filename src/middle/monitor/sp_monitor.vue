<template>
  <div class="page-body">
    <div id="monitormap"></div>
    <div class="mapaside">
      <over-view></over-view>
      <map-sidebar></map-sidebar>
    </div>
    <tool-panel></tool-panel>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import overView from './over-view'
import mapSidebar from './map-sidebar'
import toolPanel from './tool-panel'
export default {
  computed: {
    ...mapState ({
      loadMap: state => state.mapStore.loadMap
    })
  },
  watch: {
    loadMap: function () {
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
    if (xdata) {
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
  components: {
    overView,
    mapSidebar,
    toolPanel
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
    .mapaside
      position: absolute
      z-index: 10
      height: 100%
      display: flex
</style>
