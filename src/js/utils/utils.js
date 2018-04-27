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

function commitBindCardObj ({commit}, cardID) {
  commit('getCardInfo', cardID)
  commit('getCardTypeID')
  commit('getCardTypeInfo')
  commit('getCardTypeName')
}

export {dealSpecialId, toJson, concatObject, commitBindCardObj}
