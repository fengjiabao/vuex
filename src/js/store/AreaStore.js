import ol from 'openlayers'
import {convertSVGPath2Coord} from '../utils/OlMapUtils.js'
const UNCOVER = 1000
export default {
  namespaced: true,
  state: {
    arealist: new Map(),
    uncoverAreaList: new Map()
  },
  mutations: {
    setAreaList (state, rows) {
      if (!rows) return
      for (let area of rows) {
        if (area.path) {
          let coordinates = convertSVGPath2Coord(area.path)
          let polygon = new ol.geom.Polygon([coordinates])
          state.arealist.set(area.area_id, polygon)
          if (area.area_type_id === UNCOVER) {
            state.uncoverAreaList.set(area.area_id, polygon)
          }
        }
      }
    }
  },
  actions: {
    initAreaList ({state, commit}, data) {
      commit('setAreaList', data)
    }
  }
}
