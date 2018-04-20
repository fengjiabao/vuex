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

export {dealSpecialId, toJson}
