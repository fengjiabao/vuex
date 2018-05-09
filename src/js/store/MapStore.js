import {DEFAULT_MAP_ID, ZOOM_LEVEL} from '../def/map_def.js'
export default {
  namespaced: true,
  state: {
    gisMap: new Map(),
    maps: new Map(),
    mapData: [],
    defaultMapData: null,
    loadMap: false,
    defaultMapID: null,
    map: null,
    row: null
  },
  mutations: {
    defaultMap (state, row) {
      let tiled = Number(row.judge_id) === 0 ? 'false' : true
      let params = {
        'LAYERS': row.layers,
        'TILED': tiled
      }
      let center = [Number(row.x), Number(row.y)]
      let size = [Number(row.width), Number(row.height)]
      let defaultMap = {
        id: row.map_id,
        type: row.map_type,
        tileWmsOpts: {
          url: row.url,
          params: params,
          serverType: 'geoserver'
        },
        viewOpts: {
          center: center,
          size: size,
          zoom: ZOOM_LEVEL.SMALL, // default zoom
          maxZoom: ZOOM_LEVEL.MAX,
          minZoom: ZOOM_LEVEL.MIN
        }
      }
      state.maps.set(defaultMap.id, defaultMap)
      state.mapData.push(defaultMap)
    },
    loadGisMap (state, val) {
      state.defaultMapID = val.id
      state.map = val.map
      state.row = val.row
      state.loadMap = true
    }
  },
  actions: {
    saveGisMap ({state, dispatch, commit}, rows) {
      if (!rows) return
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        state.gisMap.set(row.map_id, row)
        commit('defaultMap', row)
        if (row.default_map === '是') {
          state.defaultMapData = row
        }
      }
      if (!state.defaultMapData) { // 没有默认字段填写时，为第一张地图
        state.defaultMapData = rows[0]
      }
      state.defaultMapData && dispatch('storeDefaultMap')
    },
    storeDefaultMap ({state, commit, dispatch}) {
      let defaultMapData = state.defaultMapData
      let localMap = JSON.parse(window.localStorage.getItem('map'))
      let localMapRow = JSON.parse(window.localStorage.getItem('maprow'))
      let mapData = state.maps.get(defaultMapData.map_id)
      let map = state.maps.values() ? mapData : null
      if (!localMap && !localMapRow) { // 若第一次没local缓存，待数据存储成功再次加载map
        commit('loadGisMap', {
          id: 5,
          map: map,
          row: defaultMapData
        })
      } else if (localMap && localMapRow) {
        commit('loadGisMap', {
          id: 5,
          map: localMap,
          row: localMapRow
        })
      }
      let storeMap = JSON.stringify(mapData)
      let storeMapRow = JSON.stringify(defaultMapData)
      window.localStorage.setItem('map', storeMap)
      window.localStorage.setItem('maprow', storeMapRow)
    }
  }
}
