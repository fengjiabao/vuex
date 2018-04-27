function getNomalCmd (state, data) {
    let cmd = 'POSITION'
    let areaTypeName = data.areaTypeName
    let cardID = data.cardID
    if (state.nosignalscars.has(cardID)) { // 该卡有信号时,如果之前为无信号状态,则删除该卡
      state.nosignalscars.delete(cardID)
    }
    if (areaTypeName === UNCOVER) {
      if (!state.uncovercards.has(cardID)) {
        state.uncovercards.set(cardID, true)
        cmd = 'UNCOVER' // 非覆盖区域,防止推实时数据时,非覆盖区域卡乱动
      } else {
        cmd = 'NOCHANGE'
      }
    } else {
      if (areaTypeName === SPECIAL) {
        cmd = 'SPECIAL' // 胶轮车存放硐室,无label
      }
      state.uncovercards.delete(cardID)
    }
    return cmd
}

export { getNomalCmd }