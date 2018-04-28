import TWEEN from '@tweenjs/tween.js'
/**
   * 获得初始位置，如果前一次动画存在，中断之
   * @param {*} obj
   * @param {*} positionObj
   * @return [x, y]
   */
function getStartPosition (obj, positionObj) {
  let startPosition = stopPreviewAnimation(obj, positionObj)
  if (!startPosition) {
    let geometry = obj.getGeometry()
    startPosition = geometry && geometry.getCoordinates()
  }

  return startPosition
}

/**
 * 如果上一次动画尚未完成，则结束上一次动画，并将对象直接移动到上一次动画的目标位置，并返回该位置
 * @param {*} obj 图标对象
 * @param {*} positionObj 定位动画对象（水纹扩散动画）
 */
function stopPreviewAnimation (obj, positionObj) {
  let ret = null
  let isStopped = stopAnimationLoop(obj)
  if (isStopped) {
    // 注意：中断动画时，需要同时停掉 tween，否则会触发 tween.onComplete()
    stopTween(obj)

    // 如果是主动中断的动画，需要把坐标移动到目标位置
    ret = obj.get('xpos')
    moveto(obj, positionObj, ret)
  }

  return ret
}

/**
 *  停止 obj 上的动画循环
 * @param {*} obj
 * @return 是否中断
 */
function stopAnimationLoop (obj) {
  let ret = false
  let preRaf = obj && obj.get('rafId')
  if (preRaf && parseInt(preRaf, 10) > 0) {
    // 取消队列中的 animation frame，就不会执行 doAnimate()，相当于中断了 animation loop。
    cancelAnimationFrame(preRaf)
    obj.set('rafId', null)

    ret = true
  }

  return ret
}

/**
 * Stop the tween on obj
 * @param {*} obj
 */
function stopTween (obj) {
  let tween = obj.get('xtween')
  if (tween) {
    tween.stop()
    obj.set('xtween', null)
  }
}

/**
 * 在地图上，将 obj、pObj 移动到 pos 位置
 * @param {*} obj OpenLayers 对象
 * @param {*} pObj OpenLayers Overlay对象
 * @param {*} pos 坐标[x,y]
 * @return {*} 坐标
 */
function moveto (obj, pObj, pos) {
  let geometry = obj && obj.getGeometry()
  pObj && pObj.setPosition(pos)
  geometry && geometry.setCoordinates(pos)
}

export {getStartPosition, stopPreviewAnimation, stopAnimationLoop, stopTween, moveto}