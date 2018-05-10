import ol from 'openlayers'
export default {
  namespaced: true,
  state: {
    vehicleLayerSource: null,
    vehicleLayer: null,

    staffLayerSource: null,
    staffLayer: null,
    groups: new Map(),
    hideAllPopup: true
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

      this.state.mapService.map.addEventListener('click', (evt) => {
        let feature = this.state.mapService.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature)

        if (feature) {
          let type = feature.getProperties()['data-type']
          switch (type) {
            case 'card':
              // this.showTips(evt, feature)
              break
            default:
              state.hideAllPopup = !state.hideAllPopup
          }
        } else {
          state.hideAllPopup = !state.hideAllPopup
        }
      })
    },
    setGroups (state, data) {
      state.groups.set(data.cardID, data.group)
    }
  }
}
