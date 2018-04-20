import ol from 'openlayers'
import { DEAFULT_MAP_MATRIXID } from '../def/map_def.js'
const spliceLevel = 9
export default {
  namespaced: true,
  state: {
    mapID: -1,
    map: null,
    view: null,
    workspace: null
  },
  mutations: {
    storeMap (state, val) {
      state.map = val.map
      state.view = val.view
    }
  },
  actions: {
    initMap ({state, commit}, rows) {
      console.log(rows)
      let mapID = rows.id
      let mapDef = rows.map
      let row = rows.mapRow
      let container = rows.dom
      let containerName = 'monitormap'
      let chooseMap = this.state.mapStore.gisMap && this.state.mapStore.gisMap.get(mapID)
      let projExtent = ol.proj.get('EPSG:3857').getExtent()
      let startResolution = ol.extent.getWidth(projExtent) / 256
      let resolutions = new Array(22)

      for (var i = 0, len = resolutions.length; i < len; ++i) {
        resolutions[i] = startResolution / Math.pow(2, i)
      }
      let extent = [2000, -1500, 12000, 4000] // 地图范围 默认高河地图范围
      if (row) {
        extent = [parseInt(row.minX), parseInt(row.minY), parseInt(row.maxX), parseInt(row.maxY)]
      } else if (chooseMap) {
        extent = [parseInt(chooseMap.minX), parseInt(chooseMap.minY), parseInt(chooseMap.maxX), parseInt(chooseMap.maxY)]
      }
      let tileGrid = new ol.tilegrid.TileGrid({
        extent: extent,
        resolutions: resolutions,
        tileSize: [512, 256]
      })
      let tileWmsOpts = mapDef.tileWmsOpts
      let wmsLayer
      tileWmsOpts.tileGrid = tileGrid
      let mapType = mapDef.type
      if (!mapDef.type) {
        let str = mapDef.tileWmsOpts.url
        mapType = mapDef.tileWmsOpts.url.includes('wms')
        mapType = mapType ? 'wms' : 'wmts'
      }
      chooseMap = { map_type: mapType }
      if (mapType === 'wmts') {
        chooseMap.url = tileWmsOpts.url
        chooseMap.layers = tileWmsOpts.params.LAYERS
        chooseMap.matrixId = DEAFULT_MAP_MATRIXID
      }

      if (chooseMap.map_type === 'wms') {
        wmsLayer = new ol.layer.Tile({
          source: new ol.source.TileWMS(tileWmsOpts)
        })
      } else if (chooseMap.map_type === 'wmts') {
        let matrixIds = []
        let resolution = []
        let startResolutions = ol.extent.getHeight(extent) / 256
        for (let i = 0; i <= spliceLevel; i++) {
          matrixIds[i] = chooseMap.matrixId + i
          resolution[i] = startResolutions / Math.pow(2, i)
        }
        let matrixSet = chooseMap.matrixId && chooseMap.matrixId.slice(0, chooseMap.matrixId.indexOf(':'))
        wmsLayer = new ol.layer.Tile({
          source: new ol.source.WMTS({
            url: chooseMap.url,
            layer: chooseMap.layers,
            tileGrid: new ol.tilegrid.WMTS({
              extent: extent,
              resolutions: resolution,
              matrixIds: matrixIds,
              tileSize: [256, 256]
            }),
            matrixSet: matrixSet,
            format: 'image/png',
            projection: 'EPSG:3857'
          })
        })
      } else {
        console.warn('unknow map type!')
      }
      window.wmsLayer = wmsLayer

      let view = new ol.View(mapDef.viewOpts)
      let m = {
        layers: [wmsLayer],
        overlays: [], // overlays: [tooltips],
        target: containerName,
        view: view,
        controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        })
      }
      let olmap = new ol.Map(m)
      olmap.on('pointermove', function (e) {
        let pixel = olmap.getEventPixel(e.originalEvent)
        let hit = olmap.hasFeatureAtPixel(pixel)
        olmap.getTargetElement().style.cursor = hit ? 'pointer' : ''
      })
      commit('storeMap', {
        mapID: mapID,
        map: olmap,
        view: view
      })
    }
  }
}
