import specialTable from '../def/special_tablekey_def.js'
function dealSpecialId (name, keyName) {
  return specialTable[name] ? specialTable[name] : keyName
}

export {dealSpecialId}
