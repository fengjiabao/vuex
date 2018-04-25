import ol from 'openlayers'
import {ZOOM_LEVEL} from '../def/map_def.js'
import {mapIcon} from '../def/map_icon.js'
let vehiclePoint = mapIcon.vehiclePoint
let vehicleIcon = mapIcon.vehicle
let staffIcon = mapIcon.staff
function drawSymbol (attributes, source, map) {
  let type = null
  let geo = new ol.geom.Point([attributes.x, -attributes.y])
  let feature = new ol.Feature(geo)
  feature.setId(attributes['data-id'])
  feature.setProperties(attributes)

  let dataType = attributes['data-subtype']
  let state = attributes['card_state']
  let viewZoom = map.getView().getZoom()
  switch (dataType) {
    case 'staff':
      feature.setStyle(createLabelStyleStaff(feature, type, state, viewZoom, map))
      break
    case 'vehicle':
      feature.setStyle(createLabelStyle(feature, type, viewZoom, '', map))
      break
  }
  source.addFeature(feature)
  return feature
}

function createLabelStyleStaff (feature, type, state, viewZoom, map) {
  let id = feature.get('data-id')
  let name = String(id)
  let view = map.getView()
  let p = {
    scale: 0.12,
    rotateWithView: true
  }
  let t = {
    fill: new ol.style.Fill({
      color: 'red'
    }),
    stroke: new ol.style.Stroke({
      lineCap: 'square',
      color: '#fff',
      miterLimit: 20,
      width: 10
    }),
    offsetY: -45
  }
  if (viewZoom < ZOOM_LEVEL.STAFFLEAVE) {
    view.setProperties({zoomLevel: 'STAFFSMALL'})
    p.src = staffIcon.point.img
    p.scale = 0.015
    t.name = ''
  } else {
    if (viewZoom >= 21 && viewZoom < 22) {
      p.scale = 0.08
    } else {
      p.scale = 0.12
    }
    view.setProperties({zoomLevel: 'MAX'})
    p.src = staffIcon.normal.img
    t.text = name
  }
  return new ol.style.Style({
    image: new ol.style.Icon(p),
    text: new ol.style.Text(t)
  })
}

function createLabelStyle (feature, type, viewZoom, rotation, map) {
  let carcolor = 'green'
  let p = {
    rotateWithView: true,
    src: vehicleIcon[carcolor + 'car'].img,
    scale: 0.28
  }
  let t = {
    text: String(feature.get('data-id')),
    font: '12px',
    fill: new ol.style.Fill({
      color: 'red'
    }),
    stroke: new ol.style.Stroke({
      lineCap: 'square',
      color: '#fff',
      miterLimit: 20,
      width: 10
    }),
    offsetY: -35
  }
  return new ol.style.Style({
    image: new ol.style.Icon(p),
    text: new ol.style.Text(t)
  })
}

export {drawSymbol}
