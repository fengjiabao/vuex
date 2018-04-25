import ol from 'openlayers'
let mapIcon = {
  'vehiclePoint': {
    'red': {img: '../../../static/image/redpoint.png'},
    'green': {img: '../../../static/image/greenpoint.png'},
    'yellow': {img: '../../../static/image/yellowpoint.png'}
  },
  'staff': {
    'nosignal': {
      img: '../../../static/image/specialstaff.png'
    },
    'normal': {
      img: '../../../static/image/standstaff.png'
    },
    'unregistered': {
      img: '../../../static/image/unregisteredstaff.png'
    },
    'monkey': {
      img: '../../../static/image/monkeycar.png'
    },
    'point': {
      img: '../../../static/image/greenpoint.png'
    }
  },
  'vehicle': {
    'nosignal': {
      img: '../../../static/image/special.png'
    },
    'greencar': {
      img: '../../../static/image/greencar.png'
    },
    'yellowcar': {
      img: '../../../static/image/yellowcar.png'
    },
    'redcar': {
      img: '../../../static/image/redcar.png'
    },
    'unregistered': {
      img: '../../../static/image/unregisteredvehicle.png'
    },
    'tunnel': {
      img: '../../../static/image/drivevehicle.png'
    }
  },
  'track': {
    'route': new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 6, color: [237, 212, 0, 0.8]
      })
    }),
    'patrolPath': new ol.style.Style({
      stroke: new ol.style.Stroke({
        width: 6, color: 'mediumseagreen'
      })
    }),
    'endMarker': new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: '../../icons/endMarker.png'
      })
    }),
    'startMarker': new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: '../../icons/startMarker.png'
      })
    }),
    'start': new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: '../../icons/start.png'
      })
    }),
    'end': new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: '../../icons/end.png'
      })
    }),
    'geoMarker': new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        snapToPixel: false,
        fill: new ol.style.Fill({ color: 'black' }),
        stroke: new ol.style.Stroke({
          color: 'white', width: 2
        })
      })
    })
  },
  'landmark': new ol.style.Style({
    image: new ol.style.Icon({
      src: '../../img/landmarker.png',
      scale: 0.08,
      rotateWithView: true
    })
  }),
  'workface': new ol.style.Style({
    image: new ol.style.Icon({
      src: '../../img/jue.png',
      scale: 0.5,
      rotateWithView: true
    })
  })
}

export {mapIcon}
