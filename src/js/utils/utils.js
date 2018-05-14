import specialTable from '../def/special_tablekey_def.js'
function dealSpecialId (name, keyName) {
  return specialTable[name] ? specialTable[name] : keyName
}

function toJson (data) {
  if (typeof data === 'object') {
    return data
  }

  let ret = null
  if (data && (typeof data === 'string')) {
    try {
      ret = JSON.parse(data)
    } catch (error) {
      console.warn('Can NOT parse the input data to be JSON : ', data)
    }
  } else {
    console.warn('The input data\'s type is NOT string : ', data)
  }

  return ret
}

function concatObject (obj1, obj2) {
  for (var key in obj2) {
    if (obj1.hasOwnProperty(key)) continue// 有相同的属性则略过
    obj1[key] = obj2[key]
  }
  return obj1
}

Date.prototype.format = function (format) { // eslint-disable-line
  let o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    'S': this.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

function paddingLeft (i) {
  let ret = '' + i
  if (i < 10) {
    ret = '0' + i
  }

  return ret
}

// 将毫秒数格式化为 hh:mm:ss 格式
function formatElapsedTime (ms) {
  if (ms <= 0) {
    return '00:00:00'
  }

  const h = 60 * 60 * 1000
  const m = 60 * 1000
  const s = 1000

  let hh = Math.floor(ms / h)
  let mm = Math.floor(ms % h / m)
  let ss = Math.floor(ms % h % m / s)

  let shh = paddingLeft(hh)
  let smm = paddingLeft(mm)
  let sss = paddingLeft(ss)

  return shh + ':' + smm + ':' + sss
}

// 判断各种浏览器，找到正确的进入全屏的方法
// element : 需要全屏的 node
function requestFullScreen (element) {
  let requestMethod = element.requestFullScreen || // W3C
        element.webkitRequestFullScreen || // Chrome等
        element.mozRequestFullScreen || // FireFox
        element.msRequestFullScreen // IE11
  if (requestMethod) {
    requestMethod.call(element)
  }
}

// 判断各种浏览器，找到正确的退出全屏的方法
function exitFullScreen () {
  let exitMethod = document.cancelFullScreen || // W3C
        document.webkitCancelFullScreen || // Chrome等
        document.mozCancelFullScreen || // FireFox
        document.msExitFullscreen // IE11
  if (exitMethod) {
    exitMethod.call(document)
  }
}

// 取消呼叫
function cancelCallCard (readers, cards, userName) {
  let message = {
    cmd: 'call_card_cancel_req',
    data: {
      call_type_id: 0,
      user_name: userName,
      call_time: new Date().getTime(),
      stations: readers,
      cards: cards
    }
  }
  return message
}

// 呼叫
function callCards (type, time, userName) {
  let message = null
  if (type === 1) {

  } else {
    message = { // 一键撤离(全员呼叫)，紧急呼叫2
      cmd: 'call_card_req',
      data: {
        call_type_id: 0,
        call_time_out: 5,
        call_level_id: 2,
        user_name: userName,
        call_time: new Date().getTime(),
        stations: [{
          stationid: 0
        }],
        cards: [{
          cardid: '0',
          cardtype: 1
        }]
      }
    }
  }
  return message
}

export {dealSpecialId, toJson, concatObject, formatElapsedTime, requestFullScreen, exitFullScreen, cancelCallCard, callCards}
