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

export {dealSpecialId, toJson, concatObject, formatElapsedTime}
