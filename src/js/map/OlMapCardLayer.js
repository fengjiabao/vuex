import ol from 'openlayers'
export default {
  namespaced: true,
  state: {
    vehicleLayerSource: null,
    vehicleLayer: null,

    staffLayerSource: null,
    staffLayer: null,
    groups: new Map()
  },
  mutations: {
    initLayers (state) {
      state.vehicleLayerSource = new ol.source.Vector()
      state.vehicleLayer = new ol.layer.Vector({
        source: state.vehicleLayerSource,
        zIndex: 6
      })
      state.staffLayerSource = new ol.source.Vector()
      state.staffLayer = new ol.layer.Vector({
        source: state.staffLayerSource,
        zIndex: 6
      })
      this.state.mapService.map.addLayer(state.vehicleLayer)
      this.state.mapService.map.addLayer(state.staffLayer)
    },
    setGroups (state, data) {
      state.groups.set(data.cardID, data.group)
    }
  }
}
